import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Misc/Button";
import Text from "../Misc/Text";
import { useEffect, useState } from "react";
import { useCredentials } from "../../Hooks/Credentials";
import toast from "react-hot-toast";

interface NavBarProps {
  signalMinimize: boolean;
}

export default function NavBar({ signalMinimize }: NavBarProps) {
  const API_URL = import.meta.env.VITE_API_URL
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);
  const {credentials} = useCredentials()
  let navigate = useNavigate();
  let location = useLocation();
  let currentLocation = location.pathname;

  useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }


  
  window.addEventListener("resize", handleResize)

  return () => {
    window.removeEventListener("resize", handleResize)
  }
}, [])


async function downloadBase(id: number): Promise<void> {
  if (credentials && credentials.username && credentials.token) {
    try {   
      let auth = await fetch(`${API_URL}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          token: credentials.token,
          archiveID: id
        })
      })

      if (auth.ok) {
        let blob = await auth.blob()

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'BASE_SURVEY_NEW.qsf'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } else {
        toast.dismissAll()
        toast.error('Erro ao baixar arquivo')
      }

    } catch {
      toast.dismissAll()
      toast.error('Erro de servidor')
    }
  } else {
    toast.dismissAll()
    toast.error('Você não possui acesso')
  }
}
  return (
    <nav
      className={`
      ${signalMinimize && width <= 1700 ? "-translate-x-2/2 opacity-0 fixed max-w-80 duration-300" : ""}
      ${width <= 1700 && !signalMinimize ? "fixed left-0 max-w-80 duration-300" : ""}
      ${signalMinimize && width > 1700 ? "-translate-x-100 opacity-0 w-0 duration-500" : "w-125 duration-500"}
      ${width > 1700 && !signalMinimize ? "w-125 duration-500" : ""}
      flex flex-col z-1 bg-schin-black  h-full pt-20  border-r-2 border-schin-cyan select-none  `}
    >
    
      <div
        className={` ${height < 850 ? "mt-0" : "mt-15"} w-full  h-30 flex justify-center items-center  relative `}
      >
        <img src="title.png" />
        <Text size="small" className="absolute font-tech bottom-3 right-10 invert-30">
          by Schinaider
        </Text>
      </div>
      <div
        className={` ${height < 850 ? "gap-4" : "gap-5"} h-110  overflow-scroll hide-scrollbar  w-full mt-15 flex flex-col justify-start items-center `}
      >
        <Button
          text="Criar Link LIVE"
          size={height < 850 ? "medium" : "large"}
          onChildClick={() => navigate("/")}
          contrastStyle
         
          activate={currentLocation === "/"}
          className="min-h-15"
        />
        <Button
          text="Testes QA"
          size={height < 850 ? "medium" : "large"}
          onChildClick={() => navigate("/qa")}
          contrastStyle
          className="min-h-15"
          activate={currentLocation === "/qa"}
        />
        <Button
          text="Scripts"
          size={height < 850 ? "medium" : "large"}
          onChildClick={() => navigate("/scripts")}
          contrastStyle
          className="min-h-15"
          activate={currentLocation === "/scripts"}
        />
        <Button
          text="Formatar/Converter Imagem"
          size={height < 850 ? "medium" : "large"}
          onChildClick={() => navigate("/imageformat")}
          contrastStyle
          className="min-h-15"
          activate={currentLocation === "/imageformat"}
        />
        <Button
          text="Layouts/Cards"
          size={height < 850 ? "medium" : "large"}
          onChildClick={() => navigate("/layouts")}
          contrastStyle
          className="min-h-15"
          activate={currentLocation === "/layouts"}
        />
        {height >= 720 ?  ( <button className="bottom-5 absolute w-48 h-15 border-schin-cyan rounded-2xl border text-schin-cyan flex flex-row items-center justify-center gap-2 cursor-pointer hover:scale-98 duration-105 transition-all" onClick={() => downloadBase(1)}>
            <img src="downloadicon.png" className="w-7"/>
            <Text size="small">
            Baixar Base Survey
            </Text>
        </button>) : (null) }
       
        </div>
        
    </nav>
  );
}
