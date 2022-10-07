import {ethers} from 'ethers';
import axios from 'axios';
import { useQuery } from 'react-query';
const APIKEY = import.meta.env.INFURA_API;
import { STARKSTAION_API_ENDPOINT } from '../../constants/globals';

export const useEthBlocksQuery = () => {
    const provider = new ethers.providers.InfuraProvider(
      'mainnet',
      APIKEY
    );
    const fetch = async () => {
      const currentBlock = await provider.getBlock("latest");

      const blocks: { [key in string]: {timestamp:number,txnCount:number} } = {};
      // console.log("eth",currentBlock)
      if (currentBlock.number !== null) { //only when block is mined not pending
        const promises = [];
        for (let i = 0; i<50; i++) {
          promises.push(provider.getBlock(currentBlock.number-i));
        }
        Promise.all(promises).then ((results)=>{
            
            Object.keys(results).forEach((blockKey:any) => {
              blocks[blockKey] = {timestamp:results[blockKey]["timestamp"]*1000 ,txnCount:results[blockKey].transactions.length};
            });
        }) 
      } 
      return blocks;
    }
  
    return useQuery<{ [key in string]: {timestamp:number,txnCount:number} }>('useEthBlocksQuery', fetch);
  };

  export const useEthDetailQuery4h = () => {
    const fetch = async () => {
      const { data } = await axios.get(`${STARKSTAION_API_ENDPOINT}eth/detail?period=4h`);
      return data;
    };
    return useQuery<{ [key in string]: any }>('useEthDetailQuery4h', fetch);
  };

  export const useEthDetailQuery1d = () => {
    const fetch = async () => {
      const { data } = await axios.get(`${STARKSTAION_API_ENDPOINT}eth/detail?period=24h`);
      return data;
    };
    return useQuery<{ [key in string]: any }>('useEthDetailQuery1d', fetch);
  };