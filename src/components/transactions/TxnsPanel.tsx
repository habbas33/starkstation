
import { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { SpinnerCircular } from "spinners-react";
import TxnsChart from './TxnsChart';
import { AppContext } from '../../context/AppContext';

interface IData {
    time: string;
    value: number;
}

interface IChartData {
    time: string;
    sn_value?: number;
    eth_value: number;
}

export default function TxnsPanel(props: {
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
    const { network } = useContext(AppContext)
    const [chartLoading, setChartLoading] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<any>(0);
    const [chartDisplay, setChartDisplay] = useState<string>('tps');
    const [chartData, setChartData] = useState<IChartData[]>([]);
    
    const [avgTps_SN, setAvgTps_SN] = useState<IData[]>([]);    
    const [avgTpb_SN, setAvgTpb_SN] = useState<IData[]>([]);
    const [avgTps_ETH, setAvgTps_ETH] = useState<IData[]>([]);    
    const [avgTpb_ETH, setAvgTpb_ETH] = useState<IData[]>([]);
    
    const snBlock = snBlockData?.detail[0];

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(dayjs().diff(snBlockData?.lastUpdated, 'seconds'));
        }, 1000);

        return () => clearInterval(interval);
    }, [snBlockData]);

    useEffect(() => {
        if(snDetailData){
            const _avgTps: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.transactionsPerSecond}));
            const _avgTpb: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.transactionsPerBlock}));
            
            setAvgTps_SN(_avgTps);
            setAvgTpb_SN(_avgTpb);
        }
    }, [snDetailData]);

    useEffect(() => {
        if(ethDetailData){
            const _avgTps: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.transactionsPerSecond}));
            const _avgTpb: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format('MMM DD, YYYY HH:00'), value:item?.transactionsPerBlock}));
            
            setAvgTps_ETH(_avgTps);
            setAvgTpb_ETH(_avgTpb);
        }
    }, [ethDetailData]);

    useEffect(() => {
        if(chartDisplay){
            setChartLoading(true);
            switch(chartDisplay) {
                case "tps":
                    let _avgTps: IChartData[] = []
                    avgTps_ETH.forEach((v,i) => {
                        let snValue = avgTps_SN.find((val) => val.time === v.time)
                        // let snValue = avgTps_SN.find((val) => dayjs(val.time).format('MMM DD') ===  dayjs(v.time).format('MMM DD'))
                        // let snValue = avgTps_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') > -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        const _entry: IChartData = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:v.value}
                        if (snValue){
                            _entry.sn_value = snValue?.value;
                        }
                        _avgTps.push(_entry)
                    });
                    setChartData(_avgTps.reverse());
                    break;
                case "tpb":
                    let _avgTpb: IChartData[] = []
                    avgTpb_ETH.forEach((v,i) => {
                        let snValue = avgTps_SN.find((val) => val.time === v.time)
                        // let snValue = avgTpb_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') > -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        const _entry: IChartData = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:v.value}
                        // _avgTpb[i] = {time: v.time, eth_value:v.value}
                        if (snValue){
                            _entry.sn_value = snValue?.value;
                        }
                        _avgTpb.push(_entry)
                    });
                    setChartData(_avgTpb.reverse());
                    break;
                default:
                    let __avgTps: IChartData[] = []
                    avgTps_ETH.forEach((v,i) => {
                        let snValue = avgTps_SN.find((val) => val.time === v.time)
                        // let snValue = avgTps_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') > -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                        const _entry: IChartData = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:v.value}
                        if (snValue){
                            _entry.sn_value = snValue?.value;
                        }
                        __avgTps.push(_entry)
                    });
                    setChartData(__avgTps.reverse());
            }
            setChartLoading(false);
        }
    }, [chartDisplay,avgTpb_ETH,avgTps_SN]);

    useEffect(() => {
        if (avgTpb_ETH.length && avgTps_SN.length) {
            setChartLoading(true);
        }
    }, [network]);

    const handleTimeFrame = (period:string) => {
        setTimeFrame(period)
    }

    return (
        <div>
            <h1 className="text-2xl text-white text-center">Transactions Tracker</h1>
            <h1 className="text-lg py-1 text-gray-400 text-center">achieve unlimited scalability with ZK-Rollups</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8 text-gray-400 drop-shadow-xl">
                <div className="grid order-2 lg:order-none grid-rows-7 gap-4"> 
                    <div className="grid grid-cols-2 gap-2">
                        <div onClick={()=>setChartDisplay('tps')} className={`bg-box text-center rounded-lg p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "tps" ? "border-4 border-sky-900" : ""}`}>
                            <span className="hidden sm:inline text-xs sm:text-sm 2xl:text-lg">TXNs PER SECOND</span>
                            <span className="inline sm:hidden text-xs sm:text-sm 2xl:text-lg">TPS</span>
                            <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                                {!snBlockLoading ? 
                                    <> {snBlock?.transactionsPerSecond.toFixed(4)} </> 
                                    :
                                    <div className= "flex justify-center">
                                        <SpinnerCircular size={28} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                    </div>
                                }
                            </h1>
                        </div>
                        <div onClick={()=>setChartDisplay('tpb')} className={`bg-box text-center rounded-lg p-5 cursor-pointer hover:bg-box-hover active:bg-box-active ${chartDisplay === "tpb" ? "border-4 border-sky-900" : ""}`}>
                            <span className="hidden sm:inline text-xs sm:text-sm 2xl:text-lg">TXNs PER BLOCK</span>
                            <span className="inline sm:hidden text-xs sm:text-sm 2xl:text-lg">TPB</span>
                            <h1 className='text-gray-300 Robo text-xs sm:text-xl 2xl:text-2xl py-1 2xl:py-2'>
                                {!snBlockLoading ? 
                                    <> {snBlock?.transactionsPerBlock} </> 
                                    :
                                    <div className= "flex justify-center">
                                        <SpinnerCircular size={28} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                    </div>
                                }
                            </h1>
                        </div>
                    </div>
                        
                    <div className={`row-span-5 bg-box rounded-lg p-5`}>
                        <div className="table-wrp max-h-64 w-full text-sm pr-10">
                        <table className="w-full table-fixed w-full ">
                            <thead className="sticky bg-box  top-0">
                                <tr>
                                    <th className="text-start pb-4">BLOCK</th>
                                    <th className="text-end pb-4">TPB</th>
                                    <th className="text-end pb-4">TPS</th>
                                </tr>
                            </thead>

                            <tbody className="h-64 text-white text-lg overflow-y-scroll">
                                {snBlockData?.detail && snBlockData?.detail.map((val:any, key:number) => {
                                    return (
                                            <tr key={key}>
                                                <td className="text-start py-2 Robo">#{val?.block_number}</td>
                                                <td className="text-end Robo">{val?.transactionsPerBlock}</td>
                                                <td className="text-end Robo">{val?.transactionsPerSecond.toFixed(4)}</td>
                                            </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between order-1 lg:order-none py-5 px-0 2xl:p-5 bg-box rounded-lg bg-gradient-to-br from-[#0d1b3d] via-[#081128] to-transparent">
                    {chartDisplay === 'tps' && <h1 className="text-gray-400 text-lg text-center py-5">TRANSACTIONS PER SECOND (TPS)</h1>}
                    {chartDisplay === 'tpb' && <h1 className="text-gray-400 text-lg text-center py-5">TRANSACTIONS PER BLOCK (TPB)</h1>}
                    <TxnsChart data={chartData} isLoading={snDetailLoading || ethDetailLoading || chartLoading} chartDisplay={chartDisplay} timeFrame={timeFrame}/>
                </div>
                <div className="flex order-last lg:order-none justify-between items-center text-sm">
                    <div>LATEST BLOCK: {snBlock?.block_number}</div> 
                    <div className="hidden 2xl:block">UPDATED: {lastUpdated} SECONDS AGO</div> 
                    <div className="block 2xl:hidden">UPDATED: {lastUpdated}s AGO</div> 
                </div>
                <div className="flex justify-end items-center text-sm">
                    <div className="mr-2 ">TIME FRAME</div> 
                    <div onClick={()=>handleTimeFrame('4h')} className={`cursor-pointer mx-2 p-1 ${timeFrame==='4h'?"border border-gray-400 bg-sky-900 text-white rounded-sm":""}`}>4h</div> 
                    <div onClick={()=>handleTimeFrame('1d')} className={`cursor-pointer p-1 ${timeFrame==='1d'?"border border-gray-400 bg-sky-900 text-white rounded-sm":""}`}>1d</div> 
                </div>
            </div>
        </div>
    );
}

