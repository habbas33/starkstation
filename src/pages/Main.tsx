import React, {useContext, useState, useEffect} from 'react'
import { useStarkBlocksQuery } from '../queries/starkNet';
import { useEthBlocksQuery } from '../queries/ethereum';
import { TpbPanel } from '../components/Tpb'
import { TpsPanel } from '../components/Tps'
import { BlockLatencyPanel } from '../components/BlockLatency'
import { DistributionPanel } from '../components/Distribution'

const Main: React.FC = () => {
  const {isLoading:stark_Loading, data:stark_data} = useStarkBlocksQuery();
  const {isLoading:eth_Loading, data:eth_data} =useEthBlocksQuery();
  const [ethData, setETHData] = useState<{ [key in string]: {timestamp:number,txnCount:number} }>({ [0]: {timestamp:0,txnCount:0} })
  const [starkData, setStarkData] = useState<{ [key in string]: {timestamp:number,txnCount:number} }>({ [0]: {timestamp:0,txnCount:0} })
  
  const [isEthLoading, setIsEthLoading] = useState<boolean>(true)
  
  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  }
  
  useEffect(() => {
      if (eth_data) {
        setIsEthLoading(true);
        const setthis = async() =>{
          await timeout(1000);
          setETHData(eth_data)
          setIsEthLoading(false);
        }
        setthis();
      }
  }, [eth_Loading])

  useEffect(() => {
    if (stark_data) {
      const setthis = async() =>{
        await timeout(100);
        setStarkData(stark_data)
      }
      setthis();
    }
}, [stark_Loading])

  const clickHandle = () => {
    console.log("maindata",ethData)  
  }

  return (
    <div className="min-h-screen bg-sky-900">
      <div className="py-10">
        <h1 className="text-white text-center pt-8 pb-2">Transactions Per Block (TPB) </h1>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <TpbPanel isLoading={stark_Loading} data={starkData} chain={"starkware"}/>
          <TpbPanel isLoading={isEthLoading} data={ethData} chain={"ethereum"}/>
        </div>
        
        <h1 onClick={clickHandle} className="text-white text-center pt-8 pb-2">Transactions Per Second (TPS) </h1>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <TpsPanel isLoading={stark_Loading} data={starkData} chain={"starkware"}/>
          <TpsPanel isLoading={isEthLoading} data={ethData} chain={"ethereum"}/>
        </div>

        <h1 onClick={clickHandle} className="text-white text-center pt-8 pb-2">BlockLatency (in sec) </h1>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <BlockLatencyPanel isLoading={stark_Loading} data={starkData} chain={"starkware"}/>
          <BlockLatencyPanel isLoading={isEthLoading} data={ethData} chain={"ethereum"}/>
        </div>
        
        <h1 onClick={clickHandle} className="text-white text-center pt-8 pb-2">Normal Distribution</h1>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <DistributionPanel isLoading={stark_Loading} data={starkData} chain={"starkware"}/>
          <DistributionPanel isLoading={isEthLoading} data={ethData} chain={"ethereum"}/>
        </div>
      </div>
    </div>
  );
}

export default Main;