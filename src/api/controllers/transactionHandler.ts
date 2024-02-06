import { Request, Response } from "express";
import {
      TxSummary,
      fetchMercuryoTransaction,
      fetchMoonPayTransaction,
      fetchTransakTransaction,
} from "../transactionFetcher";

export const fetchTransactionStatus = async (req: Request, res: Response) => {
      try {
            const { transaction } = req.body as { transaction: TxSummary };
            const provider = transaction.buyCryptoDetails?.provider;

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
