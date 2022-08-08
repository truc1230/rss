export type LogIntype = {
  walletAddress: string;
  signature: string | undefined;
};

export type BuyInsuranceType = {
  owner: string;
  current_price: number;
  liquidation_price: number | bigint;
  deposit: number;
  expired: number;
  id_transaction: string;
  asset: string;
  amount: number;
  id_sc: number;
  hedge: number;
};

export type PriceClaim = {
  current_price: number | bigint;
  liquidation_price: number | bigint;
  deposit: number | bigint;
  hedge: number;
};

export type InsuranceType = {
  _id: string;
  owner: string;
  current_price: number;
  liquidation_price: number;
  deposit: number;
  expired: number;
  state: string;
  createdAt: string;
  updatedAt: string;
};

export type InsuranceProvider = {
  insurance: Array<InsuranceType> | undefined;
};

export type GetOrderFuture = {
  symbol: string;
  pageSize: number;
  page: number;
};
