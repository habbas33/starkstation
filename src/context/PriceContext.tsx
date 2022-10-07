import React from 'react';

interface PriceContextInterface {
    ethPrice: number;
    setEthPrice: any;
    ethPriceChange: number;
    setEthPriceChange: any;
}

export const PriceContext = React.createContext<PriceContextInterface>(
    {
        ethPrice: 0,
        setEthPrice: () => {},
        ethPriceChange: 0,
        setEthPriceChange: () => {},
    }   
);

export const PriceContextProvider = ({children}:any) => {
    const [ethPrice, setEthPrice] = React.useState<number>(0);
    const [ethPriceChange, setEthPriceChange] = React.useState<number>(0);
    return (
        <PriceContext.Provider 
            value={{
                ethPrice:ethPrice,
                setEthPrice:setEthPrice,
                ethPriceChange:ethPriceChange,
                setEthPriceChange:setEthPriceChange,
                }}>
            {children}
        </PriceContext.Provider>
    );
}