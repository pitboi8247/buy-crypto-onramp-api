import axios from "axios";
import config from "../config/config";
import { TransactionStatus, type TxSummary } from "./types";
import { delay, formatDate } from "../utils/utils";

export async function fetchMoonPayTransaction(
      transaction: TxSummary
): Promise<{ transaction: TxSummary }> {
      try {
            const response = await axios.get(
                  `https://api.moonpay.com/v1/transactions/ext/${transaction.id}?apiKey=${
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

            console.log(response.data);
            const result = response.data;
            if (result.type === "NotFoundError" || !Array.isArray(result)) {
                  return undefined;
            }

            const transactionData = result[0];
            const { status, externalTransactionId, createdAt } = transactionData;
            let overrideStatus = status;

            if (!status || !externalTransactionId || !createdAt) return undefined;
            if (status === "pending" || status === "waitingAuthorization") {
                  overrideStatus = TransactionStatus.Pending;
            } else if (status === "failed") {
                  overrideStatus = TransactionStatus.Failed;
            } else if (status === "completed") {
                  await delay(5000);
                  overrideStatus = TransactionStatus.Success;
            } else {
                  return { transaction };
            }

            return {
                  transaction: {
                        ...transaction,
                        id: externalTransactionId,
                        status: overrideStatus,
                        synced: true,
                  },
            };
      } catch (error) {
            return undefined;
      }
}

export async function fetchMercuryoTransaction(
      transaction: TxSummary
): Promise<{ transaction: TxSummary }> {
      try {
            const response = await axios.get(
                  `https://sandbox-api.mrcr.io/v1.6/sdk-partner/transactions?widget_id=2b04049d-ac93-4ee3-8bc8-48329e13dfc7&merchant_transaction_id=${transaction.id}`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                              "Sdk-Partner-Token":
                                    "110:0b75fc38774fe8668XZ3myVB7azBBf4Br5Z9ljAYhPfJoDD4bd0A1zFs9RbSWvYx",
                        },
                  }
            );

            const result = response.data;
            if (result.status !== 200 || !Array.isArray(result?.data)) {
                  return undefined;
            }

            const transactionData = result.data[0].buy;
            const { status, merchant_transaction_id, created_at } = transactionData;
            let overrideStatus = status;

            if (!status || !merchant_transaction_id || !created_at) return undefined;
            if (status === "order_scheduled") {
                  overrideStatus = TransactionStatus.Pending;
            } else if (status === "failed") {
                  overrideStatus = TransactionStatus.Failed;
            } else if (status === "paid") {
                  await delay(5000);
                  overrideStatus = TransactionStatus.Success;
            } else {
                  return { transaction };
            }

            return {
                  transaction: {
                        ...transaction,
                        id: merchant_transaction_id,
                        status: overrideStatus,
                        synced: true,
                  },
            };
      } catch (error) {
            return undefined;
      }
}

export async function fetchTransakTransaction(
      transaction: TxSummary
): Promise<{ transaction: TxSummary }> {
      //   console.log(transaction);
      try {
            const response = await axios.get(
                  `https://api-stg.transak.com/partners/api/v2/orders?limit=1&startDate=${formatDate(
                        transaction?.addedTime
                  )}&endDate=${formatDate(
                        transaction?.addedTime
                  )}&filter[productsAvailed]=%5B%22BUY%22%5D&filter[sortOrder]=desc`,
                  {
                        headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                              "access-token":
                                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBUElfS0VZIjoiZjJiODVjZjItMmVhNS00Y2E3LWFhZWQtOTZjODczMDY2NDU4IiwiaWF0IjoxNzA3NTc5NDQ0LCJleHAiOjE3MDgxODQyNDR9.APvBab9XuchAJgULGAWaWLLamIDnssFl1I5UUQUWs2Y",
                        },
                  }
            );

            const result = response.data;
            if (response.status !== 200 || !Array.isArray(result?.data)) {
                  return undefined;
            }

            console.log("heyyy");
            console.log(result.data);
            const transactionData = result.data[0];
            const { status, partnerOrderId, createdAt } = transactionData;
            let overrideStatus = status;

            console.log(status, partnerOrderId, createdAt);
            if (!status || !partnerOrderId || !createdAt) return undefined;
            if (partnerOrderId !== transaction.id) return undefined;
            if (
                  status === "AWAITING_PAYMENT_FROM_USER" ||
                  status === "PROCESSING" ||
                  status === "PENDING_DELIVERY_FROM_TRANSAK" ||
                  status === "ORDER_PROCESSING" ||
                  status === "ORDER_CREATED"
            ) {
                  overrideStatus = "pending";
            } else if (status === "FAILED") {
                  overrideStatus = TransactionStatus.Failed;
            } else if (status === "COMPLETED") {
                  await delay(5000);
                  overrideStatus = TransactionStatus.Success;
            } else {
                  return { transaction };
            }

            return {
                  transaction: {
                        ...transaction,
                        id: partnerOrderId,
                        status: overrideStatus,
                        synced: true,
                  },
            };
      } catch (error) {
            console.log(error);
            return undefined;
      }
}
