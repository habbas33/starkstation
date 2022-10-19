import React from 'react';

interface AppContextInterface {
    network: string;
    setNetwork: any;
}

export const AppContext = React.createContext<AppContextInterface>(
    {
        network: "mainnet",
        setNetwork: () => {},
    }   
);

export const AppContextProvider = ({children}:any) => {
    const [network, setNetwork] = React.useState<string>("mainnet");
    return (
        <AppContext.Provider 
            value={{
                network:network,
                setNetwork:setNetwork,
                }}>
            {children}
        </AppContext.Provider>
    );
}