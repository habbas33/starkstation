import { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { SpinnerCircular } from "spinners-react";
import FeeChart from './FeeChart';
import { PriceContext } from '../../context/PriceContext';
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
    const { network } = useContext(AppContext)
    const [chartLoading, setChartLoading] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<any>(0);
    const [feeEstimate, setFeeEstimate] = useState<{ ethTransferFee:string, erc20TransferFee:string, nftMintFee:string, swapFee:string }>({ ethTransferFee:'0.000081779', erc20TransferFee:'0.000081757', nftMintFee:'0.000160568', swapFee:'0.000166792' });
    const [chartDisplay, setChartDisplay] = useState<string>('usdcTransferFee');
    const [currency, setCurrency] = useState<string>('eth');
    const [chartData, setChartData] = useState<IChartData[]>([]);

    const [ethTransferData_SN, setEthTransferData_SN] = useState<IData[]>([]);
    const [usdcTransferData_SN, setUsdcTransferData_SN] = useState<IData[]>([]);
    const [swapFeeData_SN, setSwapFeeData_SN] = useState<IData[]>([]);
    const [nftMintFeeData_SN, setNftMintFeeData_SN] = useState<IData[]>([]);

    const [ethTransferData_ETH, setEthTransferData_ETH] = useState<IData[]>([]);
    const [usdcTransferData_ETH, setUsdcTransferData_ETH] = useState<IData[]>([]);
    const [swapFeeData_ETH, setSwapFeeData_ETH] = useState<IData[]>([]);
    const [nftMintFeeData_ETH, setNftMintFeeData_ETH] = useState<IData[]>([]);

    
    const snBlock = snBlockData?.detail[0];
    const isCurrencyEth: boolean = currency === 'eth'? true : false;
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(dayjs().diff(snBlockData?.lastUpdated, 'seconds'));
        }, 1000);

        const getFeeEstimate = async() =>{
            // const x = await getEthTransferFee(network)
            let _feeEstimate = snBlock?.feeEstimate
            if (_feeEstimate) {
                _feeEstimate.ethTransferFee = _feeEstimate.ethTransferFee.toFixed(9)
                _feeEstimate.erc20TransferFee = _feeEstimate.erc20TransferFee.toFixed(9) 
                _feeEstimate.swapFee = _feeEstimate.swapFee.toFixed(9) 
                _feeEstimate.nftMintFee = _feeEstimate.nftMintFee.toFixed(9)  
                setFeeEstimate(_feeEstimate);    
            }        
        }
        getFeeEstimate();
        return () => clearInterval(interval);
    }, [snBlockData]);

    // useEffect(() => {
    //     if (feeEstimate) {
    //         setChartLoading(false);
    //     }
    // }, [feeEstimate]);

    useEffect(() => {
        if (ethTransferData_SN.length && usdcTransferData_SN.length) {
            setChartLoading(true);
        }
    }, [network]);

    useEffect(() => {
        if(snDetailData){
            const _ethTransferData: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.ethTransferFee, price:item?.ethPrice}));
            const _usdcTransferData: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.erc20TransferFee, price:item?.ethPrice}));
            const _swapFeeData: IData[] = snDetailData.filter((item:any) => item.timestamp > 1667634995).map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.swapFee, price:item?.ethPrice}));
            const _nftMintFeeData: IData[] = snDetailData.filter((item:any) => item.timestamp > 1667634995).map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.nftMintFee, price:item?.ethPrice}));
            setEthTransferData_SN(_ethTransferData);
            setUsdcTransferData_SN(_usdcTransferData);
            setSwapFeeData_SN(_swapFeeData);
            setNftMintFeeData_SN(_nftMintFeeData);
        }
    }, [snDetailData]);

    useEffect(() => {
        if(ethDetailData){
            const _ethTransferData: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.ethTransferFee, price:item?.ethPrice}));
            const _usdcTransferData: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.erc20TransferFee, price:item?.ethPrice}));
            const _swapFeeData: IData[] = ethDetailData.filter((item:any) => item.timestamp > 1667634995).map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.swapFee, price:item?.ethPrice}));
            const _nftMintFeeData: IData[] = ethDetailData.filter((item:any) => item.timestamp > 1667634995).map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.feeEstimate?.nftMintFee, price:item?.ethPrice}));
            setEthTransferData_ETH(_ethTransferData);
            setUsdcTransferData_ETH(_usdcTransferData);
            setSwapFeeData_ETH(_swapFeeData);
            setNftMintFeeData_ETH(_nftMintFeeData);
        }
    }, [ethDetailData]);

    useEffect(() => {
        if(chartDisplay){
            // setChartLoading(true);
            switch(chartDisplay) {
                case "ethTransferFee":
                    let _ethTransferData: IChartData[] = []
                    ethTransferData_ETH.forEach((v,i) => {
                        let snValue = ethTransferData_SN.find((val) => val.time === v.time)
                        // let snValue = ethTransferData_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
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
                        let snValue = usdcTransferData_SN.find((val) => val.time === v.time)
                        // let snValue = usdcTransferData_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        _usdcTransferData[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
                        if (snValue){
                            const sn_value = isCurrencyEth?snValue?.value:snValue?.value*snValue?.price;
                            _usdcTransferData[i].sn_value = sn_value;
                            _usdcTransferData[i].percent_change = sn_value/_usdcTransferData[i].eth_value;
                        }
                    });
                    setChartData(_usdcTransferData.reverse());
                    break;
                case "swapFee":
                    let _swapFeeData: IChartData[] = []
                    swapFeeData_ETH.forEach((v,i) => {
                        let snValue = swapFeeData_SN.find((val) => val.time === v.time)
                        // let snValue = swapFeeData_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        _swapFeeData[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
                        if (snValue){
                            const sn_value = isCurrencyEth?snValue?.value:snValue?.value*snValue?.price;
                            _swapFeeData[i].sn_value = sn_value;
                            _swapFeeData[i].percent_change = sn_value/_swapFeeData[i].eth_value;
                        }
                    });
                    setChartData(_swapFeeData.reverse());
                    break;
                case "nftMintFee":
                    let _nftMintFeeData: IChartData[] = []
                    nftMintFeeData_ETH.forEach((v,i) => {
                        let snValue = nftMintFeeData_SN.find((val) => val.time === v.time)
                        // let snValue = nftMintFeeData_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        _nftMintFeeData[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
                        if (snValue){
                            const sn_value = isCurrencyEth?snValue?.value:snValue?.value*snValue?.price;
                            _nftMintFeeData[i].sn_value = sn_value;
                            _nftMintFeeData[i].percent_change = sn_value/_nftMintFeeData[i].eth_value;
                        }
                    });
                    setChartData(_nftMintFeeData.reverse());
                    break;
                default:
                    let __ethTransferData: IChartData[] = []
                    ethTransferData_ETH.forEach((v,i) => {
                        let snValue = ethTransferData_SN.find((val) => val.time === v.time)
                        // let snValue = ethTransferData_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') >= -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        __ethTransferData[i] = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:isCurrencyEth?v.value:v.value*v.price}
                        if (snValue){
                            const sn_value = isCurrencyEth?snValue?.value:snValue?.value*snValue?.price;
                            __ethTransferData[i].sn_value = sn_value;
                            __ethTransferData[i].percent_change = sn_value/__ethTransferData[i].eth_value;
                        }
                    });
                    setChartData(__ethTransferData.reverse());
            }
            setChartLoading(false);
        }
    }, [chartDisplay,nftMintFeeData_ETH, nftMintFeeData_SN, isCurrencyEth]);

    const handleTimeFrame = (period:string) => {
        setTimeFrame(period)
    }

    const ethTranferFeeLatest = isCurrencyEth ? feeEstimate?.ethTransferFee : (Number(feeEstimate?.ethTransferFee) * ethPrice).toFixed(6);
    const erc20TransferFeeLatest = isCurrencyEth ? feeEstimate?.erc20TransferFee : (Number(feeEstimate?.erc20TransferFee) * ethPrice).toFixed(6);
    const swapFeeFeeLatest = isCurrencyEth ? feeEstimate?.swapFee : (Number(feeEstimate?.swapFee) * ethPrice).toFixed(6); //fix
    const nftMintFeeLatest = isCurrencyEth ? feeEstimate?.nftMintFee : (Number(feeEstimate?.nftMintFee) * ethPrice).toFixed(6); //fix
    return (
        <div>
            <h1 className="text-2xl text-white text-center">Fee Tracker</h1>
            <h1 className="text-lg py-1 text-gray-400 text-center">save upto 10x on asset transfer fees</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-8 text-gray-400 drop-shadow-xl">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 order-1 lg:order-none"> 
                    <div onClick={()=>setChartDisplay('usdcTransferFee')} className={`bg-box rounded-lg p-3 px-4 2xl:p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "usdcTransferFee" ? "border-4 border-sky-900" : ""}`}>
                        <span className='text-xs sm:text-sm 2xl:text-lg'>USDC TRANSFER FEE</span>
                        <span className='hidden sm:inline text-xs sm:text-sm 2xl:text-lg'> (ERC20)</span>
                        <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                            {!snBlockLoading? 
                                <> {erc20TransferFeeLatest} {currency.toUpperCase()} </> 
                                :
                                <div className= "flex justify-center 2xl:py-0.5">
                                    <SpinnerCircular size={28} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                </div>
                            }
                        </h1>
                    </div>
                    <div onClick={()=>setChartDisplay('ethTransferFee')} className={`bg-box rounded-lg p-3 px-4 2xl:p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "ethTransferFee" ? "border-4 border-sky-900" : ""}`}>
                        <span className='text-xs sm:text-sm 2xl:text-lg'>ETH TRANSFER FEE</span>
                        <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                            {!snBlockLoading ? 
                                <> {ethTranferFeeLatest} {currency.toUpperCase()} </> 
                                :
                                <div className= "flex justify-center 2xl:py-0.5">
                                    <SpinnerCircular size={28} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                </div>
                            }
                        </h1>
                    </div>
                    <div onClick={()=>setChartDisplay('swapFee')} className={`bg-box rounded-lg p-3 px-4 2xl:p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "swapFee" ? "border-4 border-sky-900" : ""}`}>
                        <span className='text-xs sm:text-sm 2xl:text-lg'>SWAP FEE</span>
                        <span className='hidden sm:inline text-xs sm:text-sm 2xl:text-lg'> (MY SWAP)</span>
                        <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                            {!snBlockLoading ? 
                                <> {swapFeeFeeLatest} {currency.toUpperCase()} </> 
                                :
                                <div className= "flex justify-center 2xl:py-0.5">
                                    <SpinnerCircular size={28} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                </div>
                            }
                        </h1>
                    </div>
                    <div onClick={()=>setChartDisplay('nftMintFee')} className={`bg-box rounded-lg p-3 px-4 2xl:p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "nftMintFee" ? "border-4 border-sky-900" : ""}`}>
                        <span className='text-xs sm:text-sm 2xl:text-lg'>NFT MINT FEE</span>
                        <span className='hidden sm:inline text-xs sm:text-sm 2xl:text-lg'> (MINT SQUARE)</span>
                        <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                            {!snBlockLoading ? 
                                <> {nftMintFeeLatest} {currency.toUpperCase()} </> 
                                :
                                <div className= "flex justify-center 2xl:py-0.5">
                                    <SpinnerCircular size={28} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                </div>
                            }
                        </h1>
                    </div>
                    
                </div>
                <div className="lg:col-span-2 flex flex-col justify-between py-5 px-0 2xl:p-5 bg-box rounded-lg bg-gradient-to-br from-[#0d1b3d] via-[#081128] to-transparent">
                    {chartDisplay === 'ethTransferFee' && <h1 className="text-gray-400 text-lg text-center py-5">AVERAGE ETH TRANSFER FEE ({currency.toUpperCase()})</h1>}
                    {chartDisplay === 'usdcTransferFee' && <h1 className="text-gray-400 text-lg text-center py-5">AVERAGE USDC TRANSFER FEE ({currency.toUpperCase()})</h1>}
                    {chartDisplay === 'swapFee' && <h1 className="text-gray-400 text-lg text-center py-5">AVERAGE SWAP FEE ({currency.toUpperCase()})</h1>}
                    {chartDisplay === 'nftMintFee' && <h1 className="text-gray-400 text-lg text-center py-5">AVERAGE NFT MINT FEE ({currency.toUpperCase()})</h1>}
                    <FeeChart data={chartData} isLoading={snDetailLoading || ethDetailLoading || chartLoading} chartDisplay={chartDisplay} currency={currency} timeFrame={timeFrame}/>
                </div>
                <div className="flex order-last lg:order-none justify-between items-center text-sm">
                    <div>LATEST BLOCK: {snBlock?.block_number}</div> 
                    <div className="hidden 2xl:block">UPDATED: {lastUpdated} SECONDS AGO</div> 
                    <div className="block 2xl:hidden">UPDATED: {lastUpdated}s AGO</div> 
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

