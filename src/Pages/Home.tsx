import { Outlet } from "react-router-dom";
import NavBar from "../Components/Layout/NavBar";
import { useState } from "react";
import TranslateButton from "../Components/Misc/TranslateButton";
import TranslatePopUp from "../Components/Layout/TranslatePopUp";
import Text from "../Components/Misc/Text";
import LoginPopUp from "../Components/Layout/LoginPopUp";


export default function HomePage() {
  const [minimize, setMinimize] = useState<boolean>(false);
  const [translateSignal, setTranslateSignal] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
     setHeight(window.innerHeight)

  });
  
  const [login, setLogin] = useState(true)
  const [popUpLogin, setPopUpLogin] = useState(false)

 function downloadBase() {
    const link = document.createElement("a");
    link.href = "/files/BASE_SURVEY_NEW.qsf";
    link.download = "BASE_SURVEY_NEW.qsf.qsf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleMinimize() {
    if (minimize) {
      setMinimize(false);
    } else {
      setMinimize(true);
    }
  }
  return (
    <main className="bg-schin-black w-screen  h-screen flex flex-row relative">

      {login ? (<>  {translateSignal ? <TranslatePopUp minimize={() => setTranslateSignal(false)}/> : null}
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
      </div></>) : (
      <section className="bg-sc w-full h-full flex flex-col justify-center items-center">
        {popUpLogin ? ( <LoginPopUp signalLogin={() => setLogin(true) } signalback={() => setPopUpLogin(false)}/>) : null}
       
        <picture className=" w-200 h-80 flex justify-center pr-20 relative ">
            <img src="title.png" className="w-200 object-cover mt-20" />
             <Text size="small" className="absolute font-tech bottom-10 right-30 invert-30">
                      by Schinaider
                    </Text>
        </picture>
        <div className=" w-full  h-100 flex justify-center items-start gap-10 pt-25">
            
           <button className="  w-100 flex bg-schin-cyan justify-start items-center  rounded-2xl hover:scale-99 duration-300 transition-all cursor-pointer">
              <div className=" w-30  min-w-30 h-30 min-h-30 rounded-3xl flex justify-center items-center">
              <img src="visitor.png" className="w-6/10 invert-11 " />
              </div>
               
              <Text size="custom" className="text-4xl text-start pl-3  min-w-75 max-w-75  font-protest text-schin-black" > Convidado</Text>
            
            </button>
           
            
            <button onClick={() => setPopUpLogin(true)} className="w-100 flex bg-schin-cyan justify-start items-center  rounded-2xl hover:scale-99 duration-300 transition-all cursor-pointer">
              <div className=" w-30  min-w-30 h-30 min-h-30 rounded-3xl flex justify-center items-center">
              <img src="dev.png" className="w-10/10 " />
              </div>
               
              <Text size="custom" className="text-4xl text-start pl-3  min-w-75 max-w-75  font-protest text-schin-black" > Desenvolvedor</Text>
            
            </button>
            
        </div>


      </section>)}

    
    </main>
  );
}
