import axios from 'axios';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { VOYGER_ENDPOINT, STARKSTAION_API_ENDPOINT } from '../../constants/globals';

const headers = {
  "Content-Type": "application/json",
};

export const useStarkBlocksQuery = () => {
  const fetch = async () => {
    const { data } = await axios.get(`${VOYGER_ENDPOINT}blocks?ps=50&p=1`);

    const blocks: { [key in string]: {timestamp:number,txnCount:number} } = {};
    Object.keys(data.items).forEach(blockKey => {
      blocks[blockKey] = {timestamp:data.items[blockKey]["timestamp"]*1000 ,txnCount:data.items[blockKey]["txnCount"]};
    });
    return blocks;
  };

  return useQuery<{ [key in string]: {timestamp:number,txnCount:number} }>('useStarkBlocksQuery', fetch);
};

export const useSnBlockQuery = () => {
  const fetch = async () => {
    let { data } = await axios.get(`${STARKSTAION_API_ENDPOINT}stark/detail?limit=12`, {headers});
    // let { data } = await axios.get(`/api/stark/detail?limit=12`, {headers});
    return {detail:data, lastUpdated: dayjs()};
  };
  return useQuery<{ detail:{[key in string]: any}, lastUpdated:any }>('useSnBlockQuery', fetch,  {
    refetchInterval: 60000,
  });
};

export const useSnDetailQuery4h = () => {
  const fetch = async () => {
    const { data } = await axios.get(`${STARKSTAION_API_ENDPOINT}stark/detail?period=4h`, {headers});
    // const { data } = await axios.get(`/api/stark/detail?period=4h`, {headers});
    return data;
  };
  return useQuery<{ [key in string]: any }>('useSnDetailQuery4h', fetch);
};

export const useSnDetailQuery1d = () => {
  const fetch = async () => {
    const { data } = await axios.get(`${STARKSTAION_API_ENDPOINT}stark/detail?period=24h`, {headers});
    // const { data } = await axios.get(`/api/stark/detail?period=24h`, {headers});
    return data;
  };
  return useQuery<{ [key in string]: any }>('useSnDetailQuery1d', fetch);
};