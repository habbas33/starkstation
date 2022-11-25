import { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { SpinnerCircular } from "spinners-react";
import { getBridgeFee } from "../../services/stark";
import BridgeChart from './BridgeChart';
import { PriceContext } from '../../context/PriceContext';
import { AppContext } from '../../context/AppContext';
import { useEthFeeEstimateQuery, useEthFeeEstimateQuery4h, useEthFeeEstimateQuery1d } from '../../queries/ethereum';

interface IData {
    time: string;
    value: number;
    price: number;
}

interface IChartData {
    time: string;
    sn_value?: number;
    eth_value: number;
    total_value?: number;
}

export default function BridgePanel(props: {
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
    const { network } = useContext(AppContext)

    const {refetch, data: ethFeeEstimate} = useEthFeeEstimateQuery(network, '4h', '1', '0');
    const {isLoading:ethFeeEstimateLoading_4h, data: ethFeeEstimateData_4h} = useEthFeeEstimateQuery4h('goerli');
    const {isLoading:ethFeeEstimateLoading_1d, data: ethFeeEstimateData_1d} = useEthFeeEstimateQuery1d('goerli');
    const ethFeeEstimateData = timeFrame === '4h' ? ethFeeEstimateData_4h : ethFeeEstimateData_1d
    const ethFeeEstimateLoading = timeFrame === '4h' ? ethFeeEstimateLoading_4h : ethFeeEstimateLoading_1d
    
    const [chartLoading, setChartLoading] = useState<boolean>(true);
    const [lastUpdated, setLastUpdated] = useState<any>(0);
    const [depositFeeLatest, setDepositFeeLatest] = useState<string>('0.001791952')
    const [withdrawFeeLatest, setWithdrawFeeLatest] = useState<string>('')
    const [initiateWithdrawFeeLatest, setInitiateWithdrawFeeLatest] = useState<string>('')
    const [totalWithdrawFeeLatest, setTotalWithdrawFeeLatest] = useState<string>('')
    const [currency, setCurrency] = useState<string>('eth');
    const [depositChartData, setDepositChartData] = useState<IChartData[]>([]);
    const [withdrawChartData, setWithdrawChartData] = useState<IChartData[]>([]);

    const [initiateWithdrawFeeData_SN, setInitiateWithdrawFeeData_SN] = useState<IData[]>([]);

    const [bridgeDepositFeeData_ETH, setBridgeDepositFeeData_ETH] = useState<IData[]>([]);
    const [bridgeWithdrawFeeData_ETH, setBridgeWithdrawFeeData_ETH] = useState<IData[]>([]);
    const isCurrencyEth: boolean = currency === 'eth'? true : false;
    const snBlock = snBlockData?.detail[0];

    useEffect(() => { 
        refetch();
    }, [network])

    useEffect(() => { 
        if (ethFeeEstimate) {
            const _depositFee = isCurrencyEth ? ethFeeEstimate[0].feeEstimate?.bridgeDepositFee.toFixed(9) : (Number(ethFeeEstimate[0].feeEstimate?.bridgeDepositFee) * ethPrice).toFixed(9);
            const _withdrawFee = isCurrencyEth ? ethFeeEstimate[0].feeEstimate?.bridgeWithdrawFee.toFixed(9) : (Number(ethFeeEstimate[0].feeEstimate?.bridgeWithdrawFee) * ethPrice).toFixed(9);
            setDepositFeeLatest(_depositFee);
            setWithdrawFeeLatest(_withdrawFee);
        }
    }, [ethFeeEstimate, isCurrencyEth])
    
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(dayjs().diff(snBlockData?.lastUpdated, 'seconds'));
        }, 1000);

        const getFeeEstimate = async() =>{
            const initiateWithdrawFee = snBlock?.feeEstimate?.inititateWithdrawFee.toFixed(9)
            // console.log(initiateWithdrawFee)
            // const x = await getBridgeFee(network)
            // const initiateWithdrawFee = x.initiateWithdrawFee;
            setInitiateWithdrawFeeLatest(initiateWithdrawFee); 
            setChartLoading(false);  
        }
        getFeeEstimate();
        refetch();
        return () => clearInterval(interval);
    }, [snBlockData]);

    useEffect(() => {
        if (initiateWithdrawFeeLatest && withdrawFeeLatest) {
            const _initiateWithdrawFee = isCurrencyEth ? Number(initiateWithdrawFeeLatest) : (Number(initiateWithdrawFeeLatest) * ethPrice);
            const _totalWithdraw: number = Number(_initiateWithdrawFee) + Number(withdrawFeeLatest)
            // console.log("_initiateWithdrawFee = ", _initiateWithdrawFee)
            // console.log("withdrawFeeLatest = ", withdrawFeeLatest)
            // console.log("_totalWithdraw = ", _totalWithdraw)
            setTotalWithdrawFeeLatest(_totalWithdraw.toFixed(9))


        }
    }, [initiateWithdrawFeeLatest, withdrawFeeLatest, isCurrencyEth]);

    useEffect(() => {
        if (initiateWithdrawFeeData_SN.length && bridgeWithdrawFeeData_ETH.length && bridgeDepositFeeData_ETH.length) {
            setChartLoading(true);
        }
    }, [network]);

    useEffect(() => {
        if(snDetailData){
            const _initiateWithdrawFeeData: IData[] = snDetailData.filter((item:any) => item.timestamp > 1667634995).map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.inititateWithdrawFee, price:item?.ethPrice}));
            setInitiateWithdrawFeeData_SN(_initiateWithdrawFeeData)
        }
    }, [snDetailData]);

    useEffect(() => {
        if (network != 'goerli') {
            if(ethDetailData){
                const _bridgeDepositFeeData: IData[] = ethDetailData.filter((item:any) => item.timestamp > 1667634995).map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.bridgeDepositFee, price:item?.ethPrice}));
                const _bridgeWithdrawFeeData: IData[] = ethDetailData.filter((item:any) => item.timestamp > 1667634995).map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.bridgeWithdrawFee, price:item?.ethPrice}));
                setBridgeDepositFeeData_ETH(_bridgeDepositFeeData);
                setBridgeWithdrawFeeData_ETH(_bridgeWithdrawFeeData);
            }
        } else {
            if(ethFeeEstimateData){
                const _bridgeDepositFeeData: IData[] = ethFeeEstimateData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.bridgeDepositFee, price:item?.ethPrice}));
                const _bridgeWithdrawFeeData: IData[] = ethFeeEstimateData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.bridgeWithdrawFee, price:item?.ethPrice}));
                setBridgeDepositFeeData_ETH(_bridgeDepositFeeData);
                setBridgeWithdrawFeeData_ETH(_bridgeWithdrawFeeData);
            }
        }
    }, [ethDetailData, ethFeeEstimateData, network]);

    useEffect(() => {
        if (bridgeDepositFeeData_ETH){
            let _depositData: IChartData[] = []
            bridgeDepositFeeData_ETH.forEach((v,i) => {
                _depositData[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
            });
            setDepositChartData(_depositData.reverse());
        }

    }, [bridgeDepositFeeData_ETH, isCurrencyEth]);

    useEffect(() => {
        if (bridgeWithdrawFeeData_ETH){
            let _withdrawData: IChartData[] = []
            bridgeWithdrawFeeData_ETH.forEach((v,i) => {
                let snValue = initiateWithdrawFeeData_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                _withdrawData[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
                if (snValue){
                    const sn_value = isCurrencyEth?snValue?.value:snValue?.value*snValue?.price;
                    _withdrawData[i].sn_value = sn_value;
                    _withdrawData[i].total_value = sn_value+_withdrawData[i].eth_value;
                }
            });
            setWithdrawChartData(_withdrawData.reverse());
        }
        
    }, [bridgeWithdrawFeeData_ETH, initiateWithdrawFeeData_SN, isCurrencyEth]);

    const handleTimeFrame = (period:string) => {
        setTimeFrame(period)
    }

    return (
        <div>
            <h1 className="text-2xl text-white text-center">Bridge Fee Tracker</h1>
            <h1 className="text-lg py-1 text-gray-400 text-center">preserving the security of L1 Ethereum by producing STARK proofs off-chain</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8 text-gray-400 drop-shadow-xl">
                <div className={`bg-box rounded-lg text-center p-5`}>
                    <span className= "text-xs sm:text-sm 2xl:text-lg">STARKGATE DEPOSIT FEE</span>
                    <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                        {!snBlockLoading && !chartLoading? 
                            <> {depositFeeLatest} {currency.toUpperCase()} </> 
                            :
                            <div className= "flex justify-center 2xl:py-0.5">
                                <SpinnerCircular size={28} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                            </div>
                        }
                    </h1>
                </div>
                <div className={`bg-box rounded-lg text-center p-5`}>
                    <span className= "text-xs sm:text-sm 2xl:text-lg">STARKGATE WITHDRAWAL FEE (TOTAL)</span>
                    <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                        {!snBlockLoading  && !chartLoading? 
                            <> {totalWithdrawFeeLatest} {currency.toUpperCase()} </> 
                            :
                            <div className= "flex justify-center 2xl:py-0.5">
                                <SpinnerCircular size={28} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                            </div>
                        }
                    </h1>
                </div>
                <div className="flex flex-col justify-between py-5 px-0 2xl:p-5 bg-box rounded-lg bg-gradient-to-br from-[#0d1b3d] via-[#081128] to-transparent">
                    <h1 className="text-gray-400 text-lg text-center py-5">AVERAGE DEPOSIT FEE ({currency.toUpperCase()})</h1>
                    <BridgeChart data={depositChartData} isLoading={snDetailLoading || ethDetailLoading || chartLoading} chartDisplay={'deposit'} currency={currency} timeFrame={timeFrame}/>
                </div>
                <div className="flex flex-col justify-between py-5 px-0 2xl:p-5 bg-box rounded-lg bg-gradient-to-br from-[#0d1b3d] via-[#081128] to-transparent">
                    <h1 className="text-gray-400 text-lg text-center py-5">AVERAGE WITHDRAWAL FEE ({currency.toUpperCase()})</h1>
                    <BridgeChart data={withdrawChartData} isLoading={snDetailLoading || ethDetailLoading || chartLoading} chartDisplay={'withdraw'} currency={currency} timeFrame={timeFrame}/>
                </div>
                <div className="flex order-last lg:order-none justify-between items-center text-sm">
                    <div className="hidden 2xl:block">UPDATED: {lastUpdated} SECONDS AGO</div> 
                    <div className="block 2xl:hidden">UPDATED: {lastUpdated}s AGO</div> 
                </div>
                <div className="flex order-first lg:order-none justify-between items-center">
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

