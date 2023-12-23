import express, { Router } from "express";
import { fetchproviderQuotes } from "./controllers/fetchProviderQuotes";
import {
      generateMercuryoSig,
      generateMoonPaySig,
      generateTransakSig,
} from "./controllers/fetchProviderSignatures";
import { fetchIpDetails, fetchTransakAvailability } from "./ipFetchers";
import {
      fetchProviderAvailability,
      fetchProviderAvailabilityGet,
} from "./controllers/fetchProviderAvailabilities";

const router: Router = express.Router();

//router routes
router.route("/generate-mercuryo-sig").post(generateMercuryoSig);
router.route("/generate-moonpay-sig").post(generateMoonPaySig);
router.route("/generate-transak-sig").post(generateTransakSig);

router.route("/fetch-transak-availability").get(fetchTransakAvailability);
router.route("/user-ip").get(fetchIpDetails);
router.route("/fetch-provider-quotes").post(fetchproviderQuotes);
router.route("/fetch-provider-availability-get").get(fetchProviderAvailabilityGet);
router.route("/fetch-provider-availability").post(fetchProviderAvailability);

export default router;
