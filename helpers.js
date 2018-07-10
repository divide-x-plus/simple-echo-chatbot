let request = require('request');

// let PAGE_ACCESS_TOKEN = 'EAAboY0kSHKkBAKaMa0eSmCrSKymFEuZAA4rAMVbXCbJJLZAEd2BQM319ZCh2t1KOZC0f1ZCRBMMK1d8m41MEkdDfbYJX5CIsdqS4II3Bq6hdNZCc4aZBQLfFMj74reHLDtx6ZA3zUJQH8hZC8T7YhF5wNyewLiTGlZBufCDKlblgtiUAZDZD';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Handles messages events
var handleMessage = (sender_psid, received_message) => {
  let response;

  // Check if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }  else if (received_message.attachments) {
  
    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
  
  } 
  
  // Sends the response message
  callSendAPI(sender_psid, response);    
}

// Handles messaging_postbacks events
var handlePostback = (sender_psid, received_postback) => {

}

// Sends response messages via the Send API
var callSendAPI = (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

module.exports = { handleMessage, handlePostback, callSendAPI };
