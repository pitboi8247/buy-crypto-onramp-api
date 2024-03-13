export enum BuilderNames {
      TransactionProcessingNotification = "TransactionProcessingNotification",
      TransactionCompleteNotification = "TransactionCompleteNotification",
      TransactionFailedNotification = "TransactionFailedNotification",
}

export enum ScopeIdsToName {
      Lottery = "b42403b3-2712-4e1e-8cc7-cb2d9c1350b4",
      Prediction = "52816341-59cd-49e2-8f3b-d15bf2c107fb",
      Liquidity = "02879833-eb9c-4cc3-8760-f762ab218ca6",
      Farms = "cf41e730-22d8-42d6-a7d5-1e79b6f7820b",
      PriceUpdates = "ad885f1d-3f25-46ea-916a-7ebe630b6f98",
      Promotional = "87393202-5cd7-4a0b-a672-bd4eded25e7b",
      Alerts = "069d1195-50a0-47b0-81a6-2df3024831ba",
      TradingReward = "e0a3aeb3-3ec2-496d-b6c7-343185de6aca",
}

export type pushNotification = {
      title: string;
      body: string;
      icon?: string;
      url?: string;
      type: string;
};

export type NotificationPayload = {
      accounts: string[];
      notification: pushNotification;
};

export type NotificationBody = {
      [BuilderNames.TransactionProcessingNotification]: (
            amount: string | number,
            currency: string
      ) => string;
      [BuilderNames.TransactionCompleteNotification]: (
            amount: string | number,
            currency: string
      ) => string;
      [BuilderNames.TransactionFailedNotification]: (
            amount: string | number,
            currency: string
      ) => string;
};
export interface PancakeNotificationBuilders {
      TransactionProcessingNotification: {
            TransactionProcessingNotification: () => pushNotification;
      };
      TransactionCompleteNotification: {
            TransactionCompleteNotification: (
                  token1: string,
                  token2: string,
                  token1Amount: string,
                  token2Amount: string
            ) => pushNotification;
      };
      TransactionFailedNotification: { TransactionFailedNotification: () => pushNotification };
}
