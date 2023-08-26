import { WebhookResponse } from 'api/webhookCallbacks/webhookCallbacks';

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

const sendBuyCryptoNotification = async (notificationInfo: WebhookResponse) => {
  const SuccessBody = `Tranaction complete. ${notificationInfo.cryptoAmount} ${notificationInfo.cryptoCurrency} has successfully arrived to your wallet. \n\n\nTransaction Details: \n Status: ${notificationInfo.status} Transaction id: ${notificationInfo.transactionId} \n Provider Fee: ${notificationInfo.providerFee} ${notificationInfo.fiatCurrency} \n Fiat currency: ${notificationInfo.fiatCurrency} \n Network: ${notificationInfo.network}`;
  const updateBody = `Purchase status has been updated to '${notificationInfo.status}'`;
  const failedBody = `Tranaction Failed. Your purchase for ${notificationInfo.cryptoAmount} ${notificationInfo.cryptoCurrency} was unsuccessful and did not go through. \n\n\nTransaction Details: \n Status: ${notificationInfo.status} Transaction id: ${notificationInfo.transactionId} \n Provider Fee: ${notificationInfo.providerFee} ${notificationInfo.fiatCurrency} \n Fiat currency: ${notificationInfo.fiatCurrency} \n Network: ${notificationInfo.network}`;

  const parts = notificationInfo.transactionId.split('_');
  const account = parts[0];

  const notificationPayload = {
    accounts: [`eip155:1:${account}`],
    notification: {
      title:
        notificationInfo.status === 'paid'
          ? 'Crypto Purchase Complete'
          : notificationInfo.status === 'order_failed'
          ? 'Crypto Purchase Failed'
          : 'Crypto Purchase Status Updated',
      body:
        notificationInfo.status === 'paid'
          ? SuccessBody
          : notificationInfo.status === 'order_failed'
          ? failedBody
          : updateBody,
      icon: `https://tokens.pancakeswap.finance/images/symbol/${notificationInfo.cryptoCurrency.toLowerCase()}.png`,
      url: 'https://pc-custom-web.vercel.app',
      type: 'alerts',
    },
  };
  const walletConnectPushResponse = await fetch(
    `https://notify.walletconnect.com/${'d460b3b88b735222abe849b3d43ed8e4'}/notify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${'dea2d1c0-4f90-4f4e-b0a4-09e84d52b0ee'}`,
      },
      body: JSON.stringify(notificationPayload),
    },
  );

  const result = await walletConnectPushResponse.json();
  // await sendBrowserNotification('PancakeSwap Alert', 'You have recieved a notification from pncakeswap.')

  return result;
};

export default sendBuyCryptoNotification;
