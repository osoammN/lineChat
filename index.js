require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const logToGoogleSheet = require('./googleSheet');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(async (event) => {
    if (event.type === 'message' && event.message.type === 'text') {
      const userId = event.source.userId;
      let message = event.message.text; // ✅ Change to `let` instead of `const`
      const parts = message.split(","); // ✅ Correct spelling: split (not spilt)
      const func = parts[0]?.trim();
      const question = parts[1]?.trim();
      const answer = parts[2]?.trim();
      const type = parts[3]?.trim();
      const author = parts[4]?.trim();
      if ((func === "s" || func === "S") && parts.length === 5) {
        const type = parts[3]?.trim();
        await logToGoogleSheet(question, answer, type, author);
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: `📩 Received: "${message}"`,
        });
      }      
    }
      
      
      

      // ✅ Reply to user
    //   await client.replyMessage(event.replyToken, {
    //     type: 'text',
    //     text: `📩 Received: "${message}"`,
    //   });
    
  }))
  .then(() => res.status(200).end())
  .catch(err => {
    console.error("Webhook error:", err);
    res.status(500).end();
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
