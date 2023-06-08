import express, { Router } from 'express';
import cors from 'cors';
import { config as _c } from 'dotenv';
import httpLogger from './utils/httpLogger';
import { fetchBscAvailability, fetchBscQuote, generateBinanceConnectSig, generateMercuryoSig, generateMoonPaySig } from './api';
import errorHandling from './middleware/errorHandlingMiddleware';
import httpContext from 'express-http-context';


const app = express();
const router: Router = express.Router()

//router routes
router.route("/generate-mercuryo-sig").post(generateMercuryoSig)
router.route("/generate-moonpay-sig").post(generateMoonPaySig)
router.route("/generate-binance-connect-sig").post(generateBinanceConnectSig)
router.route("/fetch-bsc-quote").post(fetchBscQuote)
router.route("/fetch-bsc-availability").post(fetchBscAvailability)

app.use(express.json());

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.status(200).send({ result: 'ok' });
});
app.use('/', router)
app.use(httpContext.middleware);
app.use(httpLogger.successHandler);
app.use(httpLogger.errorHandler);

app.use(errorHandling);





export default app