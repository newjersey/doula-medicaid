# Compare ffs group and individual

Conclusion: 
The matching pages are listed in the dictionary below
All the keys are the same in these matching pages
These matching pages have the only matching keys

Form pages only in individual: 3, 7, 8, 10
Form pages only in group: 6, 7, 8, 9, 10, 11, 12, 13, 14

4	3	SIGNATURE AUTHORIZATION FORM
5	4	AUTHORIZATION AGREEMENT FOR AUTOMATED DEPOSITS OF STATE PAYMENTS
9	15	provider certification
12	17	REQUEST FOR PAPER UPDATES
16	21	DISCLOSURE OF OWNERSHIP AND CONTROL INTEREST STATEMENT
17	22	continued
18	23	continued
19	24	continued
20	25	continued
21	26	continued
22	27	continued
23	28	CERTIFICATION
24	29	Remarks: (attach extra sheets if necessary)
25	30	W9 Request for Taxpayer Identification Number and Certification
27	32	AFFIRMATIVE ACTION SURVEY
28	33	Agreement of Understanding

For pages that match, mapping <individual page>: <group page>
{
	4: 3, # SIGNATURE AUTHORIZATION FORM
	5: 4, # AUTHORIZATION AGREEMENT FOR AUTOMATED DEPOSITS OF STATE PAYMENTS
	9: 15, # provider certification
	12: 17, # REQUEST FOR PAPER UPDATES
	16: 21, # DISCLOSURE OF OWNERSHIP AND CONTROL INTEREST STATEMENT
	17: 22, # continued
	18: 23, # continued
	19: 24, # continued
	20: 25, # continued
	21: 26, # continued
	22: 27, # continued
	23: 28, # CERTIFICATION
	24: 29, # Remarks: (attach extra sheets if necessary)
	25: 30, # W9 Request for Taxpayer Identification Number and Certification
	27: 32, # AFFIRMATIVE ACTION SURVEY
	28: 33, # Agreement of Understanding
}


Ignored any instruction pages with no form fields.

```python
import json
import pandas as pd

group_path = "~/notes/749472 ffs group merged.csv"
individual_path = "~/notes/749476 ffs individual merged.csv"

individual_df = pd.read_csv(individual_path)
group_df = pd.read_csv(group_path)


individual_to_group_page_maps = {
	4: 3, # SIGNATURE AUTHORIZATION FORM
	5: 4, # AUTHORIZATION AGREEMENT FOR AUTOMATED DEPOSITS OF STATE PAYMENTS
	9: 15, # provider certification
	12: 17, # REQUEST FOR PAPER UPDATES
	16: 21, # DISCLOSURE OF OWNERSHIP AND CONTROL INTEREST STATEMENT
	17: 22, # continued
	18: 23, # continued
	19: 24, # continued
	20: 25, # continued
	21: 26, # continued
	22: 27, # continued
	23: 28, # CERTIFICATION
	24: 29, # Remarks: (attach extra sheets if necessary)
	25: 30, # W9 Request for Taxpayer Identification Number and Certification
	27: 32, # AFFIRMATIVE ACTION SURVEY
	28: 33, # Agreement of Understanding
}

individual_matching_pages = individual_to_group_page_maps.keys()
group_matching_pages = individual_to_group_page_maps.values()

set(individual_df[individual_df["pageNum"].isin(individual_matching_pages)]["key"]) == set(group_df[group_df["pageNum"].isin(group_matching_pages)]["key"])
# True
# Amazing!

matching_page_keys = set(individual_df[individual_df["pageNum"].isin(individual_matching_pages)]["key"])
set(group_df.key).intersection(set(individual_df.key)) == matching_page_keys
# True

len(set(group_df.key) - set(individual_df.key))
# 303


individual_not_group_pages = set(individual_df[individual_df["key"].isin(set(individual_df.key) - set(group_df.key))]["pageNum"])
# {3, 7, 8, 10}

group_not_individual_pages = set(group_df[group_df["key"].isin(set(group_df.key) - set(individual_df.key))]["pageNum"])
# {6, 7, 8, 9, 10, 11, 12, 13, 14}
```