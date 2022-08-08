import swal from "sweetalert";
import { calculateRoi } from "./calculate";

export const popupNotEnoughBalance = () => {
  swal({
    title: "Insufficient balance!",
    text: "Do you want to redirect to Uniswap?",
    icon: "warning",
    buttons: ["Cancle", true],
    dangerMode: true,
  }).then((value) => {
    if (value) {
      window.location.href = "https://app.uniswap.org/";
    }
  });
};

export const popupBuySuccess = (
  isPaymentWithNain: boolean,
  cover_value: number,
  new_cover_payout: number,
  old_cover_payout: number,
  currency: string
) => {
  swal({
    title: "Successfully Purchased!",
    text: `
      Cover Payout: ${
        isPaymentWithNain
          ? Number(new_cover_payout.toFixed(6))
          : Number(old_cover_payout.toFixed(6))
      } ${isPaymentWithNain ? "NAIN" : currency}
        Percentage Of Payout: ${
          isPaymentWithNain
            ? Number(calculateRoi(cover_value, new_cover_payout).toFixed(3))
            : Number(calculateRoi(cover_value, old_cover_payout).toFixed(3))
        }%`,
    icon: "success",
    buttons: ["Cancle", true],
  });
};
