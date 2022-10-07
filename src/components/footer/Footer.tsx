import React, {useState, useEffect} from "react";
import { SiTwitter, SiGithub, SiDiscord, SiGitbook } from "react-icons/si";

export default function Footer() {;

    return (
        <nav className="w-full pt-14 2xl:pt-20"> 
            <div className="w-full flex md:justify-center justify-center items-center flex-col  y-4 ">
                <div className="sm:w-[100%] w-full h-[0.1px] bg-sky-900 " />
                
                <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
                    <div className="flex min-w-max flex-[0.3] justify-center sm:items-center">
                        <h1 className="text-white font-normal">  Copyright © 2022 StarkStation</h1>
                    </div>

                    <div className="flex flex-[0.4] justify-center items-center flex-wrap sm:mt-0 mt-5 w-full"></div>
                        <div className="flex flex-row sm:justify-end justify-center items-center flex-wrap w-full">
                            <div className={`w-8 h-8 rounded-full flex justify-center mx-1 items-center hover:bg-sky-900`}>
                                <a href="https://twitter.com/nethermindeth" target="_blank"><SiTwitter fontSize={18} color="#fff"/></a>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex justify-center mx-1 items-center hover:bg-sky-900`}>
                                <a href="https://github.com/NethermindEth/nethermind" target="_blank"><SiGithub fontSize={18} color="#fff"/></a>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex justify-center mx-1 items-center hover:bg-sky-900`}>
                                <a href="https://discord.com/invite/PaCMRFdvWT" target="_blank"><SiDiscord fontSize={18} color="#fff"/></a>
                            </div>
                        </div>
                </div>
            </div>
        </nav>
    );
}
