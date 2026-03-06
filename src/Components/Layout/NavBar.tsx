import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Misc/Button";
import Text from "../Misc/Text";
import { useState } from "react";

interface NavBarProps {
    signalMinimize: boolean;
}

export default function NavBar({signalMinimize}: NavBarProps) {
 
    let navigate = useNavigate() 
    let location = useLocation()
    let currentLocation = location.pathname
    
    function downloadBase() {
    const link = document.createElement("a");
    link.href = "/BASE-SURVEY.qsf";
    link.download = "BASE-SURVEY.qsf"; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    };

    return ( 
        <main className={`bg-schin-black duration-500 ${signalMinimize  ?  'w-0/20 opacity-0 -translate-x-200' : ' w-5/20' } relative  h-full pt-20  border-r-2 border-schin-cyan select-none`}>
           
            <div className=" w-full mt-12 h-30 flex justify-center items-center  relative">
           <img src="title.png" />
           <Text size="small" className="absolute bottom-0 right-10 invert-30">
            by Schinaider
           </Text>
            </div>
            <div className="b h-100 w-full mt-15 flex flex-col justify-start items-center gap-5">
                <Button text="Criar Link LIVE" size="large" onChildClick={() => navigate('/')}  contrastStyle activate={currentLocation === '/'}/>
                <Button text="Testes QA" size="large" onChildClick={() => navigate('/qa')} contrastStyle activate={currentLocation === '/qa'}/>
                <Button text="Scripts" size="large" onChildClick={() => navigate('/scripts')} contrastStyle activate={currentLocation === '/scripts'}/>
                <Button text="Formatar/Converter Imagem" size="large" onChildClick={() => navigate('/imageformat')} contrastStyle activate={currentLocation === '/imageformat'}/>
                <Button  text="Baixar Base Survey" size="medium" className="bottom-5 absolute"  onChildClick={() => downloadBase()} contrastStyle activate={currentLocation === '/settings'}/>
              
            </div>
        </main>
    )
}
