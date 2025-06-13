# Get all form fields from united 

Upload file

```tsx
// src/app/Form.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      // const parsedFormData = await parseAetnaForm(file);
      parseFormForPDFFields(file);
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
// add this to src/app/forms/form.ts
export const parseFormForPDFFields = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();
  const pages = pdfDoc.getPages();
  const allFields = [];
  for (const field of form.getFields()) {
    const fieldPage = pdfDoc.findPageForAnnotationRef(field.ref);
    if (fieldPage === undefined) {
        const pageNum = -1
    } else {
        const pageNum = pages.findIndex((page) => page.ref.tag === fieldPage.ref.tag) + 1;
    }
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

file_path = "~/Downloads/united_filled_fields.json"
output_path = "~/Downloads/united_pdf_keys.csv"

df = pd.read_json(file_path)

del df["isReadOnly"]
del df["isRequired"]

col_order = [
'pageNum',
'yPos',
'xPos',
'key',
'type',
'maxLength'
]
df = df[col_order]
df.to_csv(output_path, index=False)

```