
import axios from 'axios';
import { useQuery } from 'react-query';
import { VOYGER_ENDPOINT } from '../../constants/globals';

export const useStarkBlocksQuery = () => {
    const fetch = async () => {
      const { data } = await axios.get(`${VOYGER_ENDPOINT}blocks?ps=50&p=1`);
  
      const blocks: { [key in string]: {timestamp:number,txnCount:number} } = {};
      Object.keys(data.items).forEach(blockKey => {
        blocks[blockKey] = {timestamp:data.items[blockKey]["timestamp"]*1000 ,txnCount:data.items[blockKey]["txnCount"]};
      });
      // console.log("stark",data.items[0])
      return blocks;
    };
  
    return useQuery<{ [key in string]: {timestamp:number,txnCount:number} }>('useStarkBlocksQuery', fetch);
  };