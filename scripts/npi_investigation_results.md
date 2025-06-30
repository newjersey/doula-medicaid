# NPI Data Investigation

06/30/2025

See `npi_get_dataset.py` and `npi_investigation.py` for code.

A full table fo the NPI data is available at https://docs.google.com/spreadsheets/d/1NBHxcQUCzqiN0tx8iOg85VmaTVQRONc5GdTUJHSmUG0/edit?gid=0#gid=0

## Data included/excluded in this analysis

### Only included individual doulas

There are 620 doula individuals with NPI numbers with the doula taxonomy and state NJ, as of 6/30/25. This is a live dataset where the number of doulas is gradually going up. Doulas were getting added as I was doing the analysis, so I might be off by 1 in a couple places.

There are also 46 doula groups in the NPI database. I excluded all of these. They are available here if interested: https://npiregistry.cms.hhs.gov/api/?taxonomy_description=Doula&state=NJ&limit=200&skip=0&pretty=&enumeration_type=NPI-2&version=2.1

### Included doulas whose primary taxonomy is not Doula

Of 620 individual doulas, 570 people have the primary taxonomy Doula, 50 only have Doula as a secondary taxonomy.

The 50 people who only have Doula as a secondary taxonomy, most have doula-adjacent things as their primary taxonomy:
```
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
```

Since most of these primary taxonomies are doula-adjacent, I decided to include these providers in this analysis, even though Doula is not their primary taxonomy.


## Information available

### Available for every doula

We always have the following information for each doula (not null, not empty string):

1. Number: NPI number
1. First name
1. Last name
1. Sole proprietor: YES or NO
1. Enumeration date: date the NPI was issued
1. Last updated
1. Created epoch: epoch meaning a timestamp
1. Last updated epoch: epoch meaning a timestamp
1. Mailing address: address line 1, city, state, postal code, address purpose (MAILING), country code and name (all United States), address type (all DOM)
1. Location address: address line 1, city, state, postal code, address purpose (LOCATION), country code and name (all United States), address type (all DOM)
1. Enumeration type: always "NPI-1", for individual
1. Status: always "A" (per https://npiregistry.cms.hhs.gov/help/help-details this means Active, vs Deactivated)

### Available for some doulas

We have the following information for some doulas:

1. Certification date: 548 doulas, though I don't know what this certification refers to
1. Location and mailing address additional data: fax number, mailing telephone number, address lines 2
1. Middle name: mix of fully spelled out middle names, middle initial e.g. "A", and middle initial including a period e.g. "A."
1. Name prefix: 165 doulas, 'Mrs.', 'Ms.', 'Miss', '--', 'Dr.', 'Prof.'
1. Name suffix: are all empty or "--"
1. Other name: 26 doulas
1. Credential: 211 doulas. These are things like "doula", "community doula", and a lot of acronym soup e.g. CBC, IBCLC, RBT, M.S., RN, CLC, CNM
1. Additional taxonomies: 63 doulas, that aren't just "doula" repeated again as a secondary taxonomy
1. An additional practice location: 20 doulas
1. Misc identifiers: 10 doulas have a medicaid identifier, 4 have "Other: (non-Medicare)"
1. Other taxonomies: 63 doulas have another taxonomy. Top 5 are Lactation Consultant (17), Non-RN (17), Health Educator (16), Counselor (11), Midwife (6)
1. Other contact information: 33 doulas, e.g. websites, emails

## Key findings

### Increasing number of doulas with NPI numbers

```
Year that NPI was issued (from enumeration_date)
2025    119
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
2014-2005 53
```

Most doulas obtained their NPI number in the last 5 years. We are about halfway into 2025, but have about the same number of doulas who got their NPI number as in all of 2024. The reasons why are unclear (e.g., maybe most training is in the first half of the year), but we seem to be part of an increasing trend!

Some possibilities are that more people might be becoming doulas, and/or that doula services being reimbursed by insurance (and therefore causing doulas to get an NPI number) is a more recent phenomenon.

I think this increasing trend is strong motivation for the timeliness of our work.

### ~80% of doulas are sole proprietors
```
sole_proprietor
YES    520
NO     100
```

We have no other information on LLC, etc.

### 71% of doulas have mailing the same as location address
Mailing exactly equals location address
```
True     441
False    179
```

This is about the same (73%) for doulas who are sole proprietors:

Sole proprietors only, mailing exactly equals location address
```
True     380
False    140
```

### Comparing NPI and DOH doula data

#### The NPI database clearly does not have the full picture of doulas who are enrolled as Medicaid providers
Only 10 doulas are listed as having a medicaid identifier. This might be why our partners have been saying that the picture in the NPI data is not complete - it definitely undercounts the number of doulas providing for medicaid. I'm not sure if there are separate NJ vs national medicaid identifiers that might explain the discrepancy.

#### Some doulas listed in the DOH-provided spreadsheet are not found in the NPI database
The DOH-provided [spreadsheet of Medicaid doulas](https://docs.google.com/spreadsheets/d/1mFCVy1m7CZS4QWtD1Kxjzl1sko7QvGSdV_fTLvzXeh0/edit?gid=476691626#gid=476691626) has 85 doulas. Of those, 77 doulas seem to be found in the NPI database (including those with slight name misspellings, etc). I manually checked the remaining 7 doulas, in could not reasonably find someone in the NPI dataset with the same first and last name. It's possible that they are not included in the dataset because their NPI record was deactivated.

#### Names in NPI or DOH data may be misspelled
It's worth noting that the 77 doulas from the DOH sheet who are found in the NPI database also includes 6 doulas whose name I think was misspelled in either the NPI or DOH. For instance, name spellings being one letter off, or a hyphenated last name being NameOne-NameTwo vs NameTwo-NameOne. In addition to considering whether e.g. a doula's address might be outdated, it's possible that their name in the NPI database might not be correct or might not be the name they want to use.

#### Perhaps consider NPI data an upper bound

As our partners have shared, the NPI database has limitations in that e.g. not all doulas with NPI numbers might still be practicing doulas, let alone interested in providing for medicaid. However, I think this NPI data is still a useful upper bound approximation for the doulas we are attempting to help serve.

We could also use NPI data to measure success. E.g., one success metric could be x% of doulas who are issued NPI numbers in this year/after launch also go through our flow. That's just an example; we should still target existing doulas who have had NPI numbers for a while.


## Other findings

### Unclear what makes a "NJ" doula

All of these doulas were returned when we specified state=NJ for searching the NPI database. However, a couple doulas have location and/or mailing states outside of NJ. All of them have either mailing, location, or practice location in NJ, but I don't know and makes someone a "NJ" NPI provider.

```
location_state
NJ    608
NY      5
PA      3
WI      1
OR      1
GA      1
VA      1
```

```
mailing_state
NJ    614
NY      2
MA      1
GA      1
VA      1
IL      1
```

### Credential information

Most frequent examples of "credential"
```
credential
Doula                   53
CD                      20
CD(DONA)                16
doula                    7
Certified Doula          6
CLD                      5
```

remaining mix of a bunch of acronym soup (e.g. CD, CBC, IBCLC, RBT, M.S., RN, CD(DONA), CLC, C.D., CNM, CD (SBD))

## Potential followup questions

1. Why are 7 doulas from the DOH spreadsheet not in the NPI database?
    1. The NPI records only include doulas with status Active ("A"), so it's possible that the discrepancy might be because those doulas have deactivated NPI numbers.
