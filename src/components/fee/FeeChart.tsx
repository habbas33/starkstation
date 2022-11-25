import { useState, useEffect, useContext } from 'react';

import dayjs from 'dayjs';
import { SpinnerCircular } from "spinners-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Symbols, Surface } from 'recharts';
import Numeral from 'numeral';
import { AppContext } from '../../context/AppContext';

export default function FeeChart(props: {
    data:any
    isLoading:boolean
    chartDisplay:string
    currency:string
    timeFrame:string
}) {
    const { data, isLoading, chartDisplay, currency, timeFrame } = props;
    const [chartData, setChartData] = useState<any>([])    
    const [legendState, setLegendState] = useState<boolean[]>([true,true,true])

    useEffect(() => {
      if (data) {
        let uniqueTimeFrames:any = [];
        const _chartData = data.filter((item:any) => {
            const sn_value_exists = Object.keys(item).filter((key) => key.includes('sn_value')).length
            const isDuplicate = uniqueTimeFrames.includes(item.time);
            if (!isDuplicate && sn_value_exists) {
                uniqueTimeFrames.push(item.time);
                return true;
            }
            return false;
        })
        setChartData(_chartData)
      }
    }, [data])
    
    const displayUnit = currency.toUpperCase()
    const onlyY0 = legendState.filter(v => v).length === 1;
    
    const handleClick = (index:number) => {
        if (legendState) {
            const _legendState = legendState.map(a => {return a});
            _legendState[index] = !_legendState[index]
            
            if ( _legendState.includes(true)) {
                setLegendState(_legendState);
            }
        } 
    };

    const renderLegend = (props:any) => {
        const { payload } = props;
        return (
          <div className="flex text-xs xs:text-base justify-center items-center ">
            {
              payload.map((entry:any, index:any) => (
                <div onClick={()=>handleClick(index)} key={`item-${index}`} className={`flex justify-center items-center text-[${entry.color}] cursor-pointer hover:bg-gray-900 ${legendState[index]?"":'opacity-25'} rounded-md mx-1 px-1`}>
                    <Surface width={14} height={14}>
                        <Symbols cx={7} cy={8} type={entry.type} size={60} fill={entry.color} />
                    </Surface>
                    <span className="pl-1">{entry.value}</span>
                </div>
              ))
            }
          </div>
        );
    }

    return (
        <div className={`h-[300px] 2xl:h-[400px] drop-shadow-xl w-full rounded-3xl rounded-2xl  self-end`}>
            {!isLoading && data.length ? (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    height={400}
                    width={400}
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 5,
                        left: 5,
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
                        dataKey= {!legendState[1] && legendState[0] ? "sn_value" : !legendState[1] ? "percent_change" : "eth_value" }
                        axisLine={true}
                        tickLine={false}
                        type="number"
                        orientation="right"
                        tickFormatter={tick => onlyY0 && legendState[2] ? toK_percent(tick):toK(tick)}
                        interval="preserveEnd"
                        fontSize={10}
                        fontFamily='Roboto Mono, monospace'
                        stroke="#81cefa"
                        padding={{ top: 20, bottom: 5 }}
                    />
                    <YAxis
                        yAxisId={1}
                        hide= {onlyY0}
                        dataKey={legendState[2]?"percent_change":"sn_value"}
                        domain={legendState[2]?[0, 1]:[0, 'auto']}
                        axisLine={true}
                        tickLine={false}
                        type="number"
                        orientation="left"
                        tickFormatter={tick => legendState[2]? toK_percent(tick): toK(tick)}
                        interval="preserveStartEnd"
                        fontSize={10}
                        fontFamily='Roboto Mono, monospace'
                        stroke="#81cefa"
                        padding={{ top: 20, bottom: 5 }}
                    />
                    <Tooltip
                        cursor={true}
                        active={false}
                        //@ts-ignore
                        content={<CustomTooltip timeFrame={timeFrame} displayUnit={displayUnit} legendState={legendState}/>}
                        wrapperStyle={{ top: -70, left: -10, outline: 'none' }}
                    />
                    <Legend content={renderLegend}/>
                    <Line type="monotone" yAxisId={legendState[2]?0:1} hide={!legendState[0]} name="on Starknet" dataKey="sn_value" animationDuration={500} isAnimationActive={true} legendType="star" stroke={'#fb7185'} strokeWidth={2} dot={false}  />
                    <Line type="monotone" yAxisId={0} hide={!legendState[1]} name="on Ethereum" dataKey="eth_value" animationDuration={500} isAnimationActive={true} legendType="diamond" stroke={'#23a6f1'} strokeWidth={2} dot={false}  />
                    <Line type="monotone" yAxisId={onlyY0?0:1} hide={!legendState[2]} name="L2 vs L1" dataKey="percent_change" animationDuration={500} isAnimationActive={true} legendType="wye" stroke={'#b9b72b'} strokeDasharray="5 5" strokeWidth={1} dot={false}  />
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

const CustomTooltip = (props:{ active:any, payload:any, label:any, timeFrame:string, displayUnit:string, legendState:boolean[] }) => {
    const {active, payload, label, timeFrame, displayUnit, legendState} = props;
    const { network } = useContext(AppContext)
    if (active && payload && payload.length) {
        const date = toNiceDateYear(label, timeFrame)
        const snValue = toNiceValue(payload[0]?.value, displayUnit, network)
        const ethValue = toNiceValue(payload[legendState[0] && legendState[1] ? 1 : 0]?.value, displayUnit, network)
        const l2vsl1 = toK_percent_float(payload[legendState[0] && legendState[1] ? 2 : !legendState[0] && !legendState[1] ? 0 : 1]?.value)
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
          {legendState[0] && <p style={{ paddingTop: 4, paddingBottom: 4 }} className="text-[#fb7185]">{`on Starknet : ${snValue}`}</p>}
          {legendState[1] && <p style={{ paddingTop: 4, paddingBottom: 4 }} className="text-[#23a6f1]">{`on Ethereum : ${ethValue}`}</p>}
          {legendState[2] && <p style={{ paddingTop: 4, paddingBottom: 4 }} className="text-[#b9b72b]">{`L2 vs L1 : ${l2vsl1}`}</p>}
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