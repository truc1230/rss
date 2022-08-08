import { BigNumber, ethers, providers } from 'ethers';
import { INSURANCE_ABI } from '../utils/constants/abi/INSURANCE_ABI';
import InsuranceContract from './Insurance';
import { contractAddress } from '../utils/constants/contractAddress';
import { weiToEther } from '../utils/helpers/format';

export class ContractCaller {
    provider: providers.Web3Provider;
    insuranceContract: InsuranceContract;

    constructor(provider: providers.Web3Provider) {
        this.provider = provider;
        this.insuranceContract = new InsuranceContract(
            this.provider,
            contractAddress,
            INSURANCE_ABI
        );
    }

    public async getEtherBalance(from: string) {
        const balance: BigNumber = await this.provider.getBalance(from);
        return weiToEther(balance.toString());
    }

    public async sign(message: string | ethers.utils.Bytes) {
        const signer = this.provider.getSigner();
        const signature = await signer.signMessage(message);
        return signature;
    }
}
