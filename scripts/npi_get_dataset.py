import requests
import pandas as pd

output_path = "~/notes/749369 June 30 2025 individual doulas NPI.csv"

all_providers = []
keep_looping = True
loop_index = 0
while keep_looping:
    num_records_per_loop = 200
    url = f"https://npiregistry.cms.hhs.gov/api/?taxonomy_description=Doula&state=NJ&limit=200&skip={loop_index * num_records_per_loop}&pretty=&enumeration_type=NPI-1&version=2.1"
    responses = requests.get(url).json()
    all_providers = all_providers + responses["results"]
    if responses["result_count"] < num_records_per_loop:
        keep_looping = False
    loop_index += 1

print(f"Looped {loop_index + 1} times, got {len(all_providers)} records")

all_keys = set()
for provider in all_providers:
    all_keys = all_keys.union(provider.keys())

"""
{'addresses',
 'basic',
 'created_epoch',
 'endpoints',
 'enumeration_type',
 'identifiers',
 'last_updated_epoch',
 'number',
 'other_names',
 'practiceLocations',
 'taxonomies'}
"""

# Just come curious poking

[
    provider
    for provider in all_providers
    if not (provider["identifiers"] == [] or len(provider["identifiers"]) == 1)
]
# some have two identifiers


def has_two_addresses_one_mailing_one_location(provider) -> bool:
    purpose_sorted_addresses = sorted(
        provider["addresses"], key=lambda x: x["address_purpose"]
    )
    return (
        len(provider["addresses"]) == 2
        and purpose_sorted_addresses[0]["address_purpose"] == "LOCATION"
        and purpose_sorted_addresses[1]["address_purpose"] == "MAILING"
    )


def address_mailing_and_location_have_same_street(provider) -> bool:
    purpose_sorted_addresses = sorted(
        provider["addresses"], key=lambda x: x["address_purpose"]
    )
    return (
        purpose_sorted_addresses[0]["address_1"]
        == purpose_sorted_addresses[1]["address_1"]
    )


len(
    [
        provider
        for provider in all_providers
        if not address_mailing_and_location_have_same_street(provider)
    ]
)
# 89
len([provider for provider in all_providers if not provider["practiceLocations"] == []])
# 20
len(
    [
        provider
        for provider in [
            provider
            for provider in all_providers
            if not provider["practiceLocations"] == []
        ]
        if not address_mailing_and_location_have_same_street(provider)
    ]
)
# len
len([provider for provider in all_providers if len(provider["practiceLocations"]) > 1])
# 2
len([provider for provider in all_providers if len(provider["endpoints"]) > 0])
# 34

len([provider for provider in all_providers if len(provider["other_names"]) > 0])
# 26
[
    [name["type"] for name in provider["other_names"]]
    for provider in all_providers
    if len(provider["other_names"]) > 0
]
# former name, professional name, other name

# Making assertions that enable us to do some data flattening. Breaking these doesn't mean that the data is wrong, it just means that the code wasn't written to handle it
assert all(
    [has_two_addresses_one_mailing_one_location(provider) for provider in all_providers]
)
# assert all([provider["identifiers"] == [] or len(provider["identifiers"]) == 1 for provider in all_providers])

len(
    [
        provider
        for provider in all_providers
        if "certification_date" not in provider["basic"]
    ]
)
# 71
# https://verisys.com/blog/what-are-npi-numbers-and-why-are-they-important/
# Enumeration Date: The date the NPI was issued.
len(
    [
        provider
        for provider in all_providers
        if "enumeration_date" not in provider["basic"]
    ]
)
# 0


def has_primary_taxonomy(provider) -> bool:
    return any(taxonomy["primary"] for taxonomy in provider["taxonomies"])


len([provider for provider in all_providers if not has_primary_taxonomy(provider)])
# 1


def has_no_more_than_one_primary_taxonomy(provider) -> bool:
    return (
        len([taxonomy for taxonomy in provider["taxonomies"] if taxonomy["primary"]])
        <= 1
    )


len(
    [
        provider
        for provider in all_providers
        if not has_no_more_than_one_primary_taxonomy(provider)
    ]
)
# 0
assert all(
    [has_no_more_than_one_primary_taxonomy(provider) for provider in all_providers]
)


def has_doula_taxonomy_desc_and_code(provider) -> bool:
    doula_taxonomies = [
        taxonomy for taxonomy in provider["taxonomies"] if taxonomy["desc"] == "Doula"
    ]
    if len(doula_taxonomies) != 1:
        return False
    if doula_taxonomies[0]["code"] != "374J00000X":
        return False
    return True


len(
    [
        provider
        for provider in all_providers
        if not has_doula_taxonomy_desc_and_code(provider)
    ]
)
# 8
# Some have multiple doula taxonomies, primary and not


def has_at_least_one_doula_taxonomy_desc_and_code(provider) -> bool:
    doula_taxonomies = [
        taxonomy for taxonomy in provider["taxonomies"] if taxonomy["desc"] == "Doula"
    ]
    if len(doula_taxonomies) < 1:
        return False
    if any(
        doula_taxonomy["code"] != "374J00000X" for doula_taxonomy in doula_taxonomies
    ):
        return False
    return True


len(
    [
        provider
        for provider in all_providers
        if not has_at_least_one_doula_taxonomy_desc_and_code(provider)
    ]
)
# 0
assert all(
    [
        has_at_least_one_doula_taxonomy_desc_and_code(provider)
        for provider in all_providers
    ]
)


# Getting to the point
def flatten_provider_attribute(provider, attributeName: str, newAttributeName=None):
    return {
        **{
            f"{newAttributeName if newAttributeName else attributeName}_{index+1}_{key}": value
            for index, attribute in enumerate(provider[attributeName])
            for key, value in attribute.items()
        }
    }


def flatten_provider(provider):
    # addresses
    purpose_sorted_addresses = sorted(
        provider["addresses"], key=lambda x: x["address_purpose"]
    )
    assert len(provider["addresses"]) == 2
    location_address = purpose_sorted_addresses[0]
    mailing_address = purpose_sorted_addresses[1]
    assert location_address["address_purpose"] == "LOCATION"
    assert mailing_address["address_purpose"] == "MAILING"

    # taxonomies
    primary_taxonomy = next(
        (
            {f"taxonomy_1_primary_{key}": value for key, value in taxonomy.items()}
            for taxonomy in provider["taxonomies"]
            if taxonomy["primary"]
        ),
        {},
    )

    # sort with doula first, then by code
    other_taxonomies = sorted(
        [taxonomy for taxonomy in provider["taxonomies"] if not taxonomy["primary"]],
        key=lambda x: (x["desc"] == "Doula", x["code"]),
        reverse=[True, False],
    )

    flattened_other_taxonomies = {
        **{
            f"taxonomy_{index+2}_{key}": value
            for index, taxonomy in enumerate(other_taxonomies)
            for key, value in taxonomy.items()
        }
    }

    flattened_provider_data = {
        "created_epoch": provider["created_epoch"],
        "enumeration_type": provider["enumeration_type"],
        "last_updated_epoch": provider["last_updated_epoch"],
        "number": provider["number"],
        **{f"mailing_{key}": value for key, value in mailing_address.items()},
        **{f"location_{key}": value for key, value in location_address.items()},
        **{
            f"practice_location_{index+1}_{key}": value
            for index, location in enumerate(provider["practiceLocations"])
            for key, value in location.items()
        },
        **provider["basic"],
        **primary_taxonomy,
        "other_taxonomies_summary": ", ".join(
            [taxonomy["desc"] for taxonomy in other_taxonomies]
        ),
        **flattened_other_taxonomies,
        **flatten_provider_attribute(provider, "identifiers"),
        **flatten_provider_attribute(provider, "endpoints", "other_contact"),
        **flatten_provider_attribute(provider, "other_names"),
    }
    return flattened_provider_data


all_providers_flattened = [flatten_provider(provider) for provider in all_providers]

df = pd.DataFrame.from_dict(all_providers_flattened)

columns_in_desired_order = [
    "number",
    # personal info
    "name_prefix",
    "first_name",
    "middle_name",
    "last_name",
    "name_suffix",
    "credential",
    "sole_proprietor",
    "sex",
    # date and time
    "enumeration_date",
    "certification_date",  # not everyone has this
    "last_updated",
    "created_epoch",
    "last_updated_epoch",
    # useful address fields
    "mailing_address_1",
    "mailing_address_2",
    "mailing_city",
    "mailing_state",
    "mailing_postal_code",
    "mailing_telephone_number",  # not everyone has this
    "mailing_fax_number",  # not everyone has this
    "location_address_1",
    "location_address_2",
    "location_city",
    "location_state",
    "location_postal_code",
    "location_telephone_number",
    "location_fax_number",
    # other names
    "other_names_1_type",
    "other_names_1_code",
    "other_names_1_credential",
    "other_names_1_first_name",
    "other_names_1_last_name",
    "other_names_1_middle_name",
    "other_names_1_prefix",
    "other_names_1_suffix",
    # fields that always have the same data
    "enumeration_type",
    "status",
    "mailing_address_purpose",
    "mailing_address_type",
    "mailing_country_code",
    "mailing_country_name",
    "location_address_purpose",
    "location_address_type",
    "location_country_code",
    "location_country_name",
    # practice location
    "practice_location_1_country_code",
    "practice_location_1_country_name",
    "practice_location_1_address_purpose",
    "practice_location_1_address_type",
    "practice_location_1_address_1",
    "practice_location_1_city",
    "practice_location_1_state",
    "practice_location_1_postal_code",
    "practice_location_1_telephone_number",
    "practice_location_1_fax_number",
    "practice_location_2_country_code",
    "practice_location_2_country_name",
    "practice_location_2_address_purpose",
    "practice_location_2_address_type",
    "practice_location_2_address_1",
    "practice_location_2_city",
    "practice_location_2_state",
    "practice_location_2_postal_code",
    "practice_location_2_telephone_number",
    # primary taxonomy and summary
    "taxonomy_1_primary_code",
    "taxonomy_1_primary_taxonomy_group",
    "taxonomy_1_primary_desc",
    "taxonomy_1_primary_state",
    "taxonomy_1_primary_license",
    "taxonomy_1_primary_primary",
    "other_taxonomies_summary",
    # identifiers
    "identifiers_1_code",
    "identifiers_1_desc",
    "identifiers_1_issuer",
    "identifiers_1_identifier",
    "identifiers_1_state",
    "identifiers_2_code",
    "identifiers_2_desc",
    "identifiers_2_issuer",
    "identifiers_2_identifier",
    "identifiers_2_state",
    # endpoints aka other_contact
    "other_contact_1_endpointType",
    "other_contact_1_endpointTypeDescription",
    "other_contact_1_endpoint",
    "other_contact_1_affiliation",
    "other_contact_1_use",
    "other_contact_1_useDescription",
    "other_contact_1_contentTypeDescription",
    "other_contact_1_country_code",
    "other_contact_1_country_name",
    "other_contact_1_address_type",
    "other_contact_1_address_1",
    "other_contact_1_city",
    "other_contact_1_state",
    "other_contact_1_postal_code",
    "other_contact_1_endpointDescription",
    "other_contact_1_affiliationName",
    "other_contact_1_contentType",
    "other_contact_1_address_2",
    "other_contact_1_contentOtherDescription",
    "other_contact_2_endpointType",
    "other_contact_2_endpointTypeDescription",
    "other_contact_2_endpoint",
    "other_contact_2_affiliation",
    "other_contact_2_useDescription",
    "other_contact_2_contentTypeDescription",
    "other_contact_2_country_code",
    "other_contact_2_country_name",
    "other_contact_2_address_type",
    "other_contact_2_address_1",
    "other_contact_2_city",
    "other_contact_2_state",
    "other_contact_2_postal_code",
    "other_contact_2_endpointDescription",
    "other_contact_2_use",
    "other_contact_2_contentType",
    "other_contact_2_contentOtherDescription",
    "other_contact_3_endpointType",
    "other_contact_3_endpointTypeDescription",
    "other_contact_3_endpoint",
    "other_contact_3_affiliation",
    "other_contact_3_useDescription",
    "other_contact_3_contentTypeDescription",
    "other_contact_3_country_code",
    "other_contact_3_country_name",
    "other_contact_3_address_type",
    "other_contact_3_address_1",
    "other_contact_3_city",
    "other_contact_3_state",
    "other_contact_3_postal_code",
    # other taxonomies details
    "taxonomy_2_code",
    "taxonomy_2_taxonomy_group",
    "taxonomy_2_desc",
    "taxonomy_2_state",
    "taxonomy_2_license",
    "taxonomy_2_primary",
    "taxonomy_3_code",
    "taxonomy_3_taxonomy_group",
    "taxonomy_3_desc",
    "taxonomy_3_state",
    "taxonomy_3_license",
    "taxonomy_3_primary",
    "taxonomy_4_code",
    "taxonomy_4_taxonomy_group",
    "taxonomy_4_desc",
    "taxonomy_4_state",
    "taxonomy_4_license",
    "taxonomy_4_primary",
    "taxonomy_5_code",
    "taxonomy_5_taxonomy_group",
    "taxonomy_5_desc",
    "taxonomy_5_state",
    "taxonomy_5_license",
    "taxonomy_5_primary",
    "taxonomy_6_code",
    "taxonomy_6_taxonomy_group",
    "taxonomy_6_desc",
    "taxonomy_6_state",
    "taxonomy_6_license",
    "taxonomy_6_primary",
    "taxonomy_7_code",
    "taxonomy_7_taxonomy_group",
    "taxonomy_7_desc",
    "taxonomy_7_state",
    "taxonomy_7_license",
    "taxonomy_7_primary",
    "taxonomy_8_code",
    "taxonomy_8_taxonomy_group",
    "taxonomy_8_desc",
    "taxonomy_8_state",
    "taxonomy_8_license",
    "taxonomy_8_primary",
    "taxonomy_9_code",
    "taxonomy_9_taxonomy_group",
    "taxonomy_9_desc",
    "taxonomy_9_state",
    "taxonomy_9_license",
    "taxonomy_9_primary",
    "taxonomy_10_code",
    "taxonomy_10_taxonomy_group",
    "taxonomy_10_desc",
    "taxonomy_10_state",
    "taxonomy_10_license",
    "taxonomy_10_primary",
]

assert set(df.columns) == set(columns_in_desired_order)

df = df[columns_in_desired_order]

assert len(df["enumeration_type"].unique()) == 1

df_primary_doula = df[df["taxonomy_1_primary_code"] == "374J00000X"].reset_index(
    drop=True
)

len(df_primary_doula)
# 568

df_not_primary_doula = df[df["taxonomy_1_primary_code"] != "374J00000X"].reset_index(
    drop=True
)
len(df_not_primary_doula)
# 50
df_not_primary_doula[["taxonomy_1_primary_desc", "other_taxonomies_summary"]]
df_not_primary_doula["taxonomy_1_primary_desc"].value_counts()

# Primary taxonomies of people with doula as secondary
"""
Lactation Consultant, Non-RN                     13
Massage Therapist                                 4
Advanced Practice Midwife                         4
Behavior Technician                               3
Midwife                                           3
Counselor, Mental Health                          3
Licensed Practical Nurse                          2
Specialist                                        2
Health Educator                                   2
Physical Therapist                                2
Naturopath                                        2
Social Worker                                     2
Counselor, Addiction (Substance Use Disorder)     1
Counselor, Professional                           1
Registered Nurse, Maternal Newborn                1
Social Worker, Clinical                           1
Midwife, Lay                                      1
Community/Behavioral Health                       1
Marriage & Family Therapist                       1
"""

assert (df["enumeration_type"] == "NPI-1").all()

always_nonnull_cols = [
    "created_epoch",
    "enumeration_type",
    "last_updated_epoch",
    "number",
    "first_name",
    "last_name",
    "sole_proprietor",
    "sex",
    "enumeration_date",
    "last_updated",
    "status",
    "mailing_country_code",
    "mailing_country_name",
    "mailing_address_purpose",
    "mailing_address_type",
    "mailing_address_1",
    "mailing_city",
    "mailing_state",
    "mailing_postal_code",
    "location_country_code",
    "location_country_name",
    "location_address_purpose",
    "location_address_type",
    "location_address_1",
    "location_city",
    "location_state",
    "location_postal_code",
    "location_telephone_number",
    "other_taxonomies_summary",  # this probably has empty strings
]

assert df[always_nonnull_cols].notnull().all().all()
sometimes_null_cols = [
    column for column in df.columns if column not in set(always_nonnull_cols)
]

sometimes_null_cols
"""
['certification_date',
 'name_prefix',
 'middle_name',
 'name_suffix',
 'credential',
 'other_names_1_type',
 'other_names_1_code',
 'other_names_1_credential',
 'other_names_1_first_name',
 'other_names_1_last_name',
 'other_names_1_middle_name',
 'other_names_1_prefix',
 'other_names_1_suffix',
 'mailing_address_2',
 'mailing_telephone_number',
 'mailing_fax_number',
 'location_address_2',
 'location_fax_number',
 'practice_location_1_country_code',
 'practice_location_1_country_name',
 'practice_location_1_address_purpose',
 'practice_location_1_address_type',
 'practice_location_1_address_1',
 'practice_location_1_city',
 'practice_location_1_state',
 'practice_location_1_postal_code',
 'practice_location_1_telephone_number',
 'practice_location_1_fax_number',
 'practice_location_2_country_code',
 'practice_location_2_country_name',
 'practice_location_2_address_purpose',
 'practice_location_2_address_type',
 'practice_location_2_address_1',
 'practice_location_2_city',
 'practice_location_2_state',
 'practice_location_2_postal_code',
 'practice_location_2_telephone_number',
 'taxonomy_1_primary_code',
 'taxonomy_1_primary_taxonomy_group',
 'taxonomy_1_primary_desc',
 'taxonomy_1_primary_state',
 'taxonomy_1_primary_license',
 'taxonomy_1_primary_primary',
 'identifiers_1_code',
 'identifiers_1_desc',
 'identifiers_1_issuer',
 'identifiers_1_identifier',
 'identifiers_1_state',
 'identifiers_2_code',
 'identifiers_2_desc',
 'identifiers_2_issuer',
 'identifiers_2_identifier',
 'identifiers_2_state',
 'other_contact_1_endpointType',
 'other_contact_1_endpointTypeDescription',
 'other_contact_1_endpoint',
 'other_contact_1_affiliation',
 'other_contact_1_use',
 'other_contact_1_useDescription',
 'other_contact_1_contentTypeDescription',
 'other_contact_1_country_code',
 'other_contact_1_country_name',
 'other_contact_1_address_type',
 'other_contact_1_address_1',
 'other_contact_1_city',
 'other_contact_1_state',
 'other_contact_1_postal_code',
 'other_contact_1_endpointDescription',
 'other_contact_1_affiliationName',
 'other_contact_1_contentType',
 'other_contact_1_address_2',
 'other_contact_1_contentOtherDescription',
 'other_contact_2_endpointType',
 'other_contact_2_endpointTypeDescription',
 'other_contact_2_endpoint',
 'other_contact_2_affiliation',
 'other_contact_2_useDescription',
 'other_contact_2_contentTypeDescription',
 'other_contact_2_country_code',
 'other_contact_2_country_name',
 'other_contact_2_address_type',
 'other_contact_2_address_1',
 'other_contact_2_city',
 'other_contact_2_state',
 'other_contact_2_postal_code',
 'other_contact_2_endpointDescription',
 'other_contact_2_use',
 'other_contact_2_contentType',
 'other_contact_2_contentOtherDescription',
 'other_contact_3_endpointType',
 'other_contact_3_endpointTypeDescription',
 'other_contact_3_endpoint',
 'other_contact_3_affiliation',
 'other_contact_3_useDescription',
 'other_contact_3_contentTypeDescription',
 'other_contact_3_country_code',
 'other_contact_3_country_name',
 'other_contact_3_address_type',
 'other_contact_3_address_1',
 'other_contact_3_city',
 'other_contact_3_state',
 'other_contact_3_postal_code',
 'taxonomy_2_code',
 'taxonomy_2_taxonomy_group',
 'taxonomy_2_desc',
 'taxonomy_2_state',
 'taxonomy_2_license',
 'taxonomy_2_primary',
 'taxonomy_3_code',
 'taxonomy_3_taxonomy_group',
 'taxonomy_3_desc',
 'taxonomy_3_state',
 'taxonomy_3_license',
 'taxonomy_3_primary',
 'taxonomy_4_code',
 'taxonomy_4_taxonomy_group',
 'taxonomy_4_desc',
 'taxonomy_4_state',
 'taxonomy_4_license',
 'taxonomy_4_primary',
 'taxonomy_5_code',
 'taxonomy_5_taxonomy_group',
 'taxonomy_5_desc',
 'taxonomy_5_state',
 'taxonomy_5_license',
 'taxonomy_5_primary',
 'taxonomy_6_code',
 'taxonomy_6_taxonomy_group',
 'taxonomy_6_desc',
 'taxonomy_6_state',
 'taxonomy_6_license',
 'taxonomy_6_primary',
 'taxonomy_7_code',
 'taxonomy_7_taxonomy_group',
 'taxonomy_7_desc',
 'taxonomy_7_state',
 'taxonomy_7_license',
 'taxonomy_7_primary',
 'taxonomy_8_code',
 'taxonomy_8_taxonomy_group',
 'taxonomy_8_desc',
 'taxonomy_8_state',
 'taxonomy_8_license',
 'taxonomy_8_primary',
 'taxonomy_9_code',
 'taxonomy_9_taxonomy_group',
 'taxonomy_9_desc',
 'taxonomy_9_state',
 'taxonomy_9_license',
 'taxonomy_9_primary',
 'taxonomy_10_code',
 'taxonomy_10_taxonomy_group',
 'taxonomy_10_desc',
 'taxonomy_10_state',
 'taxonomy_10_license',
 'taxonomy_10_primary']
"""

assert df[sometimes_null_cols].isnull().any().all()

columns_with_empty_strings = {"other_taxonomies_summary", "sex"}

always_nonempty_cols = [
    column for column in always_nonnull_cols if column not in columns_with_empty_strings
]

for column in always_nonempty_cols:
    assert (df[column].str.len() > 0).all(), column

always_nonempty_cols
"""
"created_epoch",
"enumeration_type",
"last_updated_epoch",
"number",
"first_name",
"last_name",
"sole_proprietor",
"enumeration_date",
"last_updated",
"status",
"mailing_country_code",
"mailing_country_name",
"mailing_address_purpose",
"mailing_address_type",
"mailing_address_1",
"mailing_city",
"mailing_state",
"mailing_postal_code",
"location_country_code",
"location_country_name",
"location_address_purpose",
"location_address_type",
"location_address_1",
"location_city",
"location_state",
"location_postal_code",
"location_telephone_number",
"""

assert (df["status"] == "A").all()
assert (df["enumeration_type"] == "NPI-1").all()

assert (df["mailing_country_code"] == "US").all()
assert (df["mailing_country_name"] == "United States").all()
assert (df["mailing_address_purpose"] == "MAILING").all()
assert (df["mailing_address_type"] == "DOM").all()

assert (df["location_country_code"] == "US").all()
assert (df["location_country_name"] == "United States").all()
assert (df["location_address_purpose"] == "LOCATION").all()
assert (df["location_address_type"] == "DOM").all()

df = df.sort_values(by=["enumeration_date"], ascending=False).reset_index(drop=True)

df.to_csv(output_path, index=None)
