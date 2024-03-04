export const delay = async (delayTime: number) =>
      await new Promise((resolve) => setTimeout(resolve, delayTime));

export const formatDate = (timestamp: number | string) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
};

export const convertQuoteToBase = (usdAmount: number, etherPrice: number): number => {
      const ethAmount = usdAmount / etherPrice;
      return ethAmount;
};
