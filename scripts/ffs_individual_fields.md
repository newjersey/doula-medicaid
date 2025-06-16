# Get all form fields from ffs individual

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
      key: field.getName(),
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

file_path = "~/notes/749477 ffs individual all fields.json"
output_path = "~/notes/749476 cleaned keys.csv"
merged_output_path = "~/notes/749476 ffs individual merged.csv"

df = pd.read_json(file_path)

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
```

https://ai-assistant.nj.gov/

This is a csv where the first column is an index, and the second column is key_without_prefix. The second key_without_prefix column contains phrases of words that have been mashed together, and sometimes don't have spaces between the words where they should be. Please create a third column, called cleaned_key, that takes the corresponding value from the second key_without_prefix column and adds spaces between the words. Please preserve all capitalization, and preserve the row ordering. Do not mix up any data between rows.

Doing group gave me a tsv. Next time, specify output should be a CSV. Also specify not to drop any letters. It also modified the second column to clean up double spaces. Tell it not to modify the key_without_prefix column

```text
Sure, I will create a third column called
`cleaned_key`
with spaces added between the words in the
`key_without_prefix`
column.
```

```python
njai_output_path = "~/notes/749476 njai output.csv"
df_ai = pd.read_csv(njai_output_path)
# it also stripped "_"

def only_modified_space_underscore(value):
  value = value.replace(" ", "")
  value = value.replace("_", "")
  return value

df_ai["matches"] = df_ai.apply(lambda row: only_modified_space_underscore(row["key_without_prefix"]) == only_modified_space_underscore(row["cleaned_key"]), axis=1)

df_ai[df_ai["matches"]!= True]
```

Manually checked all these. It
- fixed spelling mistakes
  - sugnature -> signature
  - signtuare -> signature
  - explaination -> explanation
  - affliated -> affiliated
  - releationship -> relationship
  - interes -> interest
  - ine -> line
  - yyes -> yes
  - contanct -> contact
  - Paternship -> Partnership
- capitalized NJ
- numb -> number
- entitys -> entity's
```csv
     index                          key_without_prefix                                        cleaned_key  matches
5        5        trainingprogramcontanctE-mailAddress            training program contact E-mail Address    False
29      29                 authorizationsugnaturename4                     authorization signature name 4    False
77      77             approvedprovideryesexplaination                  approved provider yes explanation    False
80      80            licensesuspensionyesexplaination                 license suspension yes explanation    False
83      83                     indictedyesexplaination                           indicted yes explanation    False
86      86           programsuspensionsyesexplaination                program suspensions yes explanation    False
89      89                  partnershipyesexplaination                        partnership yes explanation    False
90      90                      employedbystateofnjyes                        employed by state of NJ yes    False
91      91                       employedbystateofnjno                         employed by state of NJ no    False
92      92          employedbystateofnjyesexplaination            employed by state of NJ yes explanation    False
115    115                  disclosingentityPaternship                      disclosing entity Partnership    False
128    128                        providernumbandornpi                         provider number and or npi    False
134    134                affliatedprevious12monthsyes                  affiliated previous 12 months yes    False
135    135                 affliatedprevious12monthsno                   affiliated previous 12 months no    False
154    154                     ownerreleationshipline1                          owner relationship line 1    False
155    155                     ownerreleationshipline2                          owner relationship line 2    False
156    156                     ownerreleationshipline3                          owner relationship line 3    False
157    157                     ownerreleationshipline4                          owner relationship line 4    False
158    158        ownerreleationshipsubcontractorline1            owner relationship subcontractor line 1    False
159    159        ownerreleationshipsubcontractorline2            owner relationship subcontractor line 2    False
160    160        ownerreleationshipsubcontractorline3            owner relationship subcontractor line 3    False
161    161        ownerreleationshipsubcontractorline4            owner relationship subcontractor line 4    False
162    162  nameofotherentitywithownershipinteresline1  name of other entity with ownership interest l...    False
163    163  nameofotherentitywithownershipinteresline2  name of other entity with ownership interest l...    False
164    164  nameofotherentitywithownershipinteresline3  name of other entity with ownership interest l...    False
165    165  nameofotherentitywithownershipinteresline4  name of other entity with ownership interest l...    False
166    166  nameofotherentitywithownershipinteresline5  name of other entity with ownership interest l...    False
167    167               managingagentsdateofbirthine1               managing agents date of birth line 1    False
171    171               managingagentsdateofbirthine2               managing agents date of birth line 2    False
175    175               managingagentsdateofbirthine3               managing agents date of birth line 3    False
179    179               managingagentsdateofbirthine4               managing agents date of birth line 4    False
183    183               managingagentsdateofbirthine5               managing agents date of birth line 5    False
198    198        affiliatesindividualentitysroleline1         affiliates individual entity's role line 1    False
205    205        affiliatesindividualentitysroleline2         affiliates individual entity's role line 2    False
212    212        affiliatesindividualentitysroleline3         affiliates individual entity's role line 3    False
219    219        affiliatesindividualentitysroleline4         affiliates individual entity's role line 4    False
289    289                    increasedbedcapacityyyes                         increased bed capacity yes    False
294    294                        disclosableeventyyes                              disclosable event yes    False
392    392                      W9_signtuareofusperson                          W9 signature of us person    False
```


```python
def validation_function_2(value):
  value = value.replace("sugnature", "signature")
  value = value.replace("signtuare", "signature")
  value = value.replace("explaination", "explanation")
  value = value.replace("affliated", "affiliated")
  value = value.replace("releationship", "relationship")
  value = value.replace("yyes", "yes")
  value = value.replace("entitys", "entity's")
  value = value.replace("nj", "NJ")
  value = value.replace("contanct", "contact")
  value = value.replace("Paternship", "Partnership")
  value = value.replace(" ", "")
  value = value.replace("_", "")
  # numb -> number
  # value = value.replace("interes", "interest")
  # value = value.replace("ine", "line")
  return value

df_ai["matches_validation_2"] = df_ai.apply(lambda row: validation_function_2(row["key_without_prefix"]) == validation_function_2(row["cleaned_key"]), axis=1)

pd.set_option('display.max_colwidth', None)
df_ai[df_ai["matches_validation_2"]!= True]
pd.reset_option('display.max_colwidth')
```
```csv
     index                          key_without_prefix                                          cleaned_key  matches  matches_validation_2
128    128                        providernumbandornpi                           provider number and or npi    False                 False
162    162  nameofotherentitywithownershipinteresline1  name of other entity with ownership interest line 1    False                 False
163    163  nameofotherentitywithownershipinteresline2  name of other entity with ownership interest line 2    False                 False
164    164  nameofotherentitywithownershipinteresline3  name of other entity with ownership interest line 3    False                 False
165    165  nameofotherentitywithownershipinteresline4  name of other entity with ownership interest line 4    False                 False
166    166  nameofotherentitywithownershipinteresline5  name of other entity with ownership interest line 5    False                 False
167    167               managingagentsdateofbirthine1                 managing agents date of birth line 1    False                 False
171    171               managingagentsdateofbirthine2                 managing agents date of birth line 2    False                 False
175    175               managingagentsdateofbirthine3                 managing agents date of birth line 3    False                 False
179    179               managingagentsdateofbirthine4                 managing agents date of birth line 4    False                 False
183    183               managingagentsdateofbirthine5                 managing agents date of birth line 5    False                 False
273    273                subsidiaryofparentcompanyyes                     subsidiary of parent company yes     True                 False
275    275           subsidiaryofparentcompanyyesline1              subsidiary of parent company yes line 1     True                 False
276    276           subsidiaryofparentcompanyyesline2              subsidiary of parent company yes line 2     True                 False
277    277           subsidiaryofparentcompanyyesline3              subsidiary of parent company yes line 3     True                 False
278    278           subsidiaryofparentcompanyyesline4              subsidiary of parent company yes line 4     True                 False
279    279           subsidiaryofparentcompanyyesline5              subsidiary of parent company yes line 5     True                 False
280    280           subsidiaryofparentcompanyyesline6              subsidiary of parent company yes line 6     True                 False
281    281              affiliatedwithparentcompanyyes                   affiliated with parent company yes     True                 False
283    283         affiliatedwithparentcompanyyesline1            affiliated with parent company yes line 1     True                 False
284    284         affiliatedwithparentcompanyyesline2            affiliated with parent company yes line 2     True                 False
285    285         affiliatedwithparentcompanyyesline3            affiliated with parent company yes line 3     True                 False
286    286         affiliatedwithparentcompanyyesline4            affiliated with parent company yes line 4     True                 False
287    287         affiliatedwithparentcompanyyesline5            affiliated with parent company yes line 5     True                 False
288    288         affiliatedwithparentcompanyyesline6            affiliated with parent company yes line 6     True                 False
```

lgtm!

```python
len(df)
# 423

len(df_ai)
# 423

set(df["key_without_prefix"]) == set(df_ai["key_without_prefix"])
df_merge = df.merge(df_ai, on='key_without_prefix')
len(df_merge)
# 425
# boo

df_merge[df_merge["key_without_prefix"].duplicated()]
"""
            type  pageNum     yPos     xPos               key  isReadOnly  isRequired  maxLength key_prefix key_without_prefix  index   cleaned_key  matches  matches_validation_2
43  PDFTextField        5  423.050  431.269  fd443telephoneno       False       False        NaN      fd443        telephoneno     59  telephone no     True                  True
60  PDFTextField        7  454.871  213.528  fd425telephoneno       False       False        NaN      fd425        telephoneno     42  telephone no     True                  True
61  PDFTextField        7  454.871  213.528  fd425telephoneno       False       False        NaN      fd425        telephoneno     59  telephone no     True                  True
"""

df_merge[df_merge["key_without_prefix"] == "telephoneno"]
"""
            type  pageNum     yPos     xPos               key  isReadOnly  isRequired  maxLength key_prefix key_without_prefix  index   cleaned_key  matches  matches_validation_2
42  PDFTextField        5  423.050  431.269  fd443telephoneno       False       False        NaN      fd443        telephoneno     42  telephone no     True                  True
43  PDFTextField        5  423.050  431.269  fd443telephoneno       False       False        NaN      fd443        telephoneno     59  telephone no     True                  True
60  PDFTextField        7  454.871  213.528  fd425telephoneno       False       False        NaN      fd425        telephoneno     42  telephone no     True                  True
61  PDFTextField        7  454.871  213.528  fd425telephoneno       False       False        NaN      fd425        telephoneno     59  telephone no     True                  True
"""
df_merge = df_merge.drop([43, 60])

df_merge[df_merge["key_without_prefix"] == "telephoneno"]
"""
            type  pageNum     yPos     xPos               key  isReadOnly  isRequired  maxLength key_prefix key_without_prefix  index   cleaned_key  matches  matches_validation_2
42  PDFTextField        5  423.050  431.269  fd443telephoneno       False       False        NaN      fd443        telephoneno     42  telephone no     True                  True
61  PDFTextField        7  454.871  213.528  fd425telephoneno       False       False        NaN      fd425        telephoneno     59  telephone no     True                  True
"""
len(df_merge)
# 423
 
del df_merge["matches"]
del df_merge["matches_validation_2"]

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