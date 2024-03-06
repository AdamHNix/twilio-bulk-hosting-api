import axios from 'axios';
import 'dotenv/config';

const numbers = [
  //Add your numbers here, separated by commas
];

const phoneNumberObjectsPromise = numbers.map((phoneNumber) => ({
  phone_number: phoneNumber,
  status_callback_url: process.env.STATUS_CALLBACK_URL,
}));

let phoneNumberObjects = await Promise.all(phoneNumberObjectsPromise);

let newJson = {
  friendly_name: process.env.FRIENDLY_NAME,
  notification_email: process.env.NOTIFICATION_EMAIL,
  request_items: [
    {
      email: process.env.NOTIFICATION_EMAIL,
      address_sid: process.env.ADDRESS_SID,
      contact_phone_number: process.env.CONTACT_PHONE_NUMBER,
      contact_title: process.env.CONTACT_TITLE,
      numbers: phoneNumberObjects,
    },
  ],
};
newJson = JSON.stringify(newJson);

await axios
  .post(`https://numbers.twilio.com/v2/HostedNumber/Orders/Bulk`, newJson, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    auth: {
      username: process.env.TWILIO_ACCOUNT_SID,
      password: process.env.TWILIO_AUTH_TOKEN,
    },
  })
  .then((response) => {
    console.log('submitted');
  })
  .catch((error) => {
    console.error('Error: ', error);
  });
