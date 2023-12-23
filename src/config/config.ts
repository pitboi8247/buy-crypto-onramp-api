require("dotenv").config();
import * as z from "zod";

const envsSchema = z
      .object({
            NODE_ENV: z.enum(["production", "development"]),
            PORT: z.string().default("8080"),
            MERCURYO_SECRET_KEY: z
                  .string({ required_error: "Mercuryo secret key required for url signing" })
                  .nonempty(),
            MERCURYO_WIDGET_ID: z
                  .string({ required_error: "Mercuryo widget id required for proxy apis" })
                  .nonempty(),
            MOONPAY_TEST_SECRET_KEY: z
                  .string({ required_error: "moonpay test secret key required for url signing" })
                  .nonempty(),
            MOONPAY_SECRET_KEY: z
                  .string({ required_error: "moonpay secret key required for url signing" })
                  .nonempty(),
            MOONPAY_LIVE_KEY: z
                  .string({ required_error: "moonapy live key required for url signing" })
                  .nonempty(),
            MOONPAY_WEBHOOK_KEY: z
                  .string({ required_error: "Mercuryo webhook key required for url signing" })
                  .nonempty(),
            MERCURYO_SIGN_KEY: z
                  .string({ required_error: "Mercuryo secret key required for url signing" })
                  .nonempty(),
            TRANSAK_API_KEY: z
                  .string({ required_error: "Transak api key required for url signing" })
                  .nonempty(),
            TRANSAK_TEST_API_KEY: z
                  .string({ required_error: "Transak test api key required for url signing" })
                  .nonempty(),
            DATA_DOG_API_KEY: z
                  .string({ required_error: "datadog api key required for logging" })
                  .nonempty(),
            DATA_DOG_APP_NAME: z
                  .string({ required_error: "datadog app name required for url signing" })
                  .nonempty(),
      })
      .nonstrict();

const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MERCURYO_SECRET_KEY: process.env.MERCURYO_SECRET_KEY,
      MERCURYO_WIDGET_ID: process.env.MERCURYO_WIDGET_ID,
      MOONPAY_TEST_SECRET_KEY: process.env.MOONPAY_TEST_SECRET_KEY,
      MOONPAY_SECRET_KEY: process.env.MOONPAY_SECRET_KEY,
      MOONPAY_LIVE_KEY: process.env.MOONPAY_LIVE_KEY,
      PRIVATE_KEY: process.env.PRIVATE_KEY,
      MOONPAY_WEBHOOK_KEY: process.env.MOONPAY_WEBHOOK_KEY,
      MERCURYO_SIGN_KEY: process.env.MERCURYO_SIGN_KEY,
      TRANSAK_API_KEY: process.env.TRANSAK_API_KEY,
      TRANSAK_TEST_API_KEY: process.env.TRANSAK_TEST_API_KEY,
      DATA_DOG_API_KEY: process.env.DATA_DOG_API_KEY,
      DATA_DOG_APP_NAME: process.env.DATA_DOG_APP_NAME,
};

try {
      const validatedEnvs = envsSchema.parse(envVars);
      console.log(validatedEnvs);
} catch (error) {
      console.error("Error validating environment variables:", error);
}

// map env vars and make it visible outside module
export default {
      env: envVars.NODE_ENV,
      port: envVars.PORT,
      mercuryoSecretKey: envVars.MERCURYO_SECRET_KEY,
      mercuryoWidgetId: envVars.MERCURYO_WIDGET_ID,
      moonpaySecretKey: envVars.MOONPAY_SECRET_KEY,
      moonpayTestSecretKey: envVars.MOONPAY_TEST_SECRET_KEY,
      moonpayLiveKey: envVars.MOONPAY_LIVE_KEY,
      privateKey: envVars.PRIVATE_KEY,
      moonpayWebhookKey: envVars.MOONPAY_WEBHOOK_KEY,
      mercuryoSignKey: envVars.MERCURYO_SIGN_KEY,
      transakApiKey: envVars.TRANSAK_API_KEY,
      transakTestApiKey: envVars.TRANSAK_TEST_API_KEY,
      dataDogApiKey: envVars.DATA_DOG_API_KEY,
      dataDogAppName: envVars.DATA_DOG_APP_NAME,
};
