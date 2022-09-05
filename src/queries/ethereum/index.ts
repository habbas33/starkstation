import {ethers} from 'ethers';
import axios from 'axios';
import { useQuery } from 'react-query';
const APIKEY = import.meta.env.INFURA_API;

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
      // blocks[0] = {timestamp:currentBlock["timestamp"]*1000 ,txnCount:currentBlock.transactions.length};
      // console.log("done",blocks)
      return blocks;
    }
  
    return useQuery<{ [key in string]: {timestamp:number,txnCount:number} }>('useEthBlocksQuery', fetch);
  };