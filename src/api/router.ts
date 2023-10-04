import express, { Router } from 'express';
// import app from "@app";
import {
  fetchMercuryoIpAvailability,
  fetchMoonPayIpAvailability,
  fetchProviderAvailability,
  fetchproviderQuotes
} from './handlers/proxyHandlers';
import {
  generateMercuryoSig,
  generateMoonPaySig,
  generateTransakSig,
} from './handlers/signatureHandlers';
import { fetchIpDetails } from './ipFetchers';
import { MercuryoTestWebhook, MoonPayTestWebhook } from './webhookCallbacks/webhookCallbacks';

const router: Router = express.Router();

//router routes
router.route('/generate-mercuryo-sig').post(generateMercuryoSig).get(generateMercuryoSig);
router.route('/generate-moonpay-sig').post(generateMoonPaySig);
router.route('/generate-transak-sig').post(generateTransakSig)

router.route('/fetch-moonpay-availability').get(fetchMoonPayIpAvailability);
router.route('/fetch-mercuryo-availability').get(fetchMercuryoIpAvailability);
router.route('/user-ip').get(fetchIpDetails);
router.route('/fetch-provider-quotes').post(fetchproviderQuotes);
router.route('/fetch-provider-availability').post(fetchProviderAvailability);

//webhooks
router.route('/webhook').post(MoonPayTestWebhook)
router.route('/webhook-mercuryo').post(MercuryoTestWebhook)


export default router;