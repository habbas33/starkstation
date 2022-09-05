import React, { useState, useEffect, useCallback,useMemo } from 'react';
import TpsChart from './TpsChart';
import dayjs from 'dayjs';

export default function TpsPanel(props: {
    isLoading:boolean
    data:{ [key in string]: {timestamp:number,txnCount:number} }
    chain:string
}) {
    const { data, isLoading, chain } = props;
    const [tpsData, setTpsData] = useState<{ time: number; tps: number;}[]>([])
    const [avgTps, setAvgTps] = useState<number>(0)
            
    const tps_dataM =  useMemo(() => {
        let tps_data: {
            time: number;
            tps: number;
        }[] = [];
        if (Object.keys(data).length >0) {
            Object.keys(data).forEach((k:string) => {
                if (Number(k) < Object.keys(data).length -2){
                    const time_taken = dayjs(data[k].timestamp).diff(dayjs(data[Number(k)+1].timestamp),'seconds');
                    const tx_count = data[k].txnCount;
                    
                    tps_data[k] = {
                        time: data[k].timestamp,
                        tps: tx_count/time_taken,
                        };
                }
            });
        }
        return tps_data}, [data]);

    useEffect(() => {
        if (data) {
            setTpsData(tps_dataM.reverse())
            const avg = tps_dataM.reduce((r, c) => r + c.tps, 0) / tps_dataM.length;
            setAvgTps(avg);
            
        }
    }, [data])
            
    return (
    <div>
        <TpsChart  data={tpsData} isLoading={isLoading} chain={chain} avgTps={avgTps}></TpsChart>
    </div>
    );
}
