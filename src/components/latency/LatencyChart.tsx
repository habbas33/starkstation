import { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import { SpinnerCircular } from "spinners-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Numeral from 'numeral';

export default function LatencyChart(props: {
    data:any
    isLoading:boolean
    chartDisplay:string
    timeFrame:string
}) {
    const { data, isLoading, chartDisplay, timeFrame } = props;
    const [chartData, setChartData] = useState<any>([])
    const isLatencyChart = chartDisplay === "blockLatency";
    
    useEffect(() => {
        if (data) {
            let uniqueData:any = [];
            const _chartData = data.filter((item:any) => {
                const isDuplicate = uniqueData.includes(isLatencyChart?item.time:item.value);
                if (!isDuplicate) {
                    uniqueData.push(item.time);
                    return true;
                }
                return false;
            })
            setChartData(_chartData)
        }
    }, [data])
    
    const rightMargin = isLatencyChart ? 5 : 40;
    return (
        <div className={`h-[300px] drop-shadow-xl w-full rounded-3xl rounded-2xl  self-end`}>
            {!isLoading && data.length ? (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    height={400}
                    width={400}
                    data={chartData}
                    margin={{
                    top: 5,
                    right: rightMargin,
                    left: 40,
                    bottom: 5,
                    }}
                >
                    <XAxis
                    dataKey={isLatencyChart?"time":"value"}
                    tickLine={false}
                    axisLine={true}
                    interval="preserveEnd"
                    fontSize={10}
                    fontFamily='Roboto Mono, monospace'
                    stroke="#81cefa"
                    tickFormatter={tick => isLatencyChart ? toNiceDate(tick, timeFrame): toK(tick)}
                    padding={{ left: 20, right: 20 }}
                    />
                    {isLatencyChart &&
                    <YAxis
                        axisLine={true}
                        tickLine={false}
                        type="number"
                        orientation="right"
                        tickFormatter={tick => toK(tick)}
                        interval="preserveEnd"
                        fontSize={10}
                        fontFamily='Roboto Mono, monospace'
                        stroke="#81cefa"
                        padding={{ top: 20, bottom: 5 }}
                        />
                    }
                    <Tooltip
                    cursor={true}
                    active={false}
                    formatter={(val:any) => isLatencyChart ? toNiceValue(val,"sec") : []}
                    labelFormatter={label => isLatencyChart ? toNiceDateYear(label,timeFrame) :  toNiceValue(label,"sec")}
                    labelStyle={{ paddingTop: 4, paddingBottom: 4 }}
                    contentStyle={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '2px solid #DDD',
                        backgroundColor: '#081128',
                        color: '#fff',
                        fontSize: '12px',
                    }}
                    wrapperStyle={{ top: -70, left: -10, outline: 'none' }}
                    />
                    {isLatencyChart &&<Legend />}
                    <Line type="monotone" name={ isLatencyChart ?"on Starknet":""} dataKey={isLatencyChart ?"sn_value" : "normalDensityZx"} animationDuration={500} isAnimationActive={true} legendType={ isLatencyChart ?"star":"none"} stroke={'#fb7185'} strokeWidth={2} dot={false}  />
                    {isLatencyChart && <Line type="monotone" name="on Ethereum" dataKey="eth_value" animationDuration={500} isAnimationActive={true} legendType="diamond" stroke={'#23a6f1'} strokeWidth={2} dot={false}  />}
                </LineChart>
                </ResponsiveContainer>
            ) : (
                <div  className="h-full w-full flex justify-center">
                    <SpinnerCircular
                    size={30}
                    thickness={200}
                    speed={118}
                    color="#fff1f2"
                    secondaryColor="#0c4a6e" 
                    />
                </div>  
            )}
        </div>
    );
}


export const toK = (num:any) => {
  return Numeral(num).format('0.[0000]a');
};

export const toNiceValue = (num:any,unit:string) => {
    return (Numeral(num).format('0.[0000]a').concat(" ",unit));
};

export const toNiceDateYear = (date:any, timeFrame:string) => {
    let x = timeFrame === '1d' ? dayjs(date).format('MMM DD, YYYY'):  dayjs(date).format('MMM DD, YYYY h:mm A');
    return x;
};

export const toNiceDate = (date:any, timeFrame:string) => {
  let x = timeFrame === '1d' ? dayjs(date).format('DD/MM'):  dayjs(date).format('DD/MM HH:mm');
  return x;
};
