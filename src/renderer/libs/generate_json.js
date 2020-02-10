export const generateJson = (
  filename1,
  filename2,
  templateId,
  scannerCode,
  pageId
) => {
  return `{
  "rawFileNames": [
      "${filename1}"
      "${filename2}"
    ],

  "templateId": "${templateId}", 

  "scannerCode": "${scannerCode}", 

  "pageId": "${pageId}", 
  "files": [],

  "errmsg": "", 
  "exam": "", 

  "studentName": {
    "path": "",
    "text": "",
    "confidence": "0"
  },

  "studentCode": {
    "path": "",
    "text": "",
    "confidence": ""
  }, 

  "studentCode2": {
    "path": "",
    "text": "",
    "confidence": ""
  }, 

  "Choice": [],
  "MultiChoice": [],
  "WriteQuestion": []
}
`;
};
