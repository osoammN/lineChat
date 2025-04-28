
const { GoogleSpreadsheet } = require('google-spreadsheet');

const SHEET_ID = '1s6nibdbq4f0xenlctcOKo_w5cb_JH3P4gcjC_Bb3IK4'; // ❗️Use your actual Google Sheet ID

const creds = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
};

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
