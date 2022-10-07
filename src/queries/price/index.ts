import { useQuery } from 'react-query';
import axios from 'axios';
import { COIN_GECKO_ENDPOINT_ETH_PRICE } from '../../constants/globals';

export const useEthPriceQuery = () => {

    const fetch = async () => {
        const { data } = await axios.get(COIN_GECKO_ENDPOINT_ETH_PRICE);
        const ethUsdPrice: number = data.ethereum.usd;
        const priceChange: number = data.ethereum.usd_24h_change;
        // console.log("price", data)
        return {price:ethUsdPrice, price_change:priceChange };
    }
  
    return useQuery<{ price:number, price_change:number} >('useEthPriceQuery', fetch ,  {
        refetchInterval: 10000,
      });
  };