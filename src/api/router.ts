import express, { Router } from "express";
// import app from "@app";
import { fetchBscAvailability, fetchBscQuote, generateBinanceConnectSig, generateMercuryoSig, generateMoonPaySig } from './handlers/signatureHandlers';
import { fetchProviderQuotes } from "./handlers/proxyHandlers";
import { fetchBinanceConnectQuote } from "./quoterFetchers";


const router: Router = express.Router()

//router routes
router.route("/generate-mercuryo-sig").post(generateMercuryoSig).get(generateMercuryoSig)
router.route("/generate-moonpay-sig").post(generateMoonPaySig)
router.route("/generate-binance-connect-sig").post(generateBinanceConnectSig).get(generateBinanceConnectSig)
router.route("/fetch-bsc-quote").post(fetchBscQuote)
router.route("/fetch-bsc-availability").post(fetchBscAvailability)

router.route("/fetch-mercuryo-quote").post(fetchProviderQuotes)

export default router
