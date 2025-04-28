const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./service-account.json');

const SHEET_ID = '1s6nibdbq4f0xenlctcOKo_w5cb_JH3P4gcjC_Bb3IK4'; // ✅ The long ID from the sheet URL

async function logToGoogleSheet(question, answer, author) {
  const doc = new GoogleSpreadsheet(SHEET_ID);

  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  await sheet.addRow({
    Timestamp: new Date().toISOString(),
    Question: question,
    Answer: answer,
    Author: author,
  });
}

module.exports = logToGoogleSheet;
