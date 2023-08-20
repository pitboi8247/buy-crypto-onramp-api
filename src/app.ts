import express from 'express';
import cors from 'cors';
import { config as _c } from 'dotenv';
import errorHandler from './middleware/errorHandlingMiddleware';
import router from './api/router';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import webPush from 'web-push';
import config from './config/config';

const filePath = path.join(__dirname, './addresses.txt');
const app = express();

// app.use(express.json());
app.use(bodyParser.json());

app.set('trust proxy', true);
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.status(200).send({ result: 'ok' });
});
app.use('/', router);
app.use(errorHandler);

app.get('/ip', (req, res) => {
  const ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    '';
  res.send(ip);
});

// Set up Web Push VAPID keys
webPush.setVapidDetails(
  'mailto:your-email@example.com',
  config.webPushPublicKey,
  config.webPushPrivateKey,
);

const subscriptions = [];

app.post('/subscribe', (req, res) => {
  console.log(req.body);

  const subscription = req.body;
  subscriptions.push(subscription);
  console.log(req.body);
  res.status(201).json({ message: 'Subscription added successfully' });
  const payload = JSON.stringify({ title: 'Pancake Notifications', body: 'This is your first push notification' });

  webPush.sendNotification(subscription, payload).catch(console.log);
});

app.post('/send-notification', (req, res) => {
  const payload = JSON.stringify(req.body.payload);
  console.log(payload)

  if (!subscriptions.includes(req.body.subscription)) {
    subscriptions.push(req.body.subscription);
  }

  subscriptions.forEach((subscription) => {
    webPush.sendNotification(subscription, payload).catch((error) => {
      console.error('Error sending push notification:', error);
    });
  });

  res.status(200).json({ message: 'Push notifications sent successfully' });
});

// Define the endpoint
app.get('/checkItem', (req, res) => {
  const searchAddress = req.query.searchAddress as string;

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading wallet addresses:', err);
      return res.status(500).json({ error: 'Error reading wallet addresses' });
    }
    const addresses = data.split('\n').filter((address) => address.trim() !== '');
    const found = addresses.includes(searchAddress.toLowerCase());

    res.json({ found });
  });
});

export default app;
