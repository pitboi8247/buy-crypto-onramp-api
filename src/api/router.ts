import express, { Router } from "express";
import {
      fetchProviderAvailability,
      fetchProviderAvailabilityGet,
} from "./controllers/fetchProviderAvailabilities";
import { fetchProviderLimits } from "./controllers/fetchProviderLimits";
import { fetchproviderQuotes } from "./controllers/fetchProviderQuotes";
import { fetchProviderSignature } from "./controllers/fetchProviderSignatures";
import { fetchMoonPayIntTransaction, fetchTransactionStatus } from "./controllers/transactionHandler";
import { generateMercuryoSig, generateMoonPaySig, generateTransakSig } from "./signatureFetchers";
import { fetchBtcAddressValidation } from "./controllers/fetchBtcAddressValidation";
import { MercuryoTestWebhook, MoonPayTestWebhook, TransakWebhook } from "./webhooks/webhooks";

const router: Router = express.Router();

//router routes
router.route("/generate-mercuryo-sig").post(generateMercuryoSig);
router.route("/generate-moonpay-sig").post(generateMoonPaySig);
router.route("/generate-transak-sig").post(generateTransakSig);
router.route("/fetch-provider-limits").get(fetchProviderLimits);
router.route("/fetch-provider-signature").get(fetchProviderSignature);
router.route("/fetch-provider-availability").post(fetchProviderAvailability);
router.route("/get-transactions").post(fetchTransactionStatus);
router.route("/get-moonpay-transaction").post(fetchMoonPayIntTransaction);
router.route("/validate-btc-address").get(fetchBtcAddressValidation);
router.route("/transak-webhook").post(TransakWebhook);
router.route("/moonpay-webhook").post(MoonPayTestWebhook);
router.route("/mercuryo-webhook").post(MercuryoTestWebhook);

router.route("/fetch-provider-quotes").post(fetchproviderQuotes);
router.route("/fetch-provider-availability-get").get(fetchProviderAvailabilityGet);

export default router;
