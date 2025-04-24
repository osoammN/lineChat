require('dotenv').config(); // 👈 this loads .env values into process.env
const express = require('express');
const line = require('@line/bot-sdk');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();

// Save message to Excel file
function saveToExcel(userId, message) {
  const filePath = path.join(__dirname, 'messages.xlsx');
  let workbook;
  let worksheet;
  let data = [];

  // Load existing file or create new one
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets['Sheet1'];
    data = XLSX.utils.sheet_to_json(worksheet);
  } else {
    workbook = XLSX.utils.book_new();
  }

  // Add new entry
  data.push({
    Timestamp: new Date().toISOString(),
    UserID: userId,
    Message: message,
  });

  // Convert back to sheet and write
  const newSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, newSheet, 'Sheet1');
  XLSX.writeFile(workbook, filePath);
}

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(async (event) => {
      if (event.type === 'message' && event.message.type === 'text') {
        const userId = event.source.userId;
        const message = event.message.text;

        saveToExcel(userId, message); // 🟢 Save to Excel

        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: `Received: "${message}"`,
        });
      }
    }))
    .then(() => res.status(200).end());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
