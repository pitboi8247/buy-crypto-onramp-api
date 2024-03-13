import BigNumber from "bignumber.js";
import { Fraction } from "@pancakeswap/swap-sdk-core";
import type { Address } from "viem";
import { ChainId } from "@pancakeswap/sdk";

export function parseNumberToFraction(num: number, precision = 6) {
      if (Number.isNaN(num) || !Number.isFinite(num)) {
            return undefined;
      }
      const scalar = 10 ** precision;
      return new Fraction(BigInt(Math.floor(num * scalar)), BigInt(scalar));
}

export const averageArray = (dataToCalculate: number[]): number => {
      let data = [...dataToCalculate];
      // Remove the highest and lowest volume to be more accurate
      if (data.length > 3) {
            data = data.sort((a: number, b: number) => a - b).slice(1, data.length - 1);
      }

      return data.reduce((result, val) => result + val, 0) / data.length;
};

export const getFullDecimalMultiplier = (decimals: number): BigNumber => {
      return new BigNumber(10).pow(decimals);
};

export const getBalanceAmount = (amount: BigNumber, decimals: number | undefined = 18) => {
      return new BigNumber(amount).dividedBy(getFullDecimalMultiplier(decimals));
};

export const removePrefix = (arr: string[]): Address[] => {
      return arr.map((item) => item.split(":").pop() as Address);
};

export const fixPrefix = (arr: string[]): string[] => {
      const fixedArr = arr.map((item) => {
            const parts = item.split(":");
            if (parts.length === 3 && parts[0] === "eip155" && parts[1]) {
                  return `eip155:1:${parts[2]}`;
            }
            return item; // If the format is not as expected, return the original item
      });
      return fixedArr;
};

export const addPrefix = (arr): string[] => {
      const fixedArr = arr.map((item) => `eip155:1:${item}`);
      return fixedArr;
};

export const arrayToString = (arr: string[]) => {
      return arr.join(", ");
};

export const capitalizeFirstLetter = (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1);
};

export const calculatePercentageIncrease = (oldValue: number, newValue: number): number => {
      if (oldValue === 0) return 1;
      return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
};

export const nativeToId = (chainId: ChainId) => {
      if (chainId === ChainId.OPBNB || chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET) {
            return "binancecoin";
      }
      return "ethereum";
};

export const idToNative = (tokenId: string) => {
      if (tokenId === "binancecoin") {
            return ChainId.BSC;
      }
      return "ethereum";
};
