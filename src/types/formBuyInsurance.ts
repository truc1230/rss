
export type FormBuyInsuranceTypeNew = {
  id: number;
  name: string;
  label: string;
  max: number;
  min: number;
  isDay: boolean;
  options?: Array<ObjectType>;
};

export type ObjectType = {
  label: string;
  value: any;
};
