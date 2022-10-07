import React, {useContext, useState, useEffect} from 'react'
import { useSnDetailQuery4h, useSnDetailQuery1d, useSnBlockQuery } from '../queries/starkNet';
import { useEthDetailQuery4h, useEthDetailQuery1d } from '../queries/ethereum';
import { FeePanel } from '../components/fee';
import { TxnsPanel } from '../components/transactions';
import { LatencyPanel } from '../components/latency';

const Main: React.FC = () => {
    const {isLoading:snBlockLoading, data:snBlockData} = useSnBlockQuery();
    const {isLoading:snDetailLoading_4h, data:snDetailData_4h} = useSnDetailQuery4h();
    const {isLoading:ethDetailLoading_4h, data:ethDetailData_4h} = useEthDetailQuery4h();
    const {isLoading:snDetailLoading_1d, data:snDetailData_1d} = useSnDetailQuery1d();
    const {isLoading:ethDetailLoading_1d, data:ethDetailData_1d} = useEthDetailQuery1d();
    const [timeFrame_feePanel, setTimeFrame_feePanel] = useState<string>('4h');
    const [timeFrame_txnsPanel, setTimeFrame_txnsPanel] = useState<string>('4h');

    return (
        <div className="min-h-screen">
            <div className="py-14 2xl:py-20">
                <FeePanel ethDetailLoading = {timeFrame_feePanel === '4h' ? ethDetailLoading_4h : ethDetailLoading_1d } 
                    ethDetailData = {timeFrame_feePanel === '4h' ? ethDetailData_4h : ethDetailData_1d } 
                    snDetailLoading = {timeFrame_feePanel === '4h' ? snDetailLoading_4h : snDetailLoading_1d } 
                    snDetailData = {timeFrame_feePanel === '4h' ? snDetailData_4h : snDetailData_1d } 
                    snBlockData = {snBlockData} 
                    snBlockLoading = {snBlockLoading}
                    timeFrame = {timeFrame_feePanel}
                    setTimeFrame = {setTimeFrame_feePanel}
                />
            </div>
            <div className="py-14 2xl:py-20">
                <TxnsPanel ethDetailLoading = {timeFrame_txnsPanel === '4h' ? ethDetailLoading_4h : ethDetailLoading_1d } 
                    ethDetailData = {timeFrame_txnsPanel === '4h' ? ethDetailData_4h : ethDetailData_1d } 
                    snDetailLoading = {timeFrame_txnsPanel === '4h' ? snDetailLoading_4h : snDetailLoading_1d } 
                    snDetailData = {timeFrame_txnsPanel === '4h' ? snDetailData_4h : snDetailData_1d } 
                    snBlockData = {snBlockData} 
                    snBlockLoading = {snBlockLoading}
                    timeFrame = {timeFrame_txnsPanel}
                    setTimeFrame = {setTimeFrame_txnsPanel}
                />
            </div>
            <div className="py-14 2xl:py-20">
                <LatencyPanel ethDetailLoading = {timeFrame_txnsPanel === '4h' ? ethDetailLoading_4h : ethDetailLoading_1d } 
                    ethDetailData = {timeFrame_txnsPanel === '4h' ? ethDetailData_4h : ethDetailData_1d } 
                    snDetailLoading = {timeFrame_txnsPanel === '4h' ? snDetailLoading_4h : snDetailLoading_1d } 
                    snDetailData = {timeFrame_txnsPanel === '4h' ? snDetailData_4h : snDetailData_1d } 
                    snBlockData = {snBlockData} 
                    snBlockLoading = {snBlockLoading}
                    timeFrame = {timeFrame_txnsPanel}
                    setTimeFrame = {setTimeFrame_txnsPanel}
                />
            </div>
        </div>
    );
}

export default Main;