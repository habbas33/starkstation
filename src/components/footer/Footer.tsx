import { NavLink } from "react-router-dom";
import { SiTwitter, SiGithub, SiDiscord } from "react-icons/si";

export default function Footer() {;

    return (
        <nav className="w-full pt-14 2xl:pt-20"> 
            <div className="w-full flex md:justify-center justify-center items-center flex-col text y-8 ">
            <div className="w-full h-[0.1px] bg-sky-900 mb-5" />

            <div className="w-full flex sm:flex-row flex-col justify-end items-center sm:items-start my-4 text-xs text-gray-400 text-center sm:text-start">
                <div className="grid grid-cols-1 sm:my-0">
                    <h1 className="font-semibold">DEVELOPER RESOURCES</h1>
                    <div  className='sm:mt-2'>
                        <div className='my-2 cursur-pointer hover:text-gray-500'>
                            <a href="https://voyager.online/local-version" target="_blank">Local Voyager</a>
                        </div>
                        <div className='my-2 cursur-pointer hover:text-gray-500'>
                            <a href="https://gojuno.xyz/" target="_blank">Juno</a>
                        </div>
                        <div className='my-2 cursur-pointer hover:text-gray-500'>
                            <a href="https://github.com/NethermindEth/warp" target="_blank">Wrap</a>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:px-20 my-4 sm:my-0">
                    <h1 className="font-semibold">STARKNET</h1>
                    <div  className='sm:mt-2'>
                        <div className='my-2 cursur-pointer hover:text-gray-500'>
                            <a href="https://starknet.io/" target="_blank">What is StarkNet?</a>
                        </div>
                        <div className='my-2 cursur-pointer hover:text-gray-500'>
                            <a href="https://docs.starknet.io/" target="_blank">StarkNet Documentation</a>
                        </div>
                        <div className='my-2 cursur-pointer hover:text-gray-500'>
                            <a href="https://docs.starknet.io/docs/CLI/commands/" target="_blank">StarkNet CLI</a>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1">
                    <h1 className="font-semibold">LEGAL</h1>
                    <div  className='sm:mt-2'>
                        <div className='text-start my-2 cursur-pointer hover:text-gray-500'>
                            <NavLink to="/disclaimer">*Disclaimer</NavLink>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-[0.1px] bg-sky-900 my-5" />
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 ">
                    <div className="w-full text-center sm:text-start self-center">
                        <h1 className="text-sm font-normal text-gray-400">Copyright © 2022 StarkStation</h1>
                    </div>
                    <div className="w-full grid grid-cols-1 gap-4 sm:gap-0 text-start sm:text-end">
                        <div className="flex flex-row sm:justify-end justify-center items-center flex-wrap w-full">
                            <div className={`w-8 h-8 rounded-full flex justify-center sm:mx-1 items-center hover:bg-sky-900`}>
                                <a href="https://twitter.com/nethermindeth" target="_blank"><SiTwitter fontSize={18} color="#fff"/></a>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex justify-center sm:mx-1 items-center hover:bg-sky-900`}>
                                <a href="https://github.com/NethermindEth/nethermind" target="_blank"><SiGithub fontSize={18} color="#fff"/></a>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex justify-center sm:x-1 items-center hover:bg-sky-900`}>
                                <a href="https://discord.com/invite/PaCMRFdvWT" target="_blank"><SiDiscord fontSize={18} color="#fff"/></a>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </nav>
    );
}
