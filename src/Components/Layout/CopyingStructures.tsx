import { useEffect, useState } from "react";
import Text from "../Misc/Text";
import getDataFirebase from "../../getFirebase";
import PopUp from "./PopUp";
import { motion } from "framer-motion";
interface StructureProps {
    html: string;
    script: string;
    info: string;
}

interface viewSignalProps {
    signal: boolean;
    scriptText: string;
    scriptEdit: boolean;
    preset: 'script' | 'view';
    info?: string;
}

export default function CopyingStructures() {
    const [structures, setStructures] = useState<StructureProps[]>([])
    const [width, setWidth] = useState<number>(innerWidth)

    useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth)
    
  }

  window.addEventListener("resize", handleResize)

  return () => {
    window.removeEventListener("resize", handleResize)
  }
}, [])

    const [viewSignal, setViewSignal] = useState<viewSignalProps>({
        signal:  false,
        scriptText: '',
        scriptEdit: false,
        preset: 'view'
    })


     useEffect(() => {
            getData() 
    },[])

        async function getData() {
         let dados = await getDataFirebase<StructureProps>('structures')
         if (dados) {
             setStructures(dados)
         }
        }


    return (
        <>
        {viewSignal.signal ? (<PopUp preset={viewSignal.preset} text={viewSignal.scriptText} back={() => setViewSignal({
            signal:  false,
            scriptText: '',
            scriptEdit: false,
            preset: 'view'
        })} 
    
    />) : (null)}
        <motion.div
          initial={{  opacity: 0 }}
        animate={{  opacity: 1 }}
        transition={{ duration: 0.2 }}
        
        className="w-full h-full flex justify-start items-center flex-col">
            <Text size="custom" className="text-4xl pt-15 pb-5 select-none font-protest mt-8 text-schin-gray-light"> 
              Escolha um Componente
            </Text>
            {structures ? (
        <div className={` ${width > 1350 ? 'grid-cols-[400px_400px_400px]' : width > 850 ?  'grid-cols-[400px_400px]' : 'grid-cols-[400px]'} w-full pt-5 mt-5 grid  auto-rows-[440px] grid-rows-[440px] justify-center gap-5  h-full overflow-scroll hide-scrollbar`}>
               {structures?.map((structure,i) => (
                 <motion.div initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
  className="border border-schin-gray-strong shadow-2xl shadow-[#000] rounded-2xl overflow-hidden w-100 h-110 flex flex-col ">
                    <div  className="w-full h-16/20 flex justify-center items-center">
                            <div dangerouslySetInnerHTML={{__html: structure.html }} className=" select-none bg-schin-gray-light shadow-md shadow-[#000] rounded-2xl">
                            </div>
                    </div> 
                    <div className="border-t border-schin-gray-strong w-full h-4/20 flex flex-row items-center gap-8 justify-center">
                            <button onClick={() => setViewSignal({
                                signal: true,
                                scriptText: structure.html,
                                preset: 'script',
                                scriptEdit: false,
                                
                            })} className="flex justify-center items-center hover:scale-99 hover:invert-85 invert-60 duration-75">
                            <img src="html.webp" className="invert-60 w-9 h-9 cursor-pointer"/>
                            </button>

                            <button onClick={() => setViewSignal({
                                signal: true,
                                scriptText: structure.script,
                                preset: 'script',
                                scriptEdit: false,
                                
                            })} className="flex justify-center items-center hover:scale-99 hover:invert-85 invert-60 duration-75">
                            <img src="code.png" className="invert-60 w-11 h-11 cursor-pointer"/>
                            </button>

                            <button onClick={() => setViewSignal({
                                signal: true,
                                scriptText: structure.info,
                                preset: 'view',
                                scriptEdit: false,
                                
                            })} className="flex justify-center items-center hover:scale-99 hover:invert-85 invert-60 duration-75">
                            <img src="info.webp" className="invert-60 w-9 h-9 cursor-pointer"/>
                            </button>
                    </div> 
                </motion.div>
               ))}
               
                




          
            </div>
        ) : (null)}
         
        </motion.div>
        </>
    )
}