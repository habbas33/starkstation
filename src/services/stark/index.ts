import { Account, ec, Provider, number, uint256 } from 'starknet'
import { FROM_ADDRESS_SN_MAINNET, TO_ADDRESS_SN_MAINNET, L2_FEE_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS_SN } from '../../constants/globals';

const provider = new Provider({sequencer: { network: 'mainnet-alpha' } })
const SN_PVT_KEY = import.meta.env.VITE_SN_PVT_KEY;

const useStarkNetAccount = () =>{
    const starkKeyPair = ec.getKeyPair(SN_PVT_KEY);
    const account = new Account(
        provider,
        FROM_ADDRESS_SN_MAINNET,
        starkKeyPair
    );
    return account
}

const convertBnWeiToNumberEth =  (value:any) =>{
    const result = number.hexToDecimalString(number.toHex(value))
    return Number(result)/10**18
}

// estimate eth transfer fee in L2
const estimateEthTransferFee = async (account:any) =>{
    const res = await account.estimateFee(
        {
            contractAddress: L2_FEE_CONTRACT_ADDRESS,
            entrypoint: "transfer",
            calldata: [
                TO_ADDRESS_SN_MAINNET,
                "10000000000",
                "0"
              ]
        });
    return convertBnWeiToNumberEth(res.overall_fee)
}

// estimate USDC transfer fee in L2
const EstimateUsdcTransferFee = async(account:any) => {
    const amount = uint256.bnToUint256("100")
    const res = await account.estimateFee(
        {
            contractAddress: USDC_CONTRACT_ADDRESS_SN,
            entrypoint: "transfer",
            calldata: [TO_ADDRESS_SN_MAINNET, amount.low, amount.high],
        },
        undefined,
        { 
            maxFee: "99999999999999" 
        });

    return convertBnWeiToNumberEth(res.overall_fee)
}

const collectFeeEstimate = async(account:any) =>{
    try {
        const [ ethTransferFee, erc20TransferFee ] = await Promise.all([
            await estimateEthTransferFee(account),
            await EstimateUsdcTransferFee(account)
        ])
        const result = { ethTransferFee:ethTransferFee.toFixed(9), erc20TransferFee:erc20TransferFee.toFixed(9) }
        return result
    } catch (error) {
        console.log(error,'Fee estimate calls failed')
        const result = { ethTransferFee:'0', erc20TransferFee:'0' }
        return result
    }
}

export const getEthTransferFee = async () => {
    const account = useStarkNetAccount();
    const feeEstimate = await collectFeeEstimate(account);
    return feeEstimate;
};