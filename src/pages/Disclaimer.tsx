import React from 'react'

const Disclaimer: React.FC = () => {
    return (
        <div className="pt-14 2xl:pt-20">
            <div className="rounded-lg drop-shadow-xl bg-box py-14 px-10 sm:px-20 2xl:px-60 text-gray-200">
                <div className="text-left font-bold text-xl sm:text-2xl">
                    DISCLAIMER
                </div>
                <div className="py-10 text-gray-300 leading-relaxed text-sm sm:text-base">
                    <p>
                        All Markets and Exchange data and information is provided “as is” for informational purposes only, and is not intended for trading purposes or financial, investment, tax, legal, accounting or other advice. It is for your general information only, procured from third party sources. Any use or reliance on the Markets and Exchange data and information is solely at your own risk and direction. Trading is a highly risk activity that can lead to major losses. Please consult your broker or financial representative to verify pricing before executing any trade.
                        Demerzel Solutions Ltd is not an investment adviser, financial adviser or a securities broker. None of the Markets and Exchange data and information constitutes investment advice nor an offering, recommendation or solicitation by Demerzel Solutions Ltd to buy, sell or hold any security or financial product. Demerzel Solutions Ltd makes no representation (and has no opinion) regarding the advisability or suitability of any investment.
                    </p>
                    <p className="pt-5">
                        Demerzel Solutions Ltd is not an investment adviser, financial adviser or a securities broker. None of the Markets and Exchange data and information constitutes investment advice nor an offering, recommendation or solicitation by Demerzel Solutions Ltd to buy, sell or hold any security or financial product. Demerzel Solutions Ltd makes no representation (and has no opinion) regarding the advisability or suitability of any investment.
                    </p>
                    <p className="pt-5">
                        <span className="font-semibold">All Markets and Exchange data and information is provided by the CoinGecko API. </span>Demerzel Solutions Ltd does not verify such data and disclaims any obligation to do so.
                    </p>
                    <p className="pt-5">
                        Collection of Ethereum block rewards is powered by Etherscan API, which is provided by Etherscan as a community service and without warranty. Demerzel Solutions Ltd does not verify such data and disclaims any obligation to do so.
                    </p>
                    <p className="pt-5">
                        Demerzel Solutions Ltd cannot guarantee the accuracy of the exchange rates displayed. You should confirm current rates before making any transactions that could be affected by changes in the exchange rates.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Disclaimer;