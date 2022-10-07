import React, { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import { SpinnerCircular } from "spinners-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Numeral from 'numeral';

export default function BlockLatencyChart(props: {
    data:any
    isLoading:boolean
    chain: string
    avgBlockLatency: number
}) {
    const { data,isLoading, chain, avgBlockLatency } = props;

  return (
    <div className={`h-60 w-full drop-shadow-xl w-full ${chain==="ethereum" ? "bg-cyan-900":"bg-cyan-900"} rounded-3xl rounded-2xl p-5 self-end`}>
        <div className="flex justify-between items-center">
            <h1 className="text-gray-300 text-sm"> {chain==="ethereum"?"Ethereum":"StarkNet"}</h1>
            <div className="flex justify-between items-center">
                <h1 className="text-gray-300 text-sm"> Average BlockLatency (last 50 blocks):</h1>
                <h1 className="text-gray-200 font-semibold text-sm pl-1">{isNaN(avgBlockLatency)?"":avgBlockLatency.toFixed(2)} seconds</h1>
            </div>
        </div>
        {!isLoading ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                height={200}
                width={400}
                data={data}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5,
                }}
              >
                 <CartesianGrid strokeDasharray="1  1" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  interval="preserveEnd"
                  fontSize={10}
                  tick={{ fill: "#fff" }}
                  tickFormatter={tick => toNiceDate(tick)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  type="number"
                  orientation="right"
                  tick={{ fill: "#fff" }}
                  tickFormatter={tick => toK(tick)}
                  interval="preserveEnd"
                  fontSize={10}
                />
                <Tooltip
                  cursor={true}
                  active={false}
                  formatter={(val:any) => toK(val)}
                  labelFormatter={label => toNiceDateYear(label)}
                  labelStyle={{ paddingTop: 4, paddingBottom: 4 }}
                  contentStyle={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: '#0369a1',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  wrapperStyle={{ top: -70, left: -10, outline: 'none' }}
                  />
                <Line type="monotone" dataKey="blockLatency" isAnimationActive={false} stroke={chain==='ethereum'?'#0ea5e9':'#fb7185'} dot={false}  />
              </LineChart>
            </ResponsiveContainer>
        ) : (
            <div  className="h-60 w-full flex justify-center">
                <SpinnerCircular
                size={30}
                thickness={200}
                speed={118}
                color="#fff1f2"
                secondaryColor="#0ea5e9" 
                />
            </div>
        )}
    </div>
  );
}


export const toK = (num:any) => {
  return Numeral(num).format('0.[0000]a');
};

export const toNiceDateYear = (date:any) => dayjs(date).format('MMMM DD, YYYY h:mm:ss A');

export const toNiceDate = (date:any) => {
  let x = dayjs(date).format('DD/MM h:mm A');
  return x;
};
