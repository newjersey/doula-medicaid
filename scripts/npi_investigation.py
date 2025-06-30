import pandas as pd
import collections
import math
import numpy as np

file_path = "~/notes/749369 June 30 2025 individual doulas NPI.csv"
# Some total numbers might be off by one, because the dataset was re-generated partway when an additional doula had been added
# The additional add doula was manually inspected and has no edge/different cases

# List of medicaid doulas provided by dhs
doula_registry_file_path = (
    "~/notes/749369 Doula Funnel (FFS+MCO) - 3.DOH Doula Registry.csv"
)

no_match_output_path = "~/notes/749369 medicaid doulas not found in npi.csv"

df = pd.read_csv(file_path)
medicaid_df = pd.read_csv(doula_registry_file_path)
# note that the empty string other_taxonomies_summary comes back out as nan

df["mailing_state"].value_counts()
"""
mailing_state
NJ    613
NY      2
MA      1
GA      1
VA      1
IL      1
"""

df["location_state"].value_counts()
"""
location_state
NJ    607
NY      5
PA      3
WI      1
OR      1
GA      1
VA      1
"""

len(df[~((df["mailing_state"] == "NJ") | (df["location_state"] == "NJ"))])
# 2
# Both have practice_location_1_state as NJ

df["enumeration_date"].apply(lambda x: x.split("-", 1)[0]).value_counts(sort=False)
"""
2025    118
2024    121
2023    104
2022     51
2021     81
2020     50
2019      9
2018     13
2017      7
2016      6
2015      6
2014      3
2013      8
2012      9
2011     12
2010      9
2009     10
2006      1
2005      1
"""

df["sole_proprietor"].value_counts()
"""
sole_proprietor
YES    519
NO     100
"""

len(
    df[
        (df["other_taxonomies_summary"].notnull())
        & (df["other_taxonomies_summary"] != "Doula")
    ]
)
# 63

df["other_contact_1_endpoint"].unique()
# mostly emails and websites
len(df[df["other_contact_1_endpoint"].notnull()])
# 33


def mailing_is_same_as_location_address(row):
    address_cols = [
        "address_1",
        "address_2",
        "city",
        "state",
        "postal_code",
        "telephone_number",
        "fax_number",
    ]
    for col in address_cols:
        mailing = row[f"mailing_{col}"]
        location = row[f"location_{col}"]
        if (
            isinstance(mailing, float)
            and isinstance(location, float)
            and math.isnan((mailing))
            and math.isnan((location))
        ):
            # np.nan has a quirk where it does not equal itself
            # if both are nan, don't bother testing equality, they are equal
            continue
        elif mailing != location:
            return False
    return True


df.apply(mailing_is_same_as_location_address, axis=1).value_counts()
"""
True     441
False    179
"""

df[df["sole_proprietor"] == "YES"].apply(
    mailing_is_same_as_location_address, axis=1
).value_counts()
"""
True     380
False    140
"""

len(df[df["practice_location_1_address_1"].notnull()])
# 20

len(df[df["other_names_1_type"].notnull()])
# 26

len(df[df["name_prefix"].notnull()])
df["name_prefix"].unique()
# ['Mrs.', nan, 'Ms.', 'Miss', '--', 'Dr.', 'Prof.']

df["name_suffix"].unique()
# mix of fully spelled out middle names, middle initial e.g. "A", and middle initial including a period e.g. "A."

df["name_suffix"].value_counts()
"""
name_suffix
--    50
"""

len(df[df["other_names_1_type"].notnull()])
# 26
df["enumeration_type"].unique()

df["identifiers_1_code"].unique()
# array([nan,  5.,  1.])

df["identifiers_1_desc"].unique()
# array([nan, 'MEDICAID', 'Other (non-Medicare)'], dtype=object)

df["identifiers_2_code"].unique()
df["identifiers_2_desc"].unique()
# nothing new for either

interested_columns = [
    "enumeration_date",
    "credential",
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
]
df[df["identifiers_1_desc"].notnull()][interested_columns]
# Only one record has identifiers 2, and it's a Other (non-Medicare)

len(df[df["identifiers_1_desc"].notnull()][interested_columns])
# 14

len(df[df["identifiers_1_desc"] == "MEDICAID"])
# 10

len(
    df[
        (df["other_taxonomies_summary"].notnull())
        & (df["other_taxonomies_summary"] != "Doula")
        # & (df["other_taxonomies_summary"] != " ") # this line doesn't matter, same number
    ]
)
# 63

other_taxonomies_nonunique = list(
    df[
        (df["other_taxonomies_summary"].notnull())
        & (df["other_taxonomies_summary"] != "Doula")
    ]["other_taxonomies_summary"]
)
other_taxonomies_flat = []
for other_taxonomies in other_taxonomies_nonunique:
    taxonomies = other_taxonomies.split(", ")
    for taxonomy in taxonomies:
        if taxonomy != "Doula" and taxonomy != " ":
            other_taxonomies_flat.append(taxonomy)

len(set(other_taxonomies_flat))
# 48
collections.Counter(other_taxonomies_flat)
"""
'Lactation Consultant': 17,
'Non-RN': 17,
'Health Educator': 16,
'Counselor': 11,
'Midwife': 6,
'Mental Health': 5,
'Registered Nurse': 5,
'Home Health Aide': 4,
'Specialist': 4,
'Health & Wellness Coach': 4,
'Massage Therapist': 3,
'Community Health Worker': 3,
'Clinic/Center': 3,
'Reflexologist': 2,
'Pastoral': 2,
'Lay': 2,
'Student in an Organized Health Care Education/Training Program': 2,
'Adult Companion': 2,
'Addiction (Substance Use Disorder)': 2,
'Peer Specialist': 2,
'Home Health': 1,
'Religious Nonmedical Practitioner': 1,
'Driver': 1,
'Licensed Practical Nurse': 1,
'Rehabilitation Practitioner': 1,
'Nursing Care': 1,
'Mental Health (Including Community Mental Health Center)': 1,
'Birthing': 1,
'Case Manager/Care Coordinator': 1,
'Public Health or Welfare': 1,
'Specialist/Technologist': 1,
'Other': 1,
'Geneticist': 1,
'Medical (PhD)': 1,
'Advanced Practice Midwife': 1,
'Private Vehicle': 1,
'Community Health': 1,
'Obstetric': 1,
'Inpatient': 1,
'Maternal Newborn': 1,
'Social Worker': 1,
'Speech-Language Pathologist': 1,
'Emergency Medical Technician': 1,
'Basic': 1,
'Dietetic Technician': 1,
'Registered': 1,
'Audiologist': 1,
'Physical Therapist': 1
"""

df["mailing_address_type"].unique()
# array(['DOM'], dtype=object)
df["location_address_type"].unique()
# array(['DOM'], dtype=object)

len(df[df["certification_date"].notnull()])
# 548

len(df[df["credential"].notnull()])
# 211

df["credential"].value_counts()
"""
Doula                   53
CD                      20
CD(DONA)                16
doula                    7
Certified Doula          6
CLD                      5
MS                       2
Full Spectrum Doula      2
CD, CBC                  2
IBCLC                    2
RBT                      2
M.S.                     2
RN                       2
CD(DONA), CLC            2
C.D.                     2
CNM                      2
CD (SBD)                 1
LMT                      1
CD, CBC (CBI-SBD)        1
CD-L                     1
PhD, DrPH, ND, IMD       1
IBCLC, CLC, CD,CIPSP     1
MS, CCCE,CD(DONA)        1
IBCLC, FAE               1
LCSW, Doula              1
CLC                      1
CLC, LCCE, CD            1
CD(DONA),LCCE,CLC        1
CHHP., CBC., CD.         1
Doula Taxonomy           1
CLC, CLD                 1
ND, DFM                  1
CD(Dona), LCCE           1
B.S., D.T.R., P.C.D      1
PT, Doula                1
cld                      1
PCD                      1
CPD                      1
MA, CD                   1
RN, CD(DONA), LCCE       1
CD(DONA), CCE            1
CD (DONA)                1
PCD (DONA)               1
CD,CLC                   1
RN, BSN, ICCE, ICD       1
certified                1
LM, CPM                  1
Doula, IBCLC             1
IBCLC, CD (DONA)         1
BA, CD(DONA)             1
CD CBE                   1
CD(DONA), LCCE           1
CD(DONA) LCCE            1
MPH                      1
CBD, CBE, CHHC           1
BSPHE,MPH,CPLD           1
ICBD, ICEA Certified     1
LSW/LCADC                1
Birth and PP Doula       1
CD(DONA), CCCE           1
IBCLC, CPD               1
CB, PhD                  1
LMT, CD, LCCE            1
PhD                      1
Birth  Doula             1
CM, CD, CCE              1
EOLD                     1
BSN, RN, CD(DONA)        1
BSN, RN                  1
CD, DONA                 1
RN/Doula                 1
DOULA                    1
PPD                      1
NBC Specialist/CHHA      1
MSN, RNC-MNN, CLC        1
PCD(DONA)                1
CD/PCD(DONA), CLC        1
Ph.D.                    1
NJ LMT #18KT01515000     1
CD, CPPD, CLC, RP        1
Perinatal Doula          1
CBD                      1
CD, CLC                  1
BS                       1
CD, CBE, LC              1
MA                       1
CD(DONA), LCCE, CLC      1
CD(Certified Doula)      1
MCD, MCPD                1
LAC                      1
IBCLC, CD                1
CD, CPNE, CCE            1
Doula, RN, BSN           1
BA,CD,                   1
Community Doula          1
BA                       1
RN BSN CD CPD            1
RMA                      1
LPN                      1
M.P.T., CERT. M.D.T      1
"""

len(medicaid_df)
# 84

medicaid_df["fname_only"] = medicaid_df["Fname"].apply(lambda x: x.split(" ", 1)[0])
medicaid_df["first_and_last"] = medicaid_df["Fname"].apply(lambda x: x.split(" ", 1)[0])


def first_and_last_found(row):

    if row["fname_only"] in set(df["first_name"]) and row["Lname"] in set(
        df["last_name"]
    ):
        return True
    return False


len(medicaid_df[medicaid_df.apply(first_and_last_found, axis=1)])
# 71

len(medicaid_df[~medicaid_df.apply(first_and_last_found, axis=1)])
# 13

no_match = medicaid_df[~medicaid_df.apply(first_and_last_found, axis=1)].reset_index(
    drop=True
)

# manually opened the df full npi dataset as a csv, and tried to find first and last names in the whole plain text file

"""
0: last name has a dash in the dhs data but not npi - probably same person
1: not found in NPI - probably not found
2: npi last name has extra space - probably same person
3: npi name has one missing letter/dhs has one extra letter - probably same person
4: slightly different spelling, one is probably incorrect - probably same person
5: matching first name found, but the last name is different and the phone number is not found so might be different. The phone number in DHS data is also repeated across multiple records, so might still be the same person with a changed last name - probably not found
6: first and last name not found - probably not found
7: last name hyphenated in different order - probably same person
8: first and last name not found - probably not found
9: nothing plausibly the same person - probably not found
10: first and last name not found - probably not found
11: last name in npi db includes what seems to be middle name - probably same person
12: probably not found
"""

"""
0: True
1: False
2: True
3: True
4: True
5: False
6: False
7: True
8: False
9: False
10: False
11: True
12: False
"""

no_match["probably_found"] = [
    True,
    False,
    True,
    True,
    True,
    False,
    False,
    True,
    False,
    False,
    False,
    True,
    False,
]

len(no_match[~no_match["probably_found"]])
# 7

# spellings
len(no_match[no_match["probably_found"]])
# 6
