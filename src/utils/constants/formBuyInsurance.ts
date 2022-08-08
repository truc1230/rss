import { FormBuyInsuranceTypeNew } from "src/types/formBuyInsurance";
export const formBuyInsuranceNew: Array<FormBuyInsuranceTypeNew> = [
  {
    id: 0,
    name: "asset",
    label: "ETH",
    max: 100,
    min: 0.00001,
    isDay: false,
    options: [
      {
        label: "ETH",
        value: "eth",
      },
    ],
  },
  {
    id: 1,
    name: "amount",
    label: "",
    max: 100000,
    min: 0.0001,
    isDay: false,
  },
  {
    id: 2,
    name: "percent",
    label: "",
    max: 100,
    min: 0.1,
    isDay: false,
  },
  {
    id: 3,
    name: "cover_value",
    label: "ETH",
    max: 100000,
    min: 0.0001,
    isDay: false,
  },
  {
    id: 4,
    name: "p_claim",
    label: "USDT",
    max: 100000,
    min: 0.00001,
    isDay: false,
  },
  {
    id: 5,
    name: "cover_period",
    label: "Days",
    max: 365,
    min: 7,
    isDay: true,
  },
];
