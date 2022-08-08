import {
  getExpiredDay,
  priceClaim,
  checkNullValueInObject,
  getCurrentPrice,
  getCurrentPriceToken,
} from "@helpers/handler";

export const calculateIncrease = (value: any, percent: number) => {
  let result;
  result = Number(value) + Number(value) * (percent / 100);
  return result;
};

export const calculateDecrease = (value: any, percent: number) => {
  let result;
  result = Number(value) - Number(value) * (percent / 100);
  return result;
};

export const calculatePercentRoi = (old_value: any, new_value: any) => {
  // ((new roi - old roi) / old roi) * 100
  let result;
  result = ((new_value - old_value) / old_value) * 100;
  return result;
};

export const calculateRoi = (cover_value: any, cover_payout: any) => {
  let roi;
  if (cover_value) {
    roi = 100 + ((cover_payout - cover_value) * 100) / cover_value;
  } else {
    roi = 0;
  }
  return roi;
};

// percent = (escrow * priceETH * 100) / (amount * current price asset)
export const calculateValuePercentage = (
  amount: number,
  cover_value: number,
  currentPrice: number,
  symbol: string
) => {
  let result;
  result = Number(
    ((cover_value * getCurrentPriceToken(currentPrice, "ETHUSDT")) /
      (amount * getCurrentPriceToken(currentPrice, symbol))) *
      100
  ).toFixed(6);
  return result;
};

export const calculateValueEscrow = (
  amount: number,
  percent: number,
  currentPrice: number,
  symbol: string
) => {
  let result;
  result = Number(
    (amount * percent * getCurrentPriceToken(currentPrice, symbol)) /
      (100 * getCurrentPriceToken(currentPrice, "ETHUSDT"))
    // * getCurrentPriceToken(currentPrice, "ETHUSDT"): / currentPriceETH because ETH is cover unit
  ).toFixed(6);
  return Number(result);
};
