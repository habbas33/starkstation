import {useEffect, useState} from 'react'
import { Account, ec, Provider, number, uint256 } from 'starknet'
import {ethers, BigNumber} from 'ethers'
import { FROM_ADDRESS_SN_MAINNET, FROM_ADDRESS_SN_TESTNET, TO_ADDRESS_SN_MAINNET, TO_ADDRESS_SN_TESTNET, L2_FEE_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS_SN, MYSWAP_CONTRACT_ADDRESS, MYSWAP_CONTRACT_ADDRESS_TESTNET, MINTSQUARE_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS_SN_TESTNET, MINTSQUARE_CONTRACT_ADDRESS_TESTNET, STARKGATE_BRIDGE_CONTRACT_ADDRESS, FROM_ADDRESS_ETH_MAINNET, TO_ADDRESS_ETH_MAINNET, STARKGATE_CONTRACT_ADDRESS } from '../../constants/globals';

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
const estimateUsdcTransferFee = async(account:any, _usdcAddress:string, _to:string) => {
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

// estimate NFT mint fee in L2 (MintSquare)
const estimateMintNftFee = async(account:any,  _mintSquareAddress:string) => {
    try {
        const res = await account.estimateFee(
            {
                contractAddress: _mintSquareAddress,
                entrypoint: "mint",
                calldata: [
                    "0x697066733a2f2f516d554276477365474366676a4548763163707038583159",
                    "0x5769574b6b337334314c5645676b5070645146573646",
                    "0x"
                ],
            },
            undefined,
            { 
                maxFee: "99999999999999" 
            });
        return convertBnWeiToNumberEth(res.overall_fee)
    } catch (error) {
        console.log(error)
        return 0
    }
}

// estimate swap fee in L2 (MySwap)
const estimateSwapFee = async(account:any, _mySwapAddress:string) => {
    const amount = uint256.bnToUint256("166017635600")
    const amount_min = uint256.bnToUint256("1")
    try {
        const res = await account.estimateFee(
            [{
                contractAddress: L2_FEE_CONTRACT_ADDRESS,
                entrypoint: "approve",
                calldata: [
                    _mySwapAddress,
                    amount.low, amount.high
                ],
            },{
                contractAddress: _mySwapAddress.toLowerCase(),
                entrypoint: "swap",
                calldata: ["1",L2_FEE_CONTRACT_ADDRESS.toLowerCase(), amount.low, amount.high, amount_min.low, amount_min.high],
            }],
            undefined,
            { 
                maxFee: "99999999999999" 
            });
        return convertBnWeiToNumberEth(res.overall_fee)
    } catch (error) {
        console.log(error)
        return 0
    }
}

// estimate Initiate Withdraw fee in L2 (Starkgate ETH Bridge)
const estimateInitiateWithdrawFee = async(account:any) => {
    try {
        const res = await account.estimateFee(
            {
                contractAddress: STARKGATE_BRIDGE_CONTRACT_ADDRESS,
                entrypoint: "initiate_withdraw",
                calldata: [
                    TO_ADDRESS_ETH_MAINNET,
                    "10000000000",
                    "0"
                ],
            },
            undefined,
            { 
                maxFee: "99999999999999" 
            });
        return convertBnWeiToNumberEth(res.overall_fee)
    } catch (error) {
        console.log(error)
        return 0
    }
}

const collectFeeEstimate = async(account:any, _to:string, _usdcAddress:string, _mintSquareAddress:string, _mySwapAddress:string) =>{
    try {
        const [ ethTransferFee, erc20TransferFee, nftMintFee, swapFee ] = await Promise.all([
            await estimateEthTransferFee(account, _to),
            await estimateUsdcTransferFee(account, _usdcAddress, _to),
            await estimateMintNftFee(account, _mintSquareAddress),
            await estimateSwapFee(account, _mySwapAddress)
        ])
        const result = { ethTransferFee:ethTransferFee.toFixed(9), erc20TransferFee:erc20TransferFee.toFixed(9), nftMintFee:nftMintFee.toFixed(9), swapFee:swapFee.toFixed(9) }
        return result
    } catch (error) {
        console.log(error,'Fee estimate calls failed')
        const result = { ethTransferFee:'0', erc20TransferFee:'0', nftMintFee:'0', swapFee:'0' }
        return result
    }
}

const collectBridgeFeeEstimate = async(account:any) =>{
    try {
        const [ initiateWithdrawFee ] = await Promise.all([
            await estimateInitiateWithdrawFee(account)
        ])
        const result = { initiateWithdrawFee:initiateWithdrawFee.toFixed(9) }
        return result
    } catch (error) {
        console.log(error,'Fee estimate calls failed')
        const result = { initiateWithdrawFee:'0' }
        return result
    }
}

export const getEthTransferFee = async (network:string) => {
    let _provider
    let _pvtKey
    let _usdcAddress
    let _mintSquareAddress
    let _mySwapAddress
    let _from
    let _to
    if (network === 'goerli'){
        _provider = tn_provider
        _pvtKey = SN_PVT_KEY_TN
        _from = FROM_ADDRESS_SN_TESTNET
        _to = TO_ADDRESS_SN_TESTNET
        _usdcAddress = USDC_CONTRACT_ADDRESS_SN_TESTNET
        _mintSquareAddress = MINTSQUARE_CONTRACT_ADDRESS_TESTNET
        _mySwapAddress = MYSWAP_CONTRACT_ADDRESS_TESTNET
    } else {
        _provider = provider
        _pvtKey = SN_PVT_KEY
        _from = FROM_ADDRESS_SN_MAINNET
        _to = TO_ADDRESS_SN_MAINNET
        _usdcAddress = USDC_CONTRACT_ADDRESS_SN
        _mintSquareAddress = MINTSQUARE_CONTRACT_ADDRESS
        _mySwapAddress = MYSWAP_CONTRACT_ADDRESS
    }
    const account = useStarkNetAccount(_provider, _pvtKey, _from);
    const feeEstimate = await collectFeeEstimate(account, _to, _usdcAddress, _mintSquareAddress, _mySwapAddress);
    return feeEstimate;
};

export const getBridgeFee = async (network:string) => {
    let _provider
    let _pvtKey
    let _from
    if (network === 'goerli'){
        _provider = tn_provider
        _pvtKey = SN_PVT_KEY_TN
        _from = FROM_ADDRESS_SN_TESTNET
    } else {
        _provider = provider
        _pvtKey = SN_PVT_KEY
        _from = FROM_ADDRESS_SN_MAINNET
    }
    const account = useStarkNetAccount(_provider, _pvtKey, _from);
    const feeEstimate = await collectBridgeFeeEstimate(account);
    return feeEstimate;
};