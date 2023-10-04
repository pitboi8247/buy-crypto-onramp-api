import axios from 'axios';
import { Providers, WebhookResponse } from '../typeValidation/types';

const sendBuyCryptoNotification = async (
  notificationInfo: WebhookResponse,
  provider: Providers,
) => {
  const successBody = getSuccessNotificationBody(notificationInfo);
  const failedBody = getFailedNotificationBody(notificationInfo);

  const title =
    notificationInfo.status === 'complete'
      ? `${notificationInfo.cryptoCurrency} Purchase Complete`
      : `${notificationInfo.cryptoCurrency} Purchase Failed`;

  const parts = notificationInfo.transactionId.split('_');
  const account = parts[0];

  try {
    const pushNotificationResponse = await await axios.post(
      `https://notify.walletconnect.com/${"a14938037e06221040c0fa6a69a1d95f"}/notify`,
      {
        accounts: [`eip155:1:${account}`],
        notification: {
          body: notificationInfo.status === 'complete' ? successBody : failedBody,
          icon: getNotificationLogo[provider],
          url: 'https://pc-custom-web.vercel.app',
          type: 'alerts',
          title,
        },
      }, // Pass the payload directly as data
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 03533e45-782a-42fb-820d-c0984ed392d9`,
        },
      },
    );

    const result = await pushNotificationResponse.data;
    if (result.sent.length > 0) {
      // await sendBrowserNotification('PancakeSwap Alert', 'You have new updates from PancakeSwap DEX.');
    }
    return result
  } catch (error) {
    if (error instanceof Error) {
      console.error('failed to send push notification', error);
    }
  }
};

async function sendBrowserNotification(title: string, body: string) {
  try {
    await fetch('http://localhost:8081/send-notification', {
      method: 'POST',
      body: JSON.stringify({ payload: { title, body }, subscription: '' }),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    throw new Error(error);
  }
}

const getSuccessNotificationBody = (args: WebhookResponse) =>
  `${args.cryptoAmount} ${args.cryptoCurrency} has successfully arrived to your wallet. \n\n\nTransaction Details \n Transaction id: ${args.transactionId} \n Provider Fee: ${args.providerFee} ${args.fiatCurrency} \n Fiat currency: ${args.fiatCurrency} \n`;

const getFailedNotificationBody = (args: WebhookResponse) =>
  `Your purchase for ${args.cryptoAmount} ${args.cryptoCurrency} was unsuccessful. \n\n\nTransaction Details: \nTransaction id: ${args.transactionId} \n Provider Fee: ${args.providerFee} ${args.fiatCurrency} \n Fiat currency: ${args.fiatCurrency} \n `;
  
const getNotificationLogo: { [provider: string]: string } = {
  MoonPay: 'https://www.moonpay.com/favicon-purple.ico',
  Mercuryo: 'https://mercuryo.io/static/img/favicon/light/favicon-32x32.svg',
  Transak: 'https://transak.com/favicon.png',
};

export default sendBuyCryptoNotification;
