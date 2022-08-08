import { BigNumber, Contract, ethers, providers } from "ethers";
import { weiToEther } from "../helpers/format";
import { NAIN_ABI } from '../constants/abi/NAIN_ABI';

class NainContract {
  provider: providers.Web3Provider;
  contract: Contract;

  constructor(
    provider: providers.Web3Provider,
    contractAddress: string,
    contractAbi?: any
  ) {
    this.provider = provider;
    this.contract = new ethers.Contract(
      contractAddress,
      contractAbi || NAIN_ABI,
      provider.getSigner()
    );
  }

  async getBalance(address: string): Promise<number> {
    const value = await this.contract.balanceOf(address);

    return weiToEther(value);
  }

  async allowance(
    ownerAddress: string,
    targetAddress: string
  ): Promise<BigNumber> {
    return await this.contract.allowance(ownerAddress, targetAddress);
  }

  async approve(targetAddress: string, value: BigNumber): Promise<void> {
    const signer = this.provider.getSigner();
    const tx = await this.contract
      .connect(signer)
      .approve(targetAddress, value);
    await tx.wait();
  }
}

export default NainContract;
