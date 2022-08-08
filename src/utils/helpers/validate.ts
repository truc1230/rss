import { calculateDecrease, calculateIncrease } from "@helpers/calculate";
import {
  getExpiredDay,
  priceClaim,
  checkNullValueInObject,
  getCurrentPrice,
  getCurrentPriceToken,
} from "@helpers/handler";

export const validateAmount = () => {
  return `Amount not empty`;
};

export const validateCoverPrice = (
  _cover_price: number,
  _currentPrice: number,
  _symbol: string
) => {
  let cover_price: string | null;
  if (
    _cover_price >
      calculateDecrease(getCurrentPriceToken(_currentPrice, _symbol), 5) &&
    _cover_price <
      calculateIncrease(getCurrentPriceToken(_currentPrice, _symbol), 5)
  ) {
    cover_price = `Cover price invalid`;
  } else {
    cover_price = null;
  }
  return cover_price;
};
