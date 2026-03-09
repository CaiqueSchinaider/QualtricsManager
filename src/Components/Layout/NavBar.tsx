import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Misc/Button";
import Text from "../Misc/Text";
import { useState } from "react";

interface NavBarProps {
  signalMinimize: boolean;
}

export default function NavBar({ signalMinimize }: NavBarProps) {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);
  let navigate = useNavigate();
  let location = useLocation();
  let currentLocation = location.pathname;

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  });

  function downloadBase() {
    const link = document.createElement("a");
    link.href = "/files/BASE_SURVEY_NEW.qsf";
    link.download = "BASE_SURVEY_NEW.qsf.qsf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        className={` ${height < 800 ? "mt-0" : "mt-15"} w-full  h-30 flex justify-center items-center  relative `}
      >
        <img src="title.png" />
        <Text size="small" className="absolute bottom-0 right-10 invert-30">
          by Schinaider
        </Text>
      </div>
      <div
        className={` ${height < 800 ? "gap-4" : "gap-5"} h-100 w-full mt-15 flex flex-col justify-start items-center `}
      >
        <Button
          text="Criar Link LIVE"
          size={height < 800 ? "medium" : "large"}
          onChildClick={() => navigate("/")}
          contrastStyle
          activate={currentLocation === "/"}
        />
        <Button
          text="Testes QA"
          size={height < 800 ? "medium" : "large"}
          onChildClick={() => navigate("/qa")}
          contrastStyle
          activate={currentLocation === "/qa"}
        />
        <Button
          text="Scripts"
          size={height < 800 ? "medium" : "large"}
          onChildClick={() => navigate("/scripts")}
          contrastStyle
          activate={currentLocation === "/scripts"}
        />
        <Button
          text="Formatar/Converter Imagem"
          size={height < 800 ? "medium" : "large"}
          onChildClick={() => navigate("/imageformat")}
          contrastStyle
          activate={currentLocation === "/imageformat"}
        />
        
        <button className="bottom-5 absolute w-48 h-15 border-schin-cyan rounded-2xl border text-schin-cyan flex flex-row items-center justify-center gap-2 cursor-pointer hover:scale-98 duration-105 transition-all" onClick={() => downloadBase()}>
            <img src="downloadicon.png" className="w-7"/>
            <Text size="small">
            Baixar Base Survey
            </Text>
        </button>
        </div>
        
    </nav>
  );
}
