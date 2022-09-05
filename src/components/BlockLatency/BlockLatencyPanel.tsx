import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import BlockLatencyChart from './BlockLatencyChart';


export default function BlockLatencyPanel(props: {
    isLoading:boolean
    data:any
    chain: string
}) {
    const { data, isLoading, chain } = props;
    const [blockLatencyData, setBlockLatencyData] = useState<{ time: number; blockLatency: number;}[]>([])
    const [avgBlockLatency, setAvgBlockLatency] = useState<number>(0)

    const blockLatency_dataM =  useMemo(() => {
        let blockLatency_data: {
            time: number;
            blockLatency: number;
        }[] = [];
        if (Object.keys(data).length >0) {
            Object.keys(data).forEach((k:string) => {
                if (Number(k) < Object.keys(data).length -2){
                    const time_taken = dayjs(data[k].timestamp).diff(dayjs(data[Number(k)+1].timestamp),'seconds');
                    
                    blockLatency_data[k] = {
                        time: data[k].timestamp,
                        blockLatency: time_taken,
                        };
                }
            });
        }
        return blockLatency_data}, [data]);

    useEffect(() => {
        if (data) {
            setBlockLatencyData(blockLatency_dataM.reverse())
            const avg = blockLatency_dataM.reduce((r, c) => r + c.blockLatency, 0) / blockLatency_dataM.length;
            setAvgBlockLatency(avg);
        }
    }, [data])
  
        
    return (
    <div>
        <BlockLatencyChart data={blockLatencyData} isLoading={isLoading} chain={chain} avgBlockLatency={avgBlockLatency}></BlockLatencyChart>
    </div>
    );
}

