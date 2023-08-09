import { WebhookResponse } from 'api/webhookCallbacks/webhookCallbacks';

const sendBuyCryptoNotification = async (notificationInfo: WebhookResponse) => {

  const SuccessBody = `Tranaction complete. ${notificationInfo.cryptoAmount} ${notificationInfo.cryptoCurrency} has successfully arrived to your wallet. \n\n\nTransaction Details: \n Status: ${notificationInfo.status} Transaction id: ${notificationInfo.transactionId} \n Provider Fee: ${notificationInfo.providerFee} ${notificationInfo.fiatCurrency} \n Fiat currency: ${notificationInfo.fiatCurrency} \n Network: ${notificationInfo.network}`;
  const updateBody = `Purchase status has been updated to '${notificationInfo.status}'`;
  const failedBody = `Tranaction Failed. Your purchase for ${notificationInfo.cryptoAmount} ${notificationInfo.cryptoCurrency} was unsuccessful and did not go through. \n\n\nTransaction Details: \n Status: ${notificationInfo.status} Transaction id: ${notificationInfo.transactionId} \n Provider Fee: ${notificationInfo.providerFee} ${notificationInfo.fiatCurrency} \n Fiat currency: ${notificationInfo.fiatCurrency} \n Network: ${notificationInfo.network}`;

  const parts = notificationInfo.transactionId.split('_');
  const chainId = parts[0];
  const account = parts[1];

  console.log(chainId, account)

  const notificationPayload = {
    accounts: [`eip155:${chainId}:${account}`],
    notification: {
      title: notificationInfo.status === 'paid' ? 'Crypto Purchase Complete' : notificationInfo.status === 'order_failed' ? 'Crypto Purchase Failed' : 'Crypto Purchase Status Updated',
      body: notificationInfo.status === 'paid' ? SuccessBody : notificationInfo.status === 'order_failed' ? failedBody : updateBody ,
      icon: `https://tokens.pancakeswap.finance/images/symbol/${notificationInfo.cryptoCurrency.toLowerCase()}.png`,
      url: 'https://pc-custom-web.vercel.app',
      type: 'alerts',
    },
  };
  const walletConnectPushResponse = await fetch(
    `https://cast.walletconnect.com/${'ae5413feaf0cdaee02910dc807e03203'}/notify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${'85a7792c-c5d7-486b-b37e-e752918e4866'}`,
      },
      body: JSON.stringify(notificationPayload),
    },
  );

  // console.log(walletConnectPushResponse)

  const result = await walletConnectPushResponse.json();
  console.log(result)

  return result;
};

export default sendBuyCryptoNotification
