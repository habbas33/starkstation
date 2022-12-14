
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { SpinnerCircular } from "spinners-react";
import LatencyChart from './LatencyChart';
import Numeral from 'numeral';

interface IData {
    time: string;
    value: number;
}

interface IChartData {
    time: string;
    sn_value?: number;
    eth_value: number;
}

export default function LatencyPanel(props: {
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
    const [chartLoading, setChartLoading] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<any>(0);
    const [chartData, setChartData] = useState<IChartData[]>([]);
    
    const [avgBlockLatency_SN, setAvgBlockLatency_SN] = useState<IData[]>([]);    
    const [avgBlockLatency_ETH, setAvgBlockLatency_ETH] = useState<IData[]>([]);    
    const [distributionData, setDistributionData] = useState<{ value: number; normalDensityZx: number;}[]>([])
    const [variance, setVariance] = useState<number>(0)
    
    const snBlock = snBlockData?.detail[0];

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(dayjs().diff(snBlockData?.lastUpdated, 'seconds'));
        }, 1000);

        return () => clearInterval(interval);
    }, [snBlockData]);

    useEffect(() => {
        if(snDetailData){
            const timeFormat = timeFrame === '1d' ? 'MMM DD, YYYY' : 'MMM DD, YYYY HH:00'
            const _avgBlockLatency: IData[] = snDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format(timeFormat), value:item?.blockLatency}));
            setAvgBlockLatency_SN(_avgBlockLatency);
        }
    }, [snDetailData]);

    useEffect(() => {
        if(avgBlockLatency_SN.length){
            let distribution_data: {
                value: number;
                normalDensityZx: number;
            }[] = [];
            const latency_values: number[] = avgBlockLatency_SN.map((v) => v.value)

            const sd = calculateSD(latency_values);
            const mean = calculateMean(latency_values);
            setVariance(calculateVariance(latency_values))
            latency_values.forEach((x, i) => {
                var dp = {value:x,normalDensityZx:NormalDensityZx(x, mean, sd)};
                distribution_data.push(dp);
            });
            const sortedDistribution = distribution_data.sort((a:any,b:any)=> a.value-b.value)
            setDistributionData(sortedDistribution)
        }
    }, [avgBlockLatency_SN]);


    useEffect(() => {
        if(ethDetailData){
            const timeFormat = timeFrame === '1d' ? 'MMM DD, YYYY' : 'MMM DD, YYYY HH:00'
            const _avgBlockLatency: IData[] = ethDetailData.map((item: any) => ({time:dayjs(item?.timestamp*1000).format(timeFormat), value:item?.blockLatency}));
            setAvgBlockLatency_ETH(_avgBlockLatency);
        }
    }, [ethDetailData]);

    useEffect(() => {
        if(avgBlockLatency_ETH){
            setChartLoading(true);
            let _avgBlockLatency: IChartData[] = []
            avgBlockLatency_ETH.forEach((v,i) => {
                let snValue = avgBlockLatency_SN.find((val) => dayjs(val.time).diff(dayjs(v.time),'hour') > -2 && dayjs(val.time).diff(dayjs(v.time),'hour') <=2)
                const _entry: IChartData = {time: timeFrame === '1d' ? dayjs(v.time).format('MMM DD YYYY') : v.time, eth_value:v.value}
                if (snValue){
                    _entry.sn_value = snValue?.value;
                }
                _avgBlockLatency.push(_entry)
            });
            setChartData(_avgBlockLatency.reverse());
                    
           
            setChartLoading(false);
        }
    }, [ avgBlockLatency_ETH, avgBlockLatency_SN ]);

    const handleTimeFrame = (period:string) => {
        setTimeFrame(period)
    }

    return (
        <div>
            <h1 className="text-2xl text-white text-center">Block Creation Time</h1>
            <h1 className="text-lg py-1 text-gray-400 text-center">at scale the STARK prover and verifier are fastest in class</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-8 text-gray-400 drop-shadow-2xl">
                <div className="grid order-4 lg:order-none grid-rows-3 gap-4"> 
                    <div className={`bg-box text-center rounded-lg p-5`}>
                        <span>BlOCK LATENCY (SECONDS)</span>
                        <h1 className='text-gray-300 Robo text-3xl 2xl:text-4xl py-4'>
                            {!snBlockLoading ? 
                                <> {snBlock?.blockLatency.toFixed(2)} </> 
                                :
                                <div className= "flex justify-center">
                                    <SpinnerCircular size={20} thickness={100} speed={118} color="#fff1f2" secondaryColor="#0c4a6e" /> 
                                </div>
                            }
                        </h1>
                    </div>
                        
                    <div className={`row-span-2 bg-box rounded-lg p-5`}>
                        <div className="table-wrp max-h-64 w-full text-sm pr-10">
                        <table className="w-full table-fixed w-full ">
                            <thead className="sticky bg-box top-0">
                                <tr>
                                    <th className="text-start pb-4">BLOCK</th>
                                    <th className="text-end pb-4">LATENCY (sec.)</th>
                                </tr>
                            </thead>

                            <tbody className="h-64 text-white text-lg overflow-y-scroll Robo">
                                {snBlockData?.detail && snBlockData?.detail.map((val:any, key:number) => {
                                    return (
                                            <tr key={key}>
                                                <td className="text-start py-2">#{val?.block_number}</td>
                                                <td className="text-end">{val?.blockLatency}</td>
                                            </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between order-2 lg:order-none py-5 px-0 2xl:p-5 bg-box rounded-lg bg-gradient-to-br from-[#0d1b3d] via-[#081128] to-transparent">
                     <h1 className="text-gray-400 text-lg text-center py-5">AVERAGE BLOCK LATENCY</h1>
                    <LatencyChart data={chartData} isLoading={snDetailLoading && ethDetailLoading && chartLoading} chartDisplay={"blockLatency"} timeFrame={timeFrame}/>
                </div>
                <div className="flex flex-col justify-between order-3 lg:order-none py-5 px-0 2xl:p-5 bg-box rounded-lg bg-gradient-to-br from-[#0d1b3d] via-[#081128] to-transparent">
                    <h1 className="text-gray-400 text-lg text-center py-5">DISTRIBUTION</h1>
                    <div className="flex flex-col">
                        <LatencyChart data={distributionData} isLoading={snDetailLoading && ethDetailLoading && chartLoading} chartDisplay={"distribution"} timeFrame={timeFrame}/>
                        <span className="text-gray-300 text-right font-semibold text-[#fb7185] text-xs py-1 pr-[40px] Robo">VARIANCE: {Numeral(variance).format('0.[0000]a')}</span>
                    </div>
                </div>
                <div className="flex order-last lg:order-none justify-between items-center text-sm">
                    <div>LATEST BLOCK: {snBlock?.block_number}</div> 
                    <div className="hidden xl:block">UPDATED: {lastUpdated} SECONDS AGO</div> 
                    <div className="block xl:hidden">UPDATED: {lastUpdated}s AGO</div> 
                </div>
                <div className="flex order-1 lg:order-none justify-end items-center text-sm lg:col-span-2">
                    <div className="mr-2 ">TIME FRAME</div> 
                    <div onClick={()=>handleTimeFrame('4h')} className={`cursor-pointer mx-2 p-1 ${timeFrame==='4h'?"border border-gray-400 bg-sky-900 text-white rounded-sm":""}`}>4h</div> 
                    <div onClick={()=>handleTimeFrame('1d')} className={`cursor-pointer p-1 ${timeFrame==='1d'?"border border-gray-400 bg-sky-900 text-white rounded-sm":""}`}>1d</div> 
                </div>
            </div>
        </div>
    );
}

// Calculate mean
const calculateMean = (values:number[]) => {
    const mean = (values.reduce((sum, current) => sum + current)) / values.length;
    return mean;
}
  
// Calculate variance
const calculateVariance= (values:number[]) => {
    const average = calculateMean(values);
    const squareDiffs = values.map((value) => {
        const diff = value - average;
        return diff * diff;
    })

    const variance = calculateMean(squareDiffs);
    return variance;
}

// Calculate stand deviation
const calculateSD = (values:number[]) => {
    const variance = calculateVariance(values);
    return  Math.sqrt(variance);
}

// Calculate stand deviation
function NormalDensityZx(x:number, Mean:number, StdDev:number) {
    var a = x - Mean;
    return Math.exp(-(a * a) / (2 * StdDev * StdDev)) / (Math.sqrt(2 * Math.PI) * StdDev);
}