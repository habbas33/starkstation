import { useState, useEffect, useContext } from 'react';

import dayjs from 'dayjs';
import { SpinnerCircular } from "spinners-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Numeral from 'numeral';
import { AppContext } from '../../context/AppContext';

export default function BridgeChart(props: {
    data:any
    isLoading:boolean
    chartDisplay:string
    currency:string
    timeFrame:string
}) {
    const { data, isLoading, chartDisplay, currency, timeFrame } = props;
    const [chartData, setChartData] = useState<any>([])
    useEffect(() => {
      if (data) {
        let uniqueTimeFrames:any = [];
        const _chartData = data.filter((item:any) => {
            const sn_value_exists = chartDisplay === 'deposit' ? true : Object.keys(item).filter((key) => key.includes('sn_value')).length
            const isDuplicate = uniqueTimeFrames.includes(item.time);
            if (!isDuplicate && sn_value_exists) {
                uniqueTimeFrames.push(item.time);
                return true;
            }
            return false;
        })
        // console.log(_chartData)
        setChartData(_chartData)
      }
    }, [data])
    
    const displayUnit = currency.toUpperCase()
    return (
        <div className={`h-[240px] 2xl:h-[400px] drop-shadow-xl w-full rounded-3xl rounded-2xl  self-end`}>
            {!isLoading && data.length ? (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    height={400}
                    width={400}
                    data={chartData}
                    margin={{
                    top: 5,
                    right: 5,
                    left: 45,
                    bottom: 5,
                    }}
                >
                    <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={true}
                    interval="preserveEnd"
                    fontSize={10}
                    fontFamily='Roboto Mono, monospace'
                    stroke="#81cefa"
                    label="time"
                    tickFormatter={tick => toNiceDate(tick, timeFrame)}
                    padding={{ left: 20, right: 20 }}
                    />
                    <YAxis
                    yAxisId={0}
                    dataKey={chartDisplay ==='withdraw' ?"total_value":"eth_value"}
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
                    <Tooltip
                    cursor={true}
                    active={false}
                    //@ts-ignore
                    content={<CustomTooltip timeFrame={timeFrame} displayUnit={displayUnit} chartDisplay={chartDisplay}/>}
                    wrapperStyle={{ top: -70, left: -10, outline: 'none' }}
                    />
                    <Legend />
                    {chartDisplay ==='withdraw' && <Line type="monotone" yAxisId={0} name="Initiate Withdraw" dataKey="sn_value" animationDuration={500} isAnimationActive={true} legendType="star" stroke={'#fb7185'} strokeDasharray="5 5" strokeWidth={2} dot={false}  />}
                    <Line type="monotone" yAxisId={0} name={chartDisplay ==='withdraw'?'Starkgate Withdraw':'Starkgate Deposit'} dataKey="eth_value" animationDuration={500} isAnimationActive={true} legendType="diamond" stroke={chartDisplay ==='withdraw' ?'#98c3db':'#23a6f1'} strokeDasharray= {chartDisplay ==='withdraw' ? "5 5" : ""} strokeWidth={2} dot={false}  />
                    {chartDisplay ==='withdraw' && <Line type="monotone" yAxisId={0} name="Total" dataKey="total_value" animationDuration={500} isAnimationActive={true} legendType="wye" stroke={'#23a6f1'} strokeWidth={2} dot={false}  />}
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

const CustomTooltip = (props:{ active:any, payload:any, label:any, timeFrame:string, displayUnit:string, chartDisplay:string }) => {
    const {active, payload, label, timeFrame, displayUnit, chartDisplay} = props;
    const { network } = useContext(AppContext)
    if (active && payload && payload.length) {
        const date = toNiceDateYear(label, timeFrame)
        const value1 = toNiceValue(payload[0]?.value, displayUnit, network)
        const value2 = chartDisplay === 'deposit' ? '0': toNiceValue(payload[1]?.value, displayUnit, network)
        const total = chartDisplay === 'deposit'? '0': toNiceValue(payload[2]?.value, displayUnit, network)
      return (
        <div className="custom-tooltip" style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '2px solid #DDD',
                backgroundColor: '#081128',
                color: '#fff',
                fontSize: '12px',
            }}>
          <p style={{ paddingTop: 4, paddingBottom: 4 }}>{date}</p>
          {chartDisplay === 'deposit' ? (
            <p style={{ paddingTop: 4, paddingBottom: 4 }} className="text-[#23a6f1]">{`Starkgate Deposit : ${value1}`}</p>
          ) : (
            <>
                <p style={{ paddingTop: 4, paddingBottom: 4 }} className="text-[#fb7185]">{`Initiate Withdraw : ${value1}`}</p>
                <p style={{ paddingTop: 4, paddingBottom: 4 }} className="text-[#98c3db]">{`Starkgate Withdraw : ${value2}`}</p>
                <p style={{ paddingTop: 4, paddingBottom: 4 }} className="text-[#23a6f1]">{`Total Fee: ${total}`}</p>
            </>
          )}
        </div>
      );
    }
  
    return null;
  };

export const toK = (num:any) => {
  return Numeral(num).format('0.[000000]a');
};

export const toK_percent = (num:any) => {
    return Numeral(num*100).format('0 a').concat(" %");
};

export const toK_percent_float = (num:any) => {
    return Numeral(num*100).format('0.[0000] a').concat(" %");
};

export const toNiceValue = (num:any,unit:string,network:string) => {
    if(network === 'goerli'){
    return (num.toFixed(9).concat(" ",unit));
    } else {
        return (Numeral(num).format('0.[000000]a').concat(" ",unit));
    }
};

export const toNiceDateYear = (date:any, timeFrame:string) => {
    let x = timeFrame === '1d' ? dayjs(date).format('MMM DD, YYYY'):  dayjs(date).format('MMM DD, YYYY h:mm A');
    return x;
};

export const toNiceDate = (date:any, timeFrame:string) => {
  let x = timeFrame === '1d' ? dayjs(date).format('DD/MM'):  dayjs(date).format('DD/MM HH:mm');
  return x;
};