const express = require('express');
const bodyParser = require('body-parser');
let { handleMessage, handlePostback } = require('./helpers.js');

const app = express().use(bodyParser.json());


// Sets server port and logs message on success
app.listen(process.env.PORT || 1337);

// Creates the endpoint for webhook
app.post('/webhook', (req, res) => {
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      // Gets the body of the webhook event
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      // Gets the PSID
      let senderPSID = webhookEvent.sender.id;
      console.log('Sender PSID is', senderPSID);

      if (webhookEvent.message) {
        handleMessage(senderPSID, webhookEvent.message);
      } else if (webhookEvent.postback) {
        handlePostback(senderPSID, webhookEvent.postback);
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// For verification
app.get('/webhook', (req, res) => {
  // A verify token is a random string of your choosing
  // This should be provided to the Messenger Platform when subscribing your webhook
  let VERIFY_TOKEN = "hello_world";

  // Parse the query parameters 
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
    // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
