# Get all form fields from ffs group

Upload file

```tsx
// src/app/Form.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      // const parsedFormData = await parseAetnaForm(file);
      parseFfs(file);
      //   setFormData({
      //     ...formData,
      //     ...parsedFormData,
      //   });
      //   return;
    }
// ...
      <div>
        <label className="usa-label">
          Upload filled pdf:
          <input
            className="usa-input"
            type="file"
            name="filledForm"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </label>
      </div>
```

Call this on submit

```ts
// src/app/forms/form.ts
export const parseFfs = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();
  const pages = pdfDoc.getPages();
  const allFields = [];
  for (const field of form.getFields()) {
    const fieldPage = pdfDoc.findPageForAnnotationRef(field.ref);
    if (fieldPage === undefined) throw "whoops";
    const pageNum = pages.findIndex((page) => page.ref.tag === fieldPage.ref.tag) + 1;
    allFields.push({
      type: field.constructor.name,
      pageNum: pageNum,
      yPos: field.acroField.getWidgets()[0].getRectangle().y,
      xPos: field.acroField.getWidgets()[0].getRectangle().x,
      name: field.getName(),
      isReadOnly: field.isReadOnly(),
      isRequired: field.isRequired(),
      maxLength: field instanceof PDFTextField && field.getMaxLength(),
    });
  }
  const sortedFields = allFields.sort(
    (a, b) => a.pageNum - b.pageNum || b.yPos - a.yPos || a.xPos - b.xPos,
  );
  console.log(sortedFields);
};
```

```py
import json
import pandas as pd
import re

file_path = "~/notes/749472 ffs group all fields.json"
output_path = "~/notes/749472 ffs group cleaned keys.csv"
merged_output_path = "~/notes/749472 ffs group merged.csv"

individual_merged_csv = "~/notes/749476 ffs individual merged.csv"

individual_df = pd.read_csv(individual_merged_csv)
df = pd.read_json(file_path)

len(set(df.key) - set(individual_df.key))
# 303

len(set(df.key).intersection(set(individual_df.key)))
# 355

len(set(individual_df.key) - set(df.key))
# 68


def parse_field_name(row):
  """
  Assumes some properties
  any e.g. "fd452fd452managingagentsdateofbirthine2" has the same fd thing repeated
  returns fd_prefix, clean name
  """
  field_name = row["key"]
  regexp = re.compile(r'fd\d+')
  re_match = regexp.match(field_name)
  if re_match:
    fdThing = re_match.group(0)
    split_name_with_blank = field_name.split(fdThing)
    split_name = [fdThing if part == "" else part for part in split_name_with_blank]
    if len(split_name) == 3:
      split_name = [split_name[0] + split_name[1], split_name[2]]
    assert len(split_name) == 2
    return split_name
  return ["", field_name]


df['key_prefix'] = df.apply(lambda row: parse_field_name(row)[0], axis=1)
df['key_without_prefix'] = df.apply(lambda row: parse_field_name(row)[1], axis=1)
df["key_without_prefix"].to_csv(output_path, index=True, index_label="index")
# next time, write keeping the prefix to handle duplicates!

len(df)
# 658
```

https://ai-assistant.nj.gov/

This is a csv where the first column is an index, and the second column is key_without_prefix. The second key_without_prefix column contains phrases of words that have been mashed together, and sometimes don't have spaces between the words where they should be. Please create a third column, called cleaned_key, that takes the corresponding value from the second key_without_prefix column and adds spaces between the words. Please preserve all capitalization, and preserve the row ordering. Do not mix up any data between rows.

It gave me a tsv. Next time, specify output should be a CSV
Next time, also specify not to drop any letters
It also modified the second column to clean up double spaces. Tell it not to modify the key_without_prefix column

```text
Sure, I will create a third column called
`cleaned_key`
with spaces added between the words in the
`key_without_prefix`
column.
```

```python
njai_output_path = "~/notes/749472 njai ffs group output.tsv"
df_ai = pd.read_csv(njai_output_path, sep="\t")
# it also stripped "_", as before

def only_modified_space_underscore(value):
  value = value.replace(" ", "")
  value = value.replace("_", "")
  return value

df_ai["matches"] = df_ai.apply(lambda row: only_modified_space_underscore(row["key_without_prefix"]) == only_modified_space_underscore(row["cleaned_key"]), axis=1)

len(df_ai[df_ai["matches"]!= True])
# 35

pd.set_option('display.max_colwidth', None)
df_ai[df_ai["matches"]!= True]
pd.reset_option('display.max_colwidth')
```

Manually checked all these. It
- fixed spelling mistakes
  - sugnature -> signature
  - Paternship -> Partnership
  - affliated -> affiliated
  - releationship -> relationship
  - interes -> interest
  - ine -> line
  - signtuare -> signature
  - yyes -> yes

- entitys -> entity's

- also did
  - datefdate_af_date -> date af date
  - jointdatefdate_af_date -> joint date af date
  - namedtssnofemployeesa, b, c -> named tss no of employees a, b, c
  - pprovedprovideryesexplaination -> approved provider yes explaination

```csv
     index                          key_without_prefix                                          cleaned_key  matches
9        9                 authorizationsugnaturename4                       authorization signature name 4    False
29      29                           datefdate_af_date                                         date af date    False
32      32                      jointdatefdate_af_date                                   joint date af date    False
46      46                       namedtssnofemployeesa                          named tss no of employees a    False
47      47                       namedtssnofemployeesb                          named tss no of employees b    False
48      48                       namedtssnofemployeesc                          named tss no of employees c    False
231    231              pprovedprovideryesexplaination                   approved provider yes explaination    False
350    350                  disclosingentityPaternship                        disclosing entity Partnership    False
369    369                affliatedprevious12monthsyes                    affiliated previous 12 months yes    False
370    370                 affliatedprevious12monthsno                     affiliated previous 12 months no    False
389    389                     ownerreleationshipline1                            owner relationship line 1    False
390    390                     ownerreleationshipline2                            owner relationship line 2    False
391    391                     ownerreleationshipline3                            owner relationship line 3    False
392    392                     ownerreleationshipline4                            owner relationship line 4    False
393    393        ownerreleationshipsubcontractorline1              owner relationship subcontractor line 1    False
394    394        ownerreleationshipsubcontractorline2              owner relationship subcontractor line 2    False
395    395        ownerreleationshipsubcontractorline3              owner relationship subcontractor line 3    False
396    396        ownerreleationshipsubcontractorline4              owner relationship subcontractor line 4    False
397    397  nameofotherentitywithownershipinteresline1  name of other entity with ownership interest line 1    False
398    398  nameofotherentitywithownershipinteresline2  name of other entity with ownership interest line 2    False
399    399  nameofotherentitywithownershipinteresline3  name of other entity with ownership interest line 3    False
400    400  nameofotherentitywithownershipinteresline4  name of other entity with ownership interest line 4    False
401    401  nameofotherentitywithownershipinteresline5  name of other entity with ownership interest line 5    False
402    402               managingagentsdateofbirthine1                 managing agents date of birth line 1    False
406    406               managingagentsdateofbirthine2                 managing agents date of birth line 2    False
410    410               managingagentsdateofbirthine3                 managing agents date of birth line 3    False
414    414               managingagentsdateofbirthine4                 managing agents date of birth line 4    False
418    418               managingagentsdateofbirthine5                 managing agents date of birth line 5    False
433    433        affiliatesindividualentitysroleline1           affiliates individual entity's role line 1    False
440    440        affiliatesindividualentitysroleline2           affiliates individual entity's role line 2    False
447    447        affiliatesindividualentitysroleline3           affiliates individual entity's role line 3    False
454    454        affiliatesindividualentitysroleline4           affiliates individual entity's role line 4    False
524    524                    increasedbedcapacityyyes                           increased bed capacity yes    False
529    529                        disclosableeventyyes                                disclosable event yes    False
627    627                      W9_signtuareofusperson                            W9 signature of us person    False
```


```python
def validation_function_2(value):
  value = value.replace("sugnature", "signature")
  value = value.replace("signtuare", "signature")
  value = value.replace("affliated", "affiliated")
  value = value.replace("releationship", "relationship")
  value = value.replace("Paternship", "Partnership")
  value = value.replace("yyes", "yes")
  value = value.replace("entitys", "entity's")
  value = value.replace(" ", "")
  value = value.replace("_", "")
  # value = value.replace("interes", "interest")
  # value = value.replace("ine", "line")
  return value

df_ai["matches_validation_2"] = df_ai.apply(lambda row: validation_function_2(row["key_without_prefix"]) == validation_function_2(row["cleaned_key"]), axis=1)

pd.set_option('display.max_colwidth', None)
df_ai[(df_ai["matches_validation_2"]!= True) & (df_ai["matches"]!= True)]
pd.reset_option('display.max_colwidth')
```
```csv
     index                          key_without_prefix                                          cleaned_key  matches  matches_validation_2
29      29                           datefdate_af_date                                         date af date    False                 False
32      32                      jointdatefdate_af_date                                   joint date af date    False                 False
46      46                       namedtssnofemployeesa                          named tss no of employees a    False                 False
47      47                       namedtssnofemployeesb                          named tss no of employees b    False                 False
48      48                       namedtssnofemployeesc                          named tss no of employees c    False                 False
231    231              pprovedprovideryesexplaination                   approved provider yes explaination    False                 False

<!-- below is spelling. interes and ine -->
397    397  nameofotherentitywithownershipinteresline1  name of other entity with ownership interest line 1    False                 False
398    398  nameofotherentitywithownershipinteresline2  name of other entity with ownership interest line 2    False                 False
399    399  nameofotherentitywithownershipinteresline3  name of other entity with ownership interest line 3    False                 False
400    400  nameofotherentitywithownershipinteresline4  name of other entity with ownership interest line 4    False                 False
401    401  nameofotherentitywithownershipinteresline5  name of other entity with ownership interest line 5    False                 False
402    402               managingagentsdateofbirthine1                 managing agents date of birth line 1    False                 False
406    406               managingagentsdateofbirthine2                 managing agents date of birth line 2    False                 False
410    410               managingagentsdateofbirthine3                 managing agents date of birth line 3    False                 False
414    414               managingagentsdateofbirthine4                 managing agents date of birth line 4    False                 False
418    418               managingagentsdateofbirthine5                 managing agents date of birth line 5    False                 False
```

- also did
  - datefdate_af_date -> date af date
  - jointdatefdate_af_date -> joint date af date
  - namedtssnofemployeesa, b, c -> named tss no of employees a, b, c
  - pprovedprovideryesexplaination -> approved provider yes explaination

```python
unclear_translations = {"datefdate_af_date","jointdatefdate_af_date","namedtssnofemployeesa","namedtssnofemployeesb","namedtssnofemployeesc","pprovedprovideryesexplaination"}
df[df["key_without_prefix"].isin(unclear_translations)]
```

```csv
             type  pageNum     yPos      xPos                                  key  isReadOnly  isRequired  maxLength key_prefix              key_without_prefix
29   PDFTextField        4  306.730  415.2530               fd443datefdate_af_date       False       False        NaN      fd443               datefdate_af_date
32   PDFTextField        4  223.340  417.9620          fd443jointdatefdate_af_date       False       False        NaN      fd443          jointdatefdate_af_date
46   PDFTextField        6   88.875   65.0357           fd426namedtssnofemployeesa       False       False        NaN      fd426           namedtssnofemployeesa
47   PDFTextField        6   68.986   65.0357           fd426namedtssnofemployeesb       False       False        NaN      fd426           namedtssnofemployeesb
48   PDFTextField        6   47.506   64.5676           fd426namedtssnofemployeesc       False       False        NaN      fd426           namedtssnofemployeesc
231  PDFTextField       11  455.163   88.6728  fd426pprovedprovideryesexplaination       False       False        NaN      fd426  pprovedprovideryesexplaination
```

```python
individual_df[individual_df["pageNum"]==5]
```
```csv
      cleaned_key_not_unique  pageNum     yPos      xPos                          key          type  maxLength key_prefix      key_without_prefix
32                 bank name        5  616.590  156.4470                fd443bankname  PDFTextField        NaN      fd443                bankname
33                    branch        5  616.590  430.0700                  fd443branch  PDFTextField        NaN      fd443                  branch
34                      CITY        5  589.110   70.3146                    fd443CITY  PDFTextField        NaN      fd443                    CITY
35                     STATE        5  589.110  374.8700                   fd443STATE  PDFTextField        NaN      fd443                   STATE
36                  zip code        5  589.110  500.8060                 fd443zipcode  PDFTextField        NaN      fd443                 zipcode
37           bank transit no        5  561.510  177.8070           fd443banktransitno  PDFTextField        NaN      fd443           banktransitno
38              bank acct no        5  561.510  450.4390              fd443bankacctno  PDFTextField        NaN      fd443              bankacctno
39              bank account        5  492.671  238.1110             fd443bankaccount  PDFTextField        NaN      fd443             bankaccount
40             provider name        5  457.686  143.3740            fd443providername  PDFTextField        NaN      fd443            providername
41               provider no        5  423.050  128.9050              fd443providerno  PDFTextField        NaN      fd443              providerno
42              telephone no        5  423.050  431.2690             fd443telephoneno  PDFTextField        NaN      fd443             telephoneno
43                    npi no        5  388.051   81.8533                   fd443npino  PDFTextField        NaN      fd443                   npino
44     pay to address line 1        5  367.390  147.7440       fd443paytoaddressline1  PDFTextField        NaN      fd443       paytoaddressline1
45     pay to address line 2        5  346.530   35.2267       fd443paytoaddressline2  PDFTextField        NaN      fd443       paytoaddressline2
46     pay to address line 3        5  326.570   35.2267       fd443paytoaddressline3  PDFTextField        NaN      fd443       paytoaddressline3
47              printed name        5  306.730   35.5267             fd443printedname  PDFTextField        NaN      fd443             printedname
48                 signature        5  306.730  222.1740               fd443signature  PDFTextField        NaN      fd443               signature
49        date fdate af date        5  306.730  415.2530       fd443datefdate_af_date  PDFTextField        NaN      fd443       datefdate_af_date
50        joint printed name        5  223.340   35.0375        fd443jointprintedname  PDFTextField        NaN      fd443        jointprintedname
51           joint signature        5  223.340  222.1740          fd443jointsignature  PDFTextField        NaN      fd443          jointsignature
52  joint date fdate af date        5  223.340  417.9620  fd443jointdatefdate_af_date  PDFTextField        NaN      fd443  jointdatefdate_af_date
```

```python
df[df["pageNum"]==6]
```
```csv
            type  pageNum     yPos      xPos                              key  isReadOnly  isRequired  maxLength key_prefix          key_without_prefix
33  PDFTextField        6  529.782  279.5240         fd426Medicaid provider #       False       False        NaN      fd426         Medicaid provider #
34  PDFTextField        6  529.782  392.5020                      fd426Tax Id       False       False        NaN      fd426                      Tax Id
35  PDFTextField        6  505.712  189.6090                  fd426grpeffdate       False       False        NaN      fd426                  grpeffdate
36  PDFTextField        6  505.712  437.1100  fd426Group Medicaid Provider No       False       False        NaN      fd426  Group Medicaid Provider No
37  PDFTextField        6  475.952  138.7400               fd426Type of Group       False       False        NaN      fd426               Type of Group
38  PDFTextField        6  452.432  167.6600         fd426Legal Name of Group       False       False        NaN      fd426         Legal Name of Group
39  PDFTextField        6  386.044   65.0357             fd426ownershipofgrpa       False       False        NaN      fd426             ownershipofgrpa
40  PDFTextField        6  362.392   65.0357             fd426ownershipofgrpb       False       False        NaN      fd426             ownershipofgrpb
41  PDFTextField        6  338.852   65.0357             fd426ownershipofgrpc       False       False        NaN      fd426             ownershipofgrpc
42  PDFTextField        6  248.290   62.3066      fd426ownershiprealtedingrpa       False       False        NaN      fd426      ownershiprealtedingrpa
43  PDFTextField        6  225.452   62.3066      fd426ownershiprealtedingrpb       False       False        NaN      fd426      ownershiprealtedingrpb
44  PDFTextField        6  201.932   61.7987      fd426ownershiprealtedingrpc       False       False        NaN      fd426      ownershiprealtedingrpc
45  PDFTextField        6  131.231   53.2557      fd426ownershipsubcontractor       False       False        NaN      fd426      ownershipsubcontractor
46  PDFTextField        6   88.875   65.0357       fd426namedtssnofemployeesa       False       False        NaN      fd426       namedtssnofemployeesa
47  PDFTextField        6   68.986   65.0357       fd426namedtssnofemployeesb       False       False        NaN      fd426       namedtssnofemployeesb
48  PDFTextField        6   47.506   64.5676       fd426namedtssnofemployeesc       False       False        NaN      fd426       namedtssnofemployeesc
```
it should be "name dt ssn of employees"

```python
df[df["pageNum"]==11]
```
select rows
```csv
229   PDFCheckBox       11  498.4730  206.7770  ...      False        0.0       fd426                              approvedprovideryes
230   PDFCheckBox       11  498.4730  248.8310  ...      False        0.0       fd426                               approvedproviderno
231  PDFTextField       11  455.1630   88.6728  ...      False        NaN       fd426                   pprovedprovideryesexplaination
232   PDFCheckBox       11  416.5240  187.1530  ...      False        0.0       fd426                             licensesuspensionyes
```
the "approved" translation is correct

- also did
  - datefdate_af_date -> date af date
    individual interpreted this as "date fdate af date"
    group ai did "date af date"
      maybe next time, ask it not to drop any letters
      I prefer the individual one
  - jointdatefdate_af_date -> joint date af date
  - namedtssnofemployeesa, b, c -> named tss no of employees a, b, c
  - pprovedprovideryesexplaination -> approved provider yes explaination


Manually correct in the output file:
datefdate_af_date
jointdatefdate_af_date
named tss no of employees -> name dt ssn of employees

```python
njai_output_path_corrected = "~/notes/749472 njai ffs group output manually corrected.tsv"
df_ai_corrected = pd.read_csv(njai_output_path_corrected, sep="\t")
```

```python
len(df)
# 658

len(df_ai_corrected)
# 658

set(df["key_without_prefix"]) == set(df_ai_corrected["key_without_prefix"])
# False

set(df["key_without_prefix"]) - set(df_ai_corrected["key_without_prefix"])
"""
{'Affirm_3Please list language  numbers 1',
 'Affirm_3Please list language  numbers 2',
 'Affirm_3Please list language  numbers 3',
 'Affirm_4Please list language  numbers 1_2',
 'Affirm_4Please list language  numbers 2_2',
 'Affirm_4Please list language  numbers 3_2'}
"""
# It also cleaned up double spaces in the original key column
```

749472 njai ffs group output manually corrected 2

```python
njai_output_path_corrected_2 = "~/notes/749472 njai ffs group output manually corrected 2.tsv"
df_ai_corrected_2 = pd.read_csv(njai_output_path_corrected_2, sep="\t")

set(df["key_without_prefix"]) == set(df_ai_corrected_2["key_without_prefix"])
# True

df_merge = df.merge(df_ai_corrected_2, on='key_without_prefix')
len(df_merge)
# 660
# yup, because I forgot to correct this for this round lol

del df_merge["matches"]
del df_merge["matches_validation_2"]

df_merge[df_merge["key_without_prefix"].duplicated()]
"""
             type  pageNum     yPos      xPos             key  isReadOnly  isRequired  maxLength key_prefix key_without_prefix  index cleaned_key
29   PDFTextField        4  306.730  222.1740  fd443signature       False       False        NaN      fd443          signature    250   signature
251  PDFTextField       12  350.429   36.5398  fd426signature       False       False        NaN      fd426          signature     28   signature
252  PDFTextField       12  350.429   36.5398  fd426signature       False       False        NaN      fd426          signature    250   signature
"""

df_merge[df_merge["key_without_prefix"] == "signature"]
"""
             type  pageNum     yPos      xPos             key  isReadOnly  isRequired  maxLength key_prefix key_without_prefix  index cleaned_key
28   PDFTextField        4  306.730  222.1740  fd443signature       False       False        NaN      fd443          signature     28   signature
29   PDFTextField        4  306.730  222.1740  fd443signature       False       False        NaN      fd443          signature    250   signature
251  PDFTextField       12  350.429   36.5398  fd426signature       False       False        NaN      fd426          signature     28   signature
252  PDFTextField       12  350.429   36.5398  fd426signature       False       False        NaN      fd426          signature    250   signature
"""

df[df["key_without_prefix"] == "signature"]
"""
             type  pageNum     yPos      xPos             key  isReadOnly  isRequired  maxLength key_prefix key_without_prefix
28   PDFTextField        4  306.730  222.1740  fd443signature       False       False        NaN      fd443          signature
250  PDFTextField       12  350.429   36.5398  fd426signature       False       False        NaN      fd426          signature
"""

df_merge = df_merge.drop([29, 251])

df_merge = df_merge.reset_index(drop=True)
df_merge[df_merge["key_without_prefix"] == "signature"]
"""
             type  pageNum     yPos      xPos             key  isReadOnly  isRequired  maxLength key_prefix key_without_prefix  index cleaned_key
28   PDFTextField        4  306.730  222.1740  fd443signature       False       False        NaN      fd443          signature     28   signature
250  PDFTextField       12  350.429   36.5398  fd426signature       False       False        NaN      fd426          signature    250   signature
"""
len(df_merge)
# 658

df_merge["maxLength"].unique()
# array([nan,  0., 11.,  4.,  1.])

df_merge["isReadOnly"].unique()
# array([False])

df_merge["isRequired"].unique()
# array([False])

del df_merge["isReadOnly"]
del df_merge["isRequired"]

original_df = df

df = df_merge
del df["index"]

col_order = [
'cleaned_key',
'pageNum',
'yPos',
'xPos',
'key',
'type',
'maxLength',
'key_prefix',
'key_without_prefix',
]
df = df[col_order]
df = df.rename(columns={"cleaned_key": "cleaned_key_not_unique"})

df.to_csv(merged_output_path, index=False)
```