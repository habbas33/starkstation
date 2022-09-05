import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import DistributionChart from './DistributionChart';

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

export default function DistributionPanel(props: {
    isLoading:boolean
    data:any
    chain: string
}) {
    const { data, isLoading, chain } = props;
    const [distributionData, setDistributionData] = useState<{ value: number; normalDensityZx: number;}[]>([])
    const [variance, setVariance] = useState<number>(0)

    const distribution_dataM =  useMemo(() => {
        let distribution_data: {
            value: number;
            normalDensityZx: number;
        }[] = [];
        let latency_values:  number[]=[];

        if (Object.keys(data).length >0) {
            Object.keys(data).forEach((k:string) => {
                if (Number(k) < Object.keys(data).length -2){
                    const time_taken = dayjs(data[k].timestamp).diff(dayjs(data[Number(k)+1].timestamp),'seconds');
                    latency_values[k] = time_taken;
                }
            });
        }
        
        if (latency_values.length >0){
            const sd = calculateSD(latency_values);
            const mean = calculateMean(latency_values);
            setVariance(calculateVariance(latency_values))
            latency_values.forEach((x, i) => {
                var dp = {value:x,normalDensityZx:NormalDensityZx(x, mean, sd)};
                distribution_data.push(dp);
            });
        }
        
        
        // console.log(JSON.stringify(distribution_data))
        return distribution_data}, [data]);

    useEffect(() => {
        if (data && Object.keys(distribution_dataM).length>0) {
            const sortedDistribution = distribution_dataM.sort((a:any,b:any)=> a.value-b.value)
            setDistributionData(sortedDistribution)
        }
    }, [data])
   
        
    return (
    <div>
        <DistributionChart data={distributionData} isLoading={isLoading} chain={chain} variance={variance}></DistributionChart>
    </div>
    );
}

