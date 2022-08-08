import { BigNumber, ethers } from "ethers";

export const etherToWei = (amount: number | string) =>
  ethers.utils.parseEther(amount.toString());

export const weiToEther = (wei: string | BigNumber) =>
  parseFloat(ethers.utils.formatEther(wei));

export const formatDateToTimestamp = (_date: Date) => {
  let newDate = new Date(_date);
  return newDate.getTime() / 1000;
};

export const formatDate = (_date: number) => {
  let date = new Date(_date * 1000);
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();
  let newDd;
  let newMm;
  let newDate;
  if (dd < 10) {
    newDd = "0" + dd;
  } else {
    newDd = dd;
  }
  if (mm < 10) {
    newMm = "0" + mm;
  } else {
    newMm = mm;
  }
  newDate = newDd + "." + newMm + "." + yyyy;
  return newDate;
};

export const formatTimestampToDate = (_date: number) => {
  let date = _date * 1000;
  let newDate = new Date(date).toLocaleDateString();
  return newDate;
};

export const formatPriceToWeiValue = (_num: number) => {
  return BigInt(_num * 10 ** 18);
};

export const formatWeiValueToPrice = (_num: number) => {
  return Number(_num) / 10 ** 18;
};

export const parseNumber = (_number: any) => {
  return parseInt(_number);
};
