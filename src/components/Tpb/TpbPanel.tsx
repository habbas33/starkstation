import React, { useState, useEffect } from 'react';

import TpbChart from './TpbChart';


export default function TpbPanel(props: {
    isLoading:boolean
    data:any
    chain: string
}) {
    const { data, isLoading, chain } = props;
    const [tpbData, setTpbData] = useState<{ time: number; txnCount: number;}[]>([])
    const [avgTpb, setAvgTpb] = useState<number>(0)

    useEffect(() => {
        if (data) {
            let tpb_data: {
                time: number;
                txnCount: number;
            }[] = [];
            Object.keys(data).forEach((k:string) => {
                tpb_data[k] = {
                time: data[k].timestamp, 
                txnCount: data[k].txnCount,
                };
            });
            setTpbData(tpb_data.reverse())
            const avg = tpb_data.reduce((r, c) => r + c.txnCount, 0) / tpb_data.length;
            setAvgTpb(avg)
        }
    }, [data])
   
        
    return (
    <div>
        <TpbChart data={tpbData} isLoading={isLoading} chain={chain} avgTpb={avgTpb}></TpbChart>
    </div>
    );
}

