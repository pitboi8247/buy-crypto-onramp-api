import { Request, Response } from "express";
import {
      TxSummary,
      fetchMercuryoTransaction,
      fetchMoonPayTransaction,
      fetchTransakTransaction,
} from "../transactionFetcher";
import axios from "axios";
import config from "../../config/config";

export const fetchTransactionStatus = async (req: Request, res: Response) => {
      try {
            const { transaction } = req.body as { transaction: TxSummary };
            const provider = transaction?.provider;

            let transactionResult: { transaction: TxSummary } | undefined;
            switch (provider) {
                  case "MoonPay":
                        console.log("jeyyyy");
                        transactionResult = await fetchMoonPayTransaction(transaction);
                        break;
                  case "Mercuryo":
                        transactionResult = await fetchMercuryoTransaction(transaction);
                        break;
                  case "Transak":
                        transactionResult = await fetchTransakTransaction(transaction);
                        break;
                  default:
                        return res.status(404).json({ error: "Invalid provider" });
            }

            if (transactionResult === undefined) return res.status(404).json({});
            return res.json({ transaction: transactionResult.transaction });
      } catch (error) {
            console.error("Error processing transaction:", error);
            return res.status(500).json({ error: "Internal server error" });
      }
};

export async function fetchMoonPayIntTransaction(req: Request, res: Response) {
      const { transactionId } = req.body;
      try {
            const response = await axios.get(
                  `https://api.moonpay.com/v1/transactions/${transactionId}?apiKey=${
                        config.env === "development"
                              ? config.moonpayTestApiKeyKey
                              : config.moonpayProdApiKeyKey
                  }`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                        },
                  }
            );

            console.log(response.data.externalTransactionId);
            console.log(response.data[0]);

            const result = response.data;
            if (result.type === "NotFoundError") {
                  return res.status(404).json();
            }

            const { externalTransactionId } = result;
            return res.status(200).json({ transactionId: externalTransactionId });
      } catch (error) {
            return res.status(500).json();
      }
}
