
import { useContext, useEffect } from "react";
import { MdOutlineLocalGasStation } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";
import { PriceContext } from '../../context/PriceContext';
import { useEthPriceQuery } from '../../queries/price';

export default function Navbar() {
  const { data:price, isLoading:isLoading } = useEthPriceQuery()
  const { setEthPriceChange, setEthPrice } = useContext(PriceContext)
  const priceChange = price?.price_change ? 
  price?.price_change > 0 ? `(+${price?.price_change.toFixed(1)}%)`
  : `(${price?.price_change.toFixed(1)}%)`
  : 'Loading'
  const priceColor = price?.price_change ? price?.price_change >= 0 ? "text-green-400" : "text-red-500":"text-green-500";

  useEffect(() => {
    if (price){
      setEthPrice(price?.price)
      setEthPriceChange(price?.price_change)
    }
    
  }, [price])
  
  return (
    <nav className="w-full ">
        <div className="flex justify-between items-center w-full">
          <NavLink to={`/`}>
            <div className="flex flex-initial justify-between items-center">
                <MdOutlineLocalGasStation className="text-3xl text-white cursor-pointer"/>
                <h1 className="text-2xl text-white tracking-wide font-bold px-1">StarkStation</h1>
            </div>
          </NavLink>
            {!isLoading ? (
              <div className="min-w-[182px] flex flex-initial justify-between items-center p-2 bg-box rounded-md">
                <FaEthereum className="text-md text-sky-800"/>
                <span className="text-sm text-white font-thin px-1 Robo">{price?.price.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                <span className="text-sm text-sky-800 font-bold px-1 Robo">USD </span>
                <h1 className={`text-sm text-white px-1 Robo ${priceColor}`}>{priceChange}</h1>
              </div>
            ):(
              <div className="min-w-[182px] flex flex-initial justify-center items-center p-2 bg-box rounded-md">
                 <SpinnerCircular size={14} thickness={50} speed={118} color="#fff1f2" secondaryColor="#0ea5e9" />
              </div>
            )}
      </div>
    </nav>
  );
}
