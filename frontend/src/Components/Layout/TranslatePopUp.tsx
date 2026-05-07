import { useEffect, useState } from "react";
import Button from "../Misc/Button";
import Text from "../Misc/Text";
import toast from "react-hot-toast";
import PopUp from "./PopUp";
import { motion } from "framer-motion";
import { useCredentials } from "../../Hooks/Credentials";

interface SignalProcessandoProps {
  signal: boolean;
  text: string;
}
interface SignalTranslatePopUpProps {
  signal: boolean;
  text: string;
}

type ResponseIA = {
  text: string,
  signal: boolean
}

type ParamsPrompt = {
    username: string | undefined;
    token: number | undefined;
    text: string;
    idioma: string;
    tom: string;
    type: 'translate';
}

interface TranslatePopUpProps {
  minimize: () => void
}

export default function TranslatePopUp(props: TranslatePopUpProps) {
  const [width, setWidth] = useState<number>(window.innerWidth)
  const {credentials} = useCredentials()

  window.addEventListener('resize', () => {
    setWidth(window.innerWidth)
    
  })

  const [translatePopUp, setTranslatePopUp] = useState<SignalTranslatePopUpProps>({
    signal: false,
    text: ''
  })
  const [idioma, setIdioma] = useState<string>("Português");
  const [tom, setTom] = useState<string>("Neutro");
  const [text, setText] = useState<string>("");
  const [promisseBackup, setPromisseBackup] = useState<boolean>(false);
  const [translationText, setTranslationText] = useState<string>('')
  const [signalProcessando, setSignalProcessando] = useState<SignalProcessandoProps>({
        signal: false,
        text: "Traduzir",
      });
  
    useEffect(() => {
      getBackupText()
    },[])

     useEffect(() => {
    if (text.length > 5) {
      const loopBackup = setTimeout(() => {
        localStorage.setItem("backupTranslate", text);
      }, 2000);

      return () => {
        clearTimeout(loopBackup);
      };
    }
  }, [text]);



  async function perguntar(ParamsPrompt: ParamsPrompt): Promise<ResponseIA> {
    let response = await fetch('https://qualtricsmanager.onrender.com/api/promptlive', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(ParamsPrompt)
    } )
    let resFormat:ResponseIA = await response.json()
    return resFormat
  }

  async function handleTranslate() {
    
    setSignalProcessando({
      signal: true,
      text: "Traduzindo...",
      
    })
    toast.loading('Traduzindo...')
    const resposta = await perguntar({
      username: credentials?.username || undefined,
      token: credentials?.token || undefined,
      text: text,
      idioma: idioma,
      tom: tom,
      type: 'translate'
    })
    if(resposta.signal   &&  width > 1050) {
      toast.dismiss();
      setTranslationText(resposta.text)
      toast.success('Tradução concluida')
      setSignalProcessando({
        signal: false,
        text: "Traduzir",
        
      })
    } else if (resposta.signal && width <= 1050) {
      toast.dismiss();
      setTranslationText(resposta.text)
      toast.success('Tradução concluida')
      setTranslatePopUp({
        signal: true,
        text: resposta.text,
      })
      setSignalProcessando({
        signal: false,
        text: "Traduzir",
        
      })
    } else {
       setSignalProcessando({
        signal: true,
        text: "Tente novamente",
      });
      toast.dismissAll()
      toast.error("Cota por minuto excedida, ou erro de servidor");
      console.error(resposta.text)
      setTimeout(() => {
        setSignalProcessando({
          signal: false,
          text: "Gerar mensagem",
        });
      }, 3000);
    }
  }
  



 function getBackupText() {
    let isBackupText = localStorage.getItem("backupTranslate");
    if (isBackupText) {
      toast.success("Último texto restaurado");
      setPromisseBackup(true);
      setText(isBackupText);
    } else {
      setPromisseBackup(true);
    }
  }


    function handleCopyTranslate() {
      if (!translationText) {
        toast.error('Nenhum texto para copiar')
        return;
      }
       navigator.clipboard.writeText(translationText)
      toast.success('Copiado')
    }
  return (
    <motion.div
      initial={{  opacity: 0 }}
        animate={{  opacity: 1 }}
        transition={{ duration: 0.2 }}
    className=" backdrop-blur-3xl w-full h-screen fixed z-4 top-0 flex justify-center items-center">
     
      {translatePopUp.signal ? ( <PopUp preset="view" text={translationText} back={() =>  setTranslatePopUp({
        signal: false,
        text: ''
      })}  />) : (null)} 
     
      {promisseBackup ? (<>   
      
    
    
      
        <div className="w-8/10 h-9/10  min-w-150 min-h-120 max-h-155 relative  justify-center items-center">

        {width > 1050 ? (  <button onClick={props.minimize} className={`z-0 top-0 left-1/2 bg-schin-black -translate-x-1/2 -translate-y-19/20  w-70 h-13 rounded-tl-2xl rounded-tr-2xl border-2 border-schin-cyan flex justify-center items-center pb-0  absolute  hover:cursor-pointer hover:scale-98 duration-300`}>
  <img src="arrow.webp" className="w-9 h-14 rotate-270" />
</button>) : (null)} 
        <div className="shadow-2xl z-2 shadow-[#000] w-full relative h-full min-w-150 min-h-120 bg-schin-black rounded-2xl border-2 border-schin-gray-strong flex flex-row max-h-155">
           {width <= 1050 ? (  
          <button onClick={props.minimize} className={`top-4  w-13 h-13 bg-schin-black rounded-full border-2 border-schin-cyan flex justify-center items-center pr-1  absolute  left-3 hover:cursor-pointer hover:scale-98 duration-300`}>
            <img src="arrow.webp" className="w-8 h-8 rotate-180" />
          </button>) : (null)} 


          <textarea
          value={text}
            onChange={(e) => setText(e.target.value)}
            className={`${width > 1050 ? 'w-4/10' : 'w-8/10'} pb-20 pt-2 pr-5 overflow-scroll hide-scrollbar resize-none  h-17/20 mt-20 text-schin-gray-light  pl-5 `}
          />
        <Text
          size="extra large"
          className={`${width > 1050 ? ('left-5') : ('left-20')} font-protest font-light py-1 px-5 rounded-xl bg-schin-gray-strong text-schin-black  absolute top-5 left-5`}
        >
          {width > 1050 ? 'Entrada' : 'Texto Original'}
        </Text>
        <div className=" border-l-2 border-schin-gray-strong w-2/10 h-full min-w-50  flex flex-col">
          <div className="mt-5 w-full h-70 flex justify-center items-center flex-col gap-3">
            <Text
              size="extra large"
              className="font-protest font-light py-1 px-5 rounded-xl text-schin-gray-strong "
            >
              Idioma
            </Text>
            <Button
              size="small"
              text="Português"
              onChildClick={() => setIdioma("Português")}
              activate={idioma === "Português"}
              block={signalProcessando.signal}
            />
            <Button
              size="small"
              text="Inglês"
              onChildClick={() => setIdioma("Inglês")}
              activate={idioma === "Inglês"}
              block={signalProcessando.signal}
            />
            <Button
              size="small"
              text="Espanhol"
              onChildClick={() => setIdioma("Espanhol")}
              activate={idioma === "Espanhol"}
              block={signalProcessando.signal}
            />
          </div>
          <div className="mt-5 w-full h-70 flex border-t-2 border-schin-gray-strong justify-center items-center flex-col gap-3">
            <Text
              size="extra large"
              className="font-protest font-light py-1 px-5 rounded-xl text-schin-gray-strong "
            >
              Tom
            </Text>
            <Button
              size="small"
              text="Formal"
              onChildClick={() => setTom("Formal")}
              activate={tom === "Formal"}
              block={signalProcessando.signal}
            />
            <Button
              size="small"
              text="Neutro"
              onChildClick={() => setTom("Neutro")}
              activate={tom === "Neutro"}
              block={signalProcessando.signal}
            />
          </div>
          <div className="mt-5 w-full h-70 border-t-2 border-schin-gray-strong flex justify-center items-center flex-col gap-3">
            <Button size="medium" text={signalProcessando.text} onChildClick={() => handleTranslate()} block={signalProcessando.signal} contrastStyle />
          </div>
        </div>
        {width > 1050 ? ( <>
        <textarea
          readOnly
          value={translationText}
          className="hide-scrollbar resize-none w-4/10 pb-20 pr-5 h-full text-schin-gray-light pt-20 pl-5 border-l-2 border-schin-gray-strong"
        />
         <Text
          size="extra large"
          className="font-protest font-light py-1 px-5 rounded-xl bg-schin-gray-strong text-schin-black  absolute top-5 right-5"
        >
          Tradução
        </Text>
        <button onClick={() => handleCopyTranslate()} className=" absolute bg-schin-black bottom-3 right-3 w-20 h-13 rounded-2xl border-2 border-schin-gray-strong flex justify-center items-center pb-0  hover:cursor-pointer hover:scale-98 duration-300">
            <img src="copy.png" className="w-9 h-9 invert-60" />
          </button>
        </> 
        ) : (null)}
      
       
      </div>
        </div>
        
      </>): (null)}
    
    </motion.div>
  );
}
