
import { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import {ethers} from 'ethers';
import { SpinnerCircular } from "spinners-react";
import BlocksChart from './BlocksChart';
import { AppContext } from '../../context/AppContext';

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

export default function BlocksPanel(props: {
    snDetailLoading:boolean
    snDetailData:any
    snBlockLoading: boolean
    snBlockData:any
    ethDetailLoading:boolean
    snProofData:any
    snProofLoading:boolean
    ethDetailData:any
    timeFrame:string
    setTimeFrame:any
}) {
    const {snDetailLoading, snBlockLoading, ethDetailLoading, snProofLoading, snDetailData, snBlockData, snProofData, ethDetailData, timeFrame, setTimeFrame } = props;
    const { network } = useContext(AppContext)
    const [chartLoading, setChartLoading] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<any>(0);
    const [chartDisplay, setChartDisplay] = useState<string>('verificationCost');
    const [chartData, setChartData] = useState<IChartData[]>([]);
    const [currency, setCurrency] = useState<string>('eth');
    
    const [avgTxnFee_SN, setAvgTxnFee_SN] = useState<IData[]>([]);
    const [avgGasUsed_SN, setAvgGasUsed_SN] = useState<IData[]>([]);
    const [avgBlockVerificationCost_SN, setAvgBlockVerificationCost_SN] = useState<IData[]>([]);
    const [avgTxnFee_ETH, setAvgTxnFee_ETH] = useState<IData[]>([]);
    const [avgGasUsed_ETH, setAvgGasUsed_ETH] = useState<IData[]>([]);

    const snBlock = snBlockData?.detail[0];
    const snProof = snProofData?.detail[0];

    const isCurrencyEth: boolean = currency === 'eth'? true : false;

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(dayjs().diff(snBlockData?.lastUpdated, 'seconds'));
        }, 1000);

        return () => clearInterval(interval);
    }, [snBlockData]);

    useEffect(() => {
        if(snDetailData){
            const _avgTxnFee: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:Number(ethers?.utils.formatEther(item.avgTxnFee)), price:item?.ethPrice}));
            const _avgGasUsed: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.gasUsedPerblock, price:item?.ethPrice}));
            const _avgBlockCost: IData[] = snDetailData.filter((item: any) => item.timestamp > 1666915050).map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.blockVerificationCost, price:item?.ethPrice}));
            setAvgBlockVerificationCost_SN(_avgBlockCost);
            setAvgTxnFee_SN(_avgTxnFee);
            setAvgGasUsed_SN(_avgGasUsed);
        }
    }, [snDetailData]);

    useEffect(() => {
        if(ethDetailData){
            const _avgTxnFee: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:Number(ethers?.utils.formatEther(item.avgTxnFee)), price:item?.ethPrice}));
            const _avgGasUsed: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.gasUsedPerblock, price:item?.ethPrice}));
            setAvgTxnFee_ETH(_avgTxnFee);
            setAvgGasUsed_ETH(_avgGasUsed);
        }
    }, [ethDetailData]);

    useEffect(() => {
        if (setAvgGasUsed_ETH.length && setAvgGasUsed_SN.length) {
            setChartLoading(true);
        }
    }, [network,chartDisplay]);

    useEffect(() => {
        if(chartDisplay){
            // setChartLoading(true);
            switch(chartDisplay) {
                case "avgTxnFee":
                    let _avgTxnFee: IChartData[] = []
                    avgTxnFee_ETH.forEach((v,i) => {
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
                        let snValue = avgGasUsed_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        _avgGasUsed[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:v.value/10**9}
                        if (snValue){
                            _avgGasUsed[i].sn_value = snValue.value/10**9;
                            _avgGasUsed[i].percent_change = (snValue.value/10**9)/_avgGasUsed[i].eth_value;
                        }
                    });
                    setChartData(_avgGasUsed.reverse());
                    break;
                case "verificationCost":
                    let _verificationCost: IChartData[] = []
                    avgBlockVerificationCost_SN.forEach((v,i) => {
                        _verificationCost[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:0}
                        _verificationCost[i].sn_value = isCurrencyEth? v?.value : v?.value*v?.price;
                    });
                    setChartData(_verificationCost.reverse());
                    break;   
                default:
                    let __avgTxnFee: IChartData[] = []
                    avgTxnFee_ETH.forEach((v,i) => {
                        let snValue = avgTxnFee_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        __avgTxnFee[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
                        if (snValue){
                            const sn_value = isCurrencyEth?snValue?.value:snValue?.value*snValue?.price;
                            __avgTxnFee[i].sn_value = sn_value;
                            __avgTxnFee[i].percent_change = sn_value/__avgTxnFee[i].eth_value;
                        }
                    });
                    setChartData(__avgTxnFee.reverse());
            }
            setChartLoading(false);
        }
    }, [chartDisplay,avgGasUsed_ETH, avgGasUsed_SN, isCurrencyEth]);

    const handleTimeFrame = (period:string) => {
        setTimeFrame(period)
    }

    const totalTxnFeeLatest = snBlock?isCurrencyEth ? Number(ethers.utils.formatEther(snBlock?.avgTxnFee)).toFixed(9) : (Number(ethers.utils.formatEther(snBlock?.avgTxnFee)) * Number(snBlock?.ethPrice)).toFixed(6) : "0.00";
    const verificationCostLatest = snProof?isCurrencyEth ? Number(snProof?.blockVerificationCost).toFixed(9) : (Number(snProof?.blockVerificationCost) * Number(snProof?.ethPrice)).toFixed(6) : "0.00";
    return (
        <div>
            <h1 className="text-2xl text-white text-center">Block Fee Tracker</h1>
            <h1 className="text-lg py-1 text-gray-400 text-center">permissionless layer of Sequencers and Provers ensures that the network will be censorship-resistant</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-8 text-gray-400 drop-shadow-2xl">
                <div onClick={()=>setChartDisplay('verificationCost')} className={`bg-box text-center rounded-lg p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "verificationCost" ? "border-4 border-sky-900" : ""}`}>
                    <span className= "text-xs sm:text-sm 2xl:text-lg">L1 BLOCK VERIFICATION COST</span>
                    <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                        {!snProofLoading ? 
                            <> {verificationCostLatest} {currency.toUpperCase()} </> 
                            :
                            <div className= "flex justify-center">
                                <SpinnerCircular size={28} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                            </div>
                        }
                    </h1>
                </div>
                <div onClick={()=>setChartDisplay('avgTxnFee')} className={`bg-box text-center rounded-lg p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "avgTxnFee" ? "border-4 border-sky-900" : ""}`}>
                    <span className= "text-xs sm:text-sm 2xl:text-lg">TOTAL BLOCK FEE</span>
                    <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                        {!snBlockLoading ? 
                            <> {totalTxnFeeLatest} {currency.toUpperCase()} </> 
                            :
                            <div className= "flex justify-center">
                                <SpinnerCircular size={28} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                            </div>
                        }
                    </h1>
                </div>
                <div onClick={()=>setChartDisplay('avgGasUsed')} className={`bg-box text-center rounded-lg p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "avgGasUsed" ? "border-4 border-sky-900" : ""}`}>
                    <span className= "text-xs sm:text-sm 2xl:text-lg">TOTAL GAS USED</span>
                    <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                        {!snBlockLoading ? 
                            <> {(snBlock.gasUsedPerblock)/10**9} GWEI</> 
                            :
                            <div className= "flex justify-center">
                                <SpinnerCircular size={20} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                            </div>
                        }
                    </h1>
                </div>
                <div className="grid order-4 lg:order-none gap-4"> 
                    <div className={`row-span-2 bg-box rounded-lg p-5`}>
                        <div className="table-wrp max-h-[18rem] w-full text-sm pr-5">
                        <table className="w-full table-fixed">
                            <thead className="sticky bg-box top-0">
                                <tr>
                                    <th className="text-start pb-4">BLOCK</th>
                                    {chartDisplay === "avgTxnFee" && <th className="text-end pb-4 w-[110%]">BLOCK FEE ({currency.toUpperCase()})</th>}
                                    {chartDisplay === "avgGasUsed" && <th className="text-end pb-4 w-[110%]">GAS USED (GWEI)</th>}
                                    {chartDisplay === "verificationCost" && <th className="text-end pb-4 w-[110%]">VERIFICATION COST ({currency.toUpperCase()})</th>}
                                </tr>
                            </thead>

                            <tbody className="h-[18rem] text-white text-lg overflow-y-scroll Robo">
                                {chartDisplay === "verificationCost" && snProofData?.detail && snProofData?.detail.map((val:any, key:number) => {
                                    return (
                                            <tr key={key}>
                                                <td className="text-start py-2">#{val?.block_number}</td>
                                                <td className="text-end">
                                                    {val?.blockVerificationCost?isCurrencyEth ? Number((val?.blockVerificationCost)).toFixed(9) : (Number((val?.blockVerificationCost))* (Number(val?.ethPrice))).toFixed(6) : "0.00"}
                                                </td>
                                                
                                            </tr>
                                    )
                                })}
                                {chartDisplay != "verificationCost" && snBlockData?.detail && snBlockData?.detail.map((val:any, key:number) => {
                                    return (
                                            <tr key={key}>
                                                <td className="text-start py-2">#{val?.block_number}</td>
                                                {chartDisplay === "avgTxnFee" && <td className="text-end">
                                                    {val?.avgTxnFee?isCurrencyEth ? Number(ethers.utils.formatEther(val?.avgTxnFee)).toFixed(9) : (Number(ethers.utils.formatEther(val?.avgTxnFee)) * (Number(val?.ethPrice))).toFixed(6) : "0.00"}
                                                </td>}
                                                {chartDisplay === "avgGasUsed" && <td className="text-end">{val?.gasUsedPerblock}</td>}
                                            </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:col-span-2 justify-between order-2 lg:order-none py-5 px-0 2xl:p-5 bg-box rounded-lg bg-gradient-to-br from-[#0d1b3d] via-[#081128] to-transparent">
                    {chartDisplay === "avgTxnFee" && <h1 className="text-gray-400 text-lg text-center py-5">AVERAGE FEE PER BLOCK ({currency.toUpperCase()})</h1>}
                    {chartDisplay === "avgGasUsed" && <h1 className="text-gray-400 text-lg text-center py-5">AVERAGE GAS USED PER BLOCK</h1>}
                    {chartDisplay === "verificationCost" && <h1 className="text-gray-400 text-lg text-center py-5">AVERAGE L1 BLOCK VERIFICATION COST ({currency.toUpperCase()})</h1>}
                    <BlocksChart data={chartData} isLoading={snDetailLoading || ethDetailLoading || chartLoading} chartDisplay={chartDisplay} currency={currency} timeFrame={timeFrame}/>
                </div>
                <div className="flex order-last lg:order-none justify-between items-center text-sm">
                    <div>LATEST BLOCK: {snBlock?.block_number}</div> 
                    <div className="hidden 2xl:block">UPDATED: {lastUpdated} SECONDS AGO</div> 
                    <div className="block 2xl:hidden">UPDATED: {lastUpdated}s AGO</div> 
                </div>
                <div className="flex order-1 lg:order-none justify-between items-center text-sm lg:col-span-2">
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
