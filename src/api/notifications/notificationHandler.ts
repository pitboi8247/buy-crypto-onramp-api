import { Address } from "viem";
import { BuilderNames } from "./notification/types";
import { PancakeNotifications } from "./notification/payloadBuiler";
import axios from "axios";
import { sendBrowserNotification } from "./notification";

export const sendPushNotification = async (
      notificationType: BuilderNames,
      args: Array<any>,
      users: Address[]
) => {
      const notificationPayload = PancakeNotifications[notificationType](args);

      try {
            const notifyResponse = await axios.post(
                  `https://notify.walletconnect.com/e542ff314e26ff34de2d4fba98db70bb/notify`,
                  notificationPayload, // Pass the payload directly as data
                  {
                        headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer 93a13775-9e9f-46c6-a15f-524dfa979c39`,
                        },
                  }
            );
            if (notifyResponse?.data?.sent.length > 0) {
                  console.log(notifyResponse.data);
                  await sendBrowserNotification(
                        "PancakeSwap Alert",
                        "You have new updates from PancakeSwap DEX.",
                        users
                  );
            }
      } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            console.error("send notification error", error.response.data);
      }
};
