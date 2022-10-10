import { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import {ethers} from 'ethers';
import { SpinnerCircular } from "spinners-react";
import { getEthTransferFee } from "../../services/stark";
import FeeChart from './FeeChart';
import { PriceContext } from '../../context/PriceContext';

interface IData {
    time: string;
    value: number;
    price: number;
}

interface IChartData {
    time: string;
    sn_value?: number;
    eth_value: number;
    percent_change?: number;
}

export default function FeePanel(props: {
    snDetailLoading:boolean
    snDetailData:any
    snBlockLoading: boolean
    snBlockData:any
    ethDetailLoading:boolean
    ethDetailData:any
    timeFrame:string
    setTimeFrame:any
}) {
    const {snDetailLoading, snBlockLoading, ethDetailLoading, snDetailData, snBlockData, ethDetailData, timeFrame, setTimeFrame } = props;
    const { ethPrice } = useContext(PriceContext)
    const [chartLoading, setChartLoading] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<any>(0);
    const [feeEstimate, setFeeEstimate] = useState<{ ethTransferFee:string, erc20TransferFee:string }>({ ethTransferFee:'0.000233541', erc20TransferFee:'0.000233495' });
    const [chartDisplay, setChartDisplay] = useState<string>('usdcTransferFee');
    const [currency, setCurrency] = useState<string>('eth');
    const [chartData, setChartData] = useState<IChartData[]>([]);
    const [ethTransferData_SN, setEthTransferData_SN] = useState<IData[]>([]);
    const [usdcTransferData_SN, setUsdcTransferData_SN] = useState<IData[]>([]);
    const [avgTxnFee_SN, setAvgTxnFee_SN] = useState<IData[]>([]);
    const [avgGasUsed_SN, setAvgGasUsed_SN] = useState<IData[]>([]);
    const [ethTransferData_ETH, setEthTransferData_ETH] = useState<IData[]>([]);
    const [usdcTransferData_ETH, setUsdcTransferData_ETH] = useState<IData[]>([]);
    const [avgTxnFee_ETH, setAvgTxnFee_ETH] = useState<IData[]>([]);
    const [avgGasUsed_ETH, setAvgGasUsed_ETH] = useState<IData[]>([]);

    
    const snBlock = snBlockData?.detail[0];
    const isCurrencyEth: boolean = currency === 'eth'? true : false;
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(dayjs().diff(snBlockData?.lastUpdated, 'seconds'));
        }, 1000);

        const getFeeEstimate = async() =>{
            const x = await getEthTransferFee()
            setFeeEstimate(x);
        }
        getFeeEstimate();
        return () => clearInterval(interval);
    }, [snBlockData]);

    useEffect(() => {
        if(snDetailData){
            const _ethTransferData: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.ethTransferFee, price:item?.ethPrice}));
            const _usdcTransferData: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.erc20TransferFee, price:item?.ethPrice}));
            const _avgTxnFee: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:Number(ethers?.utils.formatEther(item.avgTxnFee)), price:item?.ethPrice}));
            const _avgGasUsed: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.gasUsedPerblock, price:item?.ethPrice}));
            setEthTransferData_SN(_ethTransferData);
            setUsdcTransferData_SN(_usdcTransferData);
            setAvgTxnFee_SN(_avgTxnFee);
            setAvgGasUsed_SN(_avgGasUsed);
        }
    }, [snDetailData]);

    useEffect(() => {
        if(ethDetailData){
            const _ethTransferData: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.ethTransferFee, price:item?.ethPrice}));
            const _usdcTransferData: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.erc20TransferFee, price:item?.ethPrice}));
            const _avgTxnFee: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:Number(ethers?.utils.formatEther(item.avgTxnFee)), price:item?.ethPrice}));
            const _avgGasUsed: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.gasUsedPerblock, price:item?.ethPrice}));
            setEthTransferData_ETH(_ethTransferData);
            setUsdcTransferData_ETH(_usdcTransferData);
            setAvgTxnFee_ETH(_avgTxnFee);
            setAvgGasUsed_ETH(_avgGasUsed);
        }
    }, [ethDetailData]);

    useEffect(() => {
        if(chartDisplay){
            setChartLoading(true);
            switch(chartDisplay) {
                case "ethTransferFee":
                    let _ethTransferData: IChartData[] = []
                    ethTransferData_ETH.forEach((v,i) => {
                        // let snValue = ethTransferData_SN.find((val) => val.time === v.time)
                        let snValue = ethTransferData_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        _ethTransferData[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
                        if (snValue){
                            const sn_value = isCurrencyEth?snValue?.value:snValue?.value*snValue?.price;
                            _ethTransferData[i].sn_value = sn_value;
                            _ethTransferData[i].percent_change = sn_value/_ethTransferData[i].eth_value;
                        }
                    });
                    setChartData(_ethTransferData.reverse());
                    break;
                case "usdcTransferFee":
                    let _usdcTransferData: IChartData[] = []
                    usdcTransferData_ETH.forEach((v,i) => {
                        // let snValue = usdcTransferData_SN.find((val) => val.time === v.time)
                        let snValue = usdcTransferData_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        _usdcTransferData[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
                        if (snValue){
                            const sn_value = isCurrencyEth?snValue?.value:snValue?.value*snValue?.price;
                            _usdcTransferData[i].sn_value = sn_value;
                            _usdcTransferData[i].percent_change = sn_value/_usdcTransferData[i].eth_value;
                        }
                    });
                    setChartData(_usdcTransferData.reverse());
                    break;
                case "avgTxnFee":
                    let _avgTxnFee: IChartData[] = []
                    avgTxnFee_ETH.forEach((v,i) => {
                        // let snValue = avgTxnFee_SN.find((val) => val.time === v.time)
                        let snValue = avgTxnFee_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        _avgTxnFee[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
                        if (snValue){
                            const sn_value = isCurrencyEth?snValue?.value:snValue?.value*snValue?.price;
                            _avgTxnFee[i].sn_value = sn_value;
                            _avgTxnFee[i].percent_change = sn_value/_avgTxnFee[i].eth_value;
                        }
                    });
                    setChartData(_avgTxnFee.reverse());
                    break;
                case "avgGasUsed":
                    let _avgGasUsed: IChartData[] = []
                    avgGasUsed_ETH.forEach((v,i) => {
                        // let snValue = avgGasUsed_SN.find((val) => val.time === v.time)
                        let snValue = avgGasUsed_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        _avgGasUsed[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:v.value/10**9, sn_value:avgGasUsed_SN[i].value/10**9}
                        if (snValue){
                            _avgGasUsed[i].sn_value = snValue.value/10**9;
                            _avgGasUsed[i].percent_change = (snValue.value/10**9)/_avgGasUsed[i].eth_value;
                        }
                    });
                    setChartData(_avgGasUsed.reverse());
                    break;
                default:
                    let __ethTransferData: IChartData[] = []
                    ethTransferData_ETH.forEach((v,i) => {
                        // let snValue = ethTransferData_SN.find((val) => val.time === v.time)
                        let snValue = ethTransferData_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        __ethTransferData[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
                        if (snValue){
                            const sn_value = isCurrencyEth?snValue?.value:snValue?.value*snValue?.price;
                            _ethTransferData[i].sn_value = sn_value;
                            _ethTransferData[i].percent_change = sn_value/_ethTransferData[i].eth_value;
                        }
                    });
                    setChartData(__ethTransferData.reverse());
            }
            setChartLoading(false);
        }
    }, [chartDisplay,avgGasUsed_ETH, avgGasUsed_SN, isCurrencyEth]);

    const handleTimeFrame = (period:string) => {
        setTimeFrame(period)
    }

    const ethTranferFeeLatest = isCurrencyEth ? feeEstimate?.ethTransferFee : (Number(feeEstimate?.ethTransferFee) * ethPrice).toFixed(4);
    const erc20TransferFeeLatest = isCurrencyEth ? feeEstimate?.erc20TransferFee : (Number(feeEstimate?.erc20TransferFee) * ethPrice).toFixed(4);
    const totalTxnFeeLatest = snBlock?isCurrencyEth ? Number(ethers.utils.formatEther(snBlock?.avgTxnFee)).toFixed(9) : (Number(ethers.utils.formatEther(snBlock?.avgTxnFee)) * ethPrice).toFixed(4) : "0.00";
    return (
        <div>
            <h1 className="text-2xl text-white text-center">Fee Tracker</h1>
            <h1 className="text-lg py-1 text-gray-400 text-center">save upto 10x on asset transfer fees</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-8 text-gray-400 drop-shadow-xl">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 order-1 lg:order-none"> 
                    <div onClick={()=>setChartDisplay('usdcTransferFee')} className={`bg-box rounded-lg p-3 px-5 2xl:p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "usdcTransferFee" ? "border-4 border-sky-900" : ""}`}>
                        <span className='text-xs sm:text-sm 2xl:text-lg'>USDC TRANSFER FEE</span>
                        <span className='hidden sm:inline text-xs sm:text-sm 2xl:text-lg'> (ERC20)</span>
                        <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                            {!snBlockLoading ? 
                                <> {erc20TransferFeeLatest} {currency.toUpperCase()} </> 
                                :
                                <div className= "flex justify-center">
                                    <SpinnerCircular size={20} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                </div>
                            }
                        </h1>
                    </div>
                    <div onClick={()=>setChartDisplay('ethTransferFee')} className={`bg-box rounded-lg p-3 px-5 2xl:p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "ethTransferFee" ? "border-4 border-sky-900" : ""}`}>
                        <span className='text-xs sm:text-sm 2xl:text-lg'>ETH TRANSFER FEE</span>
                        <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                            {!snBlockLoading ? 
                                <> {ethTranferFeeLatest} {currency.toUpperCase()} </> 
                                :
                                <div className= "flex justify-center">
                                    <SpinnerCircular size={20} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                </div>
                            }
                        </h1>
                    </div>
                    <div onClick={()=>setChartDisplay('avgTxnFee')} className={`bg-box rounded-lg p-3 px-5 2xl:p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "avgTxnFee" ? "border-4 border-sky-900" : ""}`}>
                        <span className='text-xs sm:text-sm 2xl:text-lg'>TOTAL TXN FEE</span>
                        <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                            {!snBlockLoading ? 
                                <> {totalTxnFeeLatest} {currency.toUpperCase()} </> 
                                :
                                <div className= "flex justify-center">
                                    <SpinnerCircular size={20} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                </div>
                            }
                        </h1>
                    </div>
                    <div onClick={()=>setChartDisplay('avgGasUsed')} className={`bg-box rounded-lg p-3 px-5 2xl:p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "avgGasUsed" ? "border-4 border-sky-900" : ""}`}>
                        <span className='text-xs sm:text-sm 2xl:text-lg'>TOTAL GAS USED</span>
                        <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                            {!snBlockLoading ? 
                                <> {(snBlock.gasUsedPerblock)/10**9} Gwei </> 
                                :
                                <div className= "flex justify-center">
                                    <SpinnerCircular size={20} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                </div>
                            }
                        </h1>
                    </div>
                    
                </div>
                <div className="lg:col-span-2 flex flex-col justify-between py-5 px-0 2xl:p-5 bg-box rounded-lg bg-gradient-to-br from-[#0d1b3d] via-[#081128] to-transparent">
                    {chartDisplay === 'ethTransferFee' && <h1 className="text-gray-400 text-lg text-center">AVERAGE ETH TRANSFER FEE ({currency.toUpperCase()})</h1>}
                    {chartDisplay === 'usdcTransferFee' && <h1 className="text-gray-400 text-lg text-center">AVERAGE USDC TRANSFER FEE ({currency.toUpperCase()})</h1>}
                    {chartDisplay === 'avgTxnFee' && <h1 className="text-gray-400 text-lg text-center">AVERAGE TRANSACTION FEE PER BLOCK ({currency.toUpperCase()})</h1>}
                    {chartDisplay === 'avgGasUsed' && <h1 className="text-gray-400 text-lg text-center">AVERAGE GAS USED PER BLOCK (Gwei)</h1>}
                    <FeeChart data={chartData} isLoading={snDetailLoading && ethDetailLoading && chartLoading} chartDisplay={chartDisplay} currency={currency} timeFrame={timeFrame}/>
                </div>
                <div className="flex order-last lg:order-none justify-between items-center text-sm">
                    <div>LATEST BLOCK: {snBlock?.block_number}</div> 
                    <div className="hidden xl:block">UPDATED: {lastUpdated} SECONDS AGO</div> 
                    <div className="block xl:hidden">UPDATED: {lastUpdated}s AGO</div> 
                </div>
                <div className="flex order-first lg:order-none justify-between items-center lg:col-span-2">
                    <div className="flex justify-start items-center text-sm"> 
                        <div className="mr-2 ">CURRENCY</div> 
                        <div onClick={()=>setCurrency('eth')} className={`cursor-pointer mx-2 p-1 ${currency==='eth'?"border border-gray-400 bg-sky-900 text-white rounded-sm":""}`}>ETH</div> 
                        <div onClick={()=>setCurrency('usd')} className={`cursor-pointer p-1 ${currency==='usd'?"border border-gray-400 bg-sky-900 text-white rounded-sm":""}`}>USD</div> 
                    </div>
                    <div className="flex justify-end items-center text-sm"> 
                        <div className="mr-2 ">TIME FRAME</div> 
                        <div onClick={()=>handleTimeFrame('4h')} className={`cursor-pointer mx-2 p-1 ${timeFrame==='4h'?"border border-gray-400 bg-sky-900 text-white rounded-sm":""}`}>4h</div> 
                        <div onClick={()=>handleTimeFrame('1d')} className={`cursor-pointer p-1 ${timeFrame==='1d'?"border border-gray-400 bg-sky-900 text-white rounded-sm":""}`}>1d</div> 
                    </div>
                </div>
            </div>
        </div>
    );
}

