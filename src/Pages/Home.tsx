import { Outlet } from "react-router-dom";
import NavBar from "../Components/Layout/NavBar";
import { useState } from "react";
import TranslateButton from "../Components/Misc/TranslateButton";
import TranslatePopUp from "../Components/Layout/TranslatePopUp";
import Text from "../Components/Misc/Text";

export default function HomePage() {
  const [minimize, setMinimize] = useState<boolean>(false);
  const [translateSignal, setTranslateSignal] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
     setHeight(window.innerHeight)

  });

  function handleMinimize() {
    if (minimize) {
      setMinimize(false);
    } else {
      setMinimize(true);
    }
  }
  return (
    <main className="bg-schin-black w-screen  h-screen flex flex-row relative">
      {translateSignal ? <TranslatePopUp minimize={() => setTranslateSignal(false)}/> : null}
      <button
        onClick={() => handleMinimize()}
        className={` ${width < 1400 ? " w-12 h-12" : " w-15 h-15"} border-2  border-schin-cyan  rounded-full select-none z-2 duration-500 cursor-pointer hover:scale- flex justify-center items-center  absolute top-6 left-4 pl-1 ${minimize ? "" : "rotate-180 "}  `}
      >
        <img
          src="arrow.webp"
          className={width < 1400 ? " w-7 h-7" : " w-8 h-8"}
        />
      </button>
    {height < 720 ? (  <button className="top-6 right-25 absolute w-48 h-13 border-schin-cyan rounded-2xl border text-schin-cyan flex flex-row items-center justify-center gap-2 cursor-pointer hover:scale-98 duration-105 transition-all" onClick={() => downloadBase()}>
                  <img src="downloadicon.png" className="w-7"/>
                  <Text size="small">
                  Baixar Base Survey
                  </Text>
              </button>) : (null)
    }
      
      
      <TranslateButton translatePopUpSignal={() => setTranslateSignal(true)} />

      <NavBar signalMinimize={minimize} />
      <div
        onClick={() => setMinimize(width < 1700 ? true : minimize)}
        className={`w-full h-full duration-300 `}
      >
        <Outlet />
      </div>
    </main>
  );
}
