import { Outlet } from "react-router-dom";
import NavBar from "../Components/Layout/NavBar";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [minimize, setMinimize] = useState<boolean>(false)
    function handleMinimize() {
        if (minimize) {
            setMinimize(false)
        } else {
            setMinimize(true)
        }
    }
    return (
        <main className="bg-schin-black w-screen h-screen flex flex-row relative">
           
            <button onClick={() => handleMinimize()} className={` w-15 h-15 border-3  border-schin-cyan  rounded-full select-none z-2 duration-500 cursor-pointer hover:scale- flex justify-center items-center  absolute top-6 left-4 pl-1 ${minimize ? '' : 'rotate-180 ' }  `}>
                <img src="arrow.webp" className="w-8 h-8  " />
            </button>

            <NavBar signalMinimize={minimize}/>
            <div className=" w-full h-full">
                
            <Outlet/>
            </div>
        </main>
    )
} 