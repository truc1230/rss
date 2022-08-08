import { BigNumber, ethers, providers } from "ethers";
import { NAIN_ABI } from "@constants/abi/NAIN_ABI";

let private_key: string =
  "99e76b5b5d71772fbacf7ffe87288a3057e75c2c1de84d68fb63f471d32e1623";
let send_token_amount = "1";
let to_address = "0xFc704cB253A586A6539f29705ecC5FAeEa3e2FB3";
let send_account = "0x94516F310cB119BD79E24eA969b8374025cA9D48";
let gas_limit = "0x100000";
let wallet = new ethers.Wallet(private_key);
let ethersProvider = new ethers.providers.InfuraProvider("ropsten");
let walletSigner = wallet.connect(ethersProvider);
let contract_address = "0xFced2B7B391074805b67af672A2a0321623b8A1E";
let gas_price = ethersProvider.getGasPrice();

export const send_token = (send_token_amount: number | bigint) => {
  let wallet = new ethers.Wallet(private_key);
  let walletSigner = wallet.connect(ethersProvider);

  ethersProvider.getGasPrice().then((currentGasPrice: any) => {
    let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice));

    if (contract_address) {
      // general token send
      let contract = new ethers.Contract(
        contract_address,
        NAIN_ABI,
        walletSigner
      );

      // How many tokens?
      let numberOfTokens = ethers.utils.parseUnits(
        send_token_amount.toString(),
        18
      );

      // Send tokens
      contract
        .transfer(to_address, numberOfTokens)
        .then((transferResult: any) => {});
    } // ether send
    else {
      const tx = {
        from: send_account,
        to: to_address,
        value: ethers.utils.parseEther(send_token_amount.toString()),
        nonce: ethersProvider.getTransactionCount(send_account, "latest"),
        gasLimit: ethers.utils.hexlify(gas_limit), // 100000
        gasPrice: gas_price,
      };
      console.dir(tx);
      try {
        walletSigner.sendTransaction(tx).then((transaction) => {
          console.dir(transaction);
        });
      } catch (error) {}
    }
  });
  return true;
};
