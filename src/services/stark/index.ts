import { Account, ec, Provider, number, uint256 } from 'starknet'
import { FROM_ADDRESS_SN_MAINNET, FROM_ADDRESS_SN_TESTNET, TO_ADDRESS_SN_MAINNET, TO_ADDRESS_SN_TESTNET, L2_FEE_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS_SN, USDC_CONTRACT_ADDRESS_SN_TESTNET } from '../../constants/globals';

const provider = new Provider({sequencer: { network: 'mainnet-alpha' } })
const tn_provider = new Provider({sequencer: { network: 'goerli-alpha' } })
const SN_PVT_KEY = import.meta.env.VITE_SN_PVT_KEY;
const SN_PVT_KEY_TN = import.meta.env.VITE_SN_PVT_KEY_TN;

const useStarkNetAccount = (_provider:any, _pvtKey:string, _from:string) =>{
    const starkKeyPair = ec.getKeyPair(_pvtKey);
    const account = new Account(
        _provider,
        _from,
        starkKeyPair
    );
    return account
}

const convertBnWeiToNumberEth =  (value:any) =>{
    const result = number.hexToDecimalString(number.toHex(value))
    return Number(result)/10**18
}

// estimate eth transfer fee in L2
const estimateEthTransferFee = async (account:any, _to:string) =>{
    const res = await account.estimateFee(
        {
            contractAddress: L2_FEE_CONTRACT_ADDRESS,
            entrypoint: "transfer",
            calldata: [
                _to,
                "10000000000",
                "0"
              ]
        });
    return convertBnWeiToNumberEth(res.overall_fee)
}

// estimate USDC transfer fee in L2
const EstimateUsdcTransferFee = async(account:any, _usdcAddress:string, _to:string) => {
    const amount = uint256.bnToUint256("100")
    const res = await account.estimateFee(
        {
            contractAddress: _usdcAddress,
            entrypoint: "transfer",
            calldata: [_to, amount.low, amount.high],
        },
        undefined,
        { 
            maxFee: "99999999999999" 
        });

    return convertBnWeiToNumberEth(res.overall_fee)
}

const collectFeeEstimate = async(account:any, _to:string, _usdcAddress:string) =>{
    try {
        const [ ethTransferFee, erc20TransferFee ] = await Promise.all([
            await estimateEthTransferFee(account, _to),
            await EstimateUsdcTransferFee(account, _usdcAddress, _to)
        ])
        const result = { ethTransferFee:ethTransferFee.toFixed(9), erc20TransferFee:erc20TransferFee.toFixed(9) }
        return result
    } catch (error) {
        console.log(error,'Fee estimate calls failed')
        const result = { ethTransferFee:'0', erc20TransferFee:'0' }
        return result
    }
}

export const getEthTransferFee = async (network:string) => {
    let _provider
    let _pvtKey
    let _usdcAddress
    let _from
    let _to
    if (network === 'goerli'){
        _provider = tn_provider
        _pvtKey = SN_PVT_KEY_TN
        _from = FROM_ADDRESS_SN_TESTNET
        _to = TO_ADDRESS_SN_TESTNET
        _usdcAddress = USDC_CONTRACT_ADDRESS_SN_TESTNET
    } else {
        _provider = provider
        _pvtKey = SN_PVT_KEY
        _from = FROM_ADDRESS_SN_MAINNET
        _to = TO_ADDRESS_SN_MAINNET
        _usdcAddress = USDC_CONTRACT_ADDRESS_SN
    }
    const account = useStarkNetAccount(_provider, _pvtKey, _from);
    const feeEstimate = await collectFeeEstimate(account, _to, _usdcAddress);
    return feeEstimate;
};