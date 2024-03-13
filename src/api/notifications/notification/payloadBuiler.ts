import { addPrefix } from "./utils/utils";
import {
      type NotificationBody,
      BuilderNames,
      type NotificationPayload,
      type PancakeNotificationBuilders,
      ScopeIdsToName,
} from "./types";
import { ONRAMP_PROVIDERS } from "../../../config/constants";

const PROVIDER_ICONS = {
      [ONRAMP_PROVIDERS.MoonPay]: "https://www.moonpay.com/favicon-purple-32x32.png",
      [ONRAMP_PROVIDERS.Mercuryo]: "https://mercuryo.io/static/img/favicon/light/favicon-32x32.svg",
      [ONRAMP_PROVIDERS.Transak]: "https://transak.com/favicon.png",
} satisfies Record<keyof typeof ONRAMP_PROVIDERS, string>;

type Provider = keyof typeof ONRAMP_PROVIDERS;

export const PancakeNotifications: {
      [notificationBuilder in keyof PancakeNotificationBuilders]: <T extends string>(
            args: T[]
      ) => NotificationPayload;
} = {
      TransactionProcessingNotification: (args): NotificationPayload => {
            return {
                  accounts: addPrefix(args[0]),
                  notification: {
                        title: `${args[1]} Purchase Processing`,
                        body: args[2],
                        icon: PROVIDER_ICONS[args[1] as Provider],
                        type: ScopeIdsToName.Alerts,
                  },
            };
      },
      TransactionCompleteNotification: (args): NotificationPayload => {
            return {
                  accounts: addPrefix(args[0]),
                  notification: {
                        title: `${args[1]} Purchase Complete`,
                        body: args[2],
                        icon: PROVIDER_ICONS[args[1] as Provider],
                        type: ScopeIdsToName.Alerts,
                  },
            };
            // ... add more as we create use cases
      },
      TransactionFailedNotification: (args): NotificationPayload => {
            return {
                  accounts: addPrefix(args[0]),
                  notification: {
                        title: `${args[1]} Purchase Failed`,
                        body: args[2],
                        icon: PROVIDER_ICONS[args[1] as Provider],
                        type: ScopeIdsToName.Alerts,
                  },
            };
      },
};

export const notificationBodies: {
      [notificationBody in BuilderNames]: NotificationBody[notificationBody];
} = {
      [BuilderNames.TransactionProcessingNotification]: (amount: string | number, currency: string) =>
            `Your transaction for ${amount} ${currency} is processing. you will be notified once the funds arrive to your wallet.`,
      [BuilderNames.TransactionCompleteNotification]: (amount: string | number, currency: string) =>
            `Your transaction for ${amount} ${currency} is completed. the funds should now be in your wallet.`,
      [BuilderNames.TransactionFailedNotification]: (amount: string | number, currency: string) =>
            `Your transaction for ${amount} ${currency} Failed. Sorry about this please reaxh out to support to follow up on the issue.`,
};
