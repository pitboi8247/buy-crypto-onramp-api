import { addPrefix } from "./utils/utils";
import {
      NotificationBody,
      NotificationBodyKeys,
      NotificationPayload,
      PancakeNotificationBuilders,
      ScopeIdsToName,
} from "./types";

export const PancakeNotifications: {
      [notificationBuilder in keyof PancakeNotificationBuilders]: <T>(args: T[]) => NotificationPayload;
} = {
      TransactionProcessingNotification: (args): any => {
            return {
                  accounts: addPrefix(args[0]),
                  notification: {
                        title: `${args[1]} Purchase Processing`,
                        body: args[2],
                        icon: "https://transak.com/favicon.png",
                        url: `https://transak.com/`,
                        type: ScopeIdsToName.Alerts,
                  },
            };
      },
      TransactionCompleteNotification: (args): any => {
            return {
                  accounts: addPrefix(args[0]),
                  notification: {
                        title: `${args[1]} Purchase Complete`,
                        body: args[2],
                        icon: "https://transak.com/favicon.png",
                        url: `https://transak.com/`,
                        type: ScopeIdsToName.Alerts,
                  },
            };
            // ... add more as we create use cases
      },
      TransactionFailedNotification: (args): any => {
            return {
                  accounts: addPrefix(args[0]),
                  notification: {
                        title: `${args[1]} Purchase Failed`,
                        body: args[2],
                        icon: "https://transak.com/favicon.png",
                        url: `https://transak.com/`,
                        type: ScopeIdsToName.Alerts,
                  },
            };
      },
};

export const notificationBodies: {
      [notificationBody in NotificationBodyKeys]: NotificationBody[notificationBody];
} = {
      [NotificationBodyKeys.Lottery1]: (timeRemaining, cakeAmount, cakeAmountUSD) =>
            `${timeRemaining} remaining until the next lottery draw. Enter to have a chance to win ${cakeAmount} CAKE worth over $${cakeAmountUSD}.`,
      [NotificationBodyKeys.Lottery2]: (timeRemaining) =>
            `Just ${timeRemaining} until the next lottery draw. Don't forget to check your numbers and wait for the result. Best of luck to everyone`,
      [NotificationBodyKeys.Lottery3]: (roundId) => `Round ${roundId} is over. View the results`,
      [NotificationBodyKeys.Balances]: () => `Top up or purchase via Buy Crypto with the link below`,
      [NotificationBodyKeys.Prices]: (
            token: string,
            isUp: string,
            percentageChange: string,
            oldPrice: string,
            currentPrice: string
      ) =>
            `The price of ${token} has ${isUp} by over ${percentageChange}% in the past hour. \n \n \n Old price: $${oldPrice}  \n \n Current Price: $${currentPrice}`,
      [NotificationBodyKeys.Predictions1]: (asset, roundId) =>
            `Congratulations! The results for prediction round ${roundId} are out. You can now claim your ${asset} rewards via the link below`,
      [NotificationBodyKeys.Predictions2]: (asset, roundId) =>
            `The results for ${asset} prediction round ${roundId} are out. You can view them with the link below`,
      [NotificationBodyKeys.Predictions3]: () =>
            `Want to have some fun betting on the price of CAKE and BNB? Well if so, try out Pancake Predictions to be in with a chance to win CAKE and BNB`,
      [NotificationBodyKeys.Farms]: (farms, chainId, currentApr, lastApr, isMultiple) => {
            const singleFarm = `There has been movement in the following farm on ${chainId}. ${farms}. Its APR has risen by over 30% in the last 24 hours.\n Old APR: ${lastApr}%  \n Current APR: ${currentApr}%`;
            const multipleFarm = `There has been movement in the following farms on ${chainId}. ${farms}. Their APRs have all moved by over 30% in the last 24 hours`;
            return isMultiple ? multipleFarm : singleFarm;
      },
      [NotificationBodyKeys.TradingReward1]: (reward, timeRemainingToClaim) =>
            `Congrats!, you have unclaimed trading rewards that you can collect worth ${reward} USD. Follow the link below to claim. You have ${timeRemainingToClaim} left before your reward expires.`,
      [NotificationBodyKeys.TradingReward2]: () =>
            `You have unclaimed trading rewards, but you need to activate your profile to collect. Activate your profile below.`,
      [NotificationBodyKeys.TradingReward3]: () =>
            `Have you tried the PancakeSwap trading rewards program? Start trading any eligible pairs to earn rewards in CAKE.  \n \n The more you trade, the more rewards you will earn from the current reward pool. \n \n Learn more through the link below`,
      [NotificationBodyKeys.Liquidity1]: (chainId, lpSymbols) =>
            `Your liquidity position ${lpSymbols} on ${chainId} is no longer in its price range. Please readjust your position to earn LP fees`,
      [NotificationBodyKeys.Liquidity2]: (chainId, lpSymbol) =>
            `Your liquidity positions ${lpSymbol} on ${chainId} are out of the current price range. Please readjust your position to earn LP fees`,
};
