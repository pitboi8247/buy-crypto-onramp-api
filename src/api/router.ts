import express, { type Router } from "express";
import { fetchProviderAvailability } from "./controllers/fetchProviderAvailabilities";
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

export default router;
