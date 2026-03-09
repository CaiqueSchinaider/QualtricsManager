import { useEffect, useState } from "react"
import getDataFirebase from "../../getFirebase"
import Text from "../Misc/Text"
import PopUp from "./PopUp";
import toast from "react-hot-toast";

interface viewSignalProps {
    signal: boolean;
    scriptText: string;
    scriptEdit: boolean,
}

interface scriptDB {
    name: string;
    script: string;
    edit: boolean;
    scriptImg: string;
    imgStyle: React.CSSProperties;
    html?: string;
    htmledit?: boolean;
    info?: string; 
}

export default function Listscripts() {
    const [scripts, setScripts] = useState<scriptDB[]>([])
    const [width, setWidth] = useState<number>() 
    
    window.addEventListener('resize', () => {
        setWidth(window.innerWidth)
    })

    const [viewSignal, setViewSignal] = useState<viewSignalProps>({
        signal:  false,
        scriptText: '',
        scriptEdit: false,
    })



        useEffect(() => {
            getData() 
        },[])

        async function getData() {
         let dados = await getDataFirebase<scriptDB>('scripts')
         if (dados) {
             setScripts(dados)
         }
        }


        function handleCopyScript(textScript: string) {
            navigator.clipboard.writeText(textScript)
            toast.success('Script Copiado')
        }

    return(
        <>
    {viewSignal.signal ? (<PopUp preset="view" text={viewSignal.scriptText} editScript={viewSignal.scriptEdit}  back={() => setViewSignal({
        signal: false,
        scriptText: '',
        scriptEdit: false,
    })} />) : (null)}

        <section className=" w-full h-full flex justify-center flex-col items-center">
            <Text size="extra large" className="text-schin-white pt-15 pb-5 select-none"> 
                Visualize e/ou copie um script
            </Text>
                <div className="w-9/10 h-9/10 flex flex-col items-center py-5 gap-5 overflow-y-scroll hide-scrollbar">


                    {scripts.map((code) => (

                    <div className="w-8/10 min-h-20 min-w-150 h-20 border   border-schin-gray-strong rounded-2xl flex flex-row">
                        <div className="  w-11/20 h-full  flex justify-start items-center pl-5 select-none">
                            <picture className="flex mr-2.5 w-14 h-14 justify-center items-center ">
                                <img style={code.imgStyle} src={code.scriptImg} />
                            </picture>
                            <Text size={width!  > 1000 ? 'extra large' : 'medium'} className="w-8/10 text-schin-gray-light border-l-2 border-schin-gray-strong h-6/10 flex pl-5 justify-start items-center">{code.name}</Text>   
                        </div>
                        <div className=" h-full select-none w-9/20 flex flex-row items-center justify-end pr-8 gap-8 ">
                       
                            {code.html ? (  
                                <button onClick={() => setViewSignal({
                                        signal: true,
                                        scriptText: code.html!,
                                        scriptEdit: code.htmledit!,
                                        })} className=" flex justify-center items-center hover:scale-99 hover:invert-85 invert-70 duration-75">
                                    <img src="html.webp" className="w-10 h-10 cursor-pointer min-w-10 min-h-10"  />
                                </button>
                            ) : (null)} 

                                <button onClick={() => setViewSignal({
                                        signal: true,
                                        scriptText: code.script,
                                        scriptEdit: code.edit,
                                    })} className=" flex justify-center items-center hover:scale-99 hover:invert-85 invert-70 duration-75">
                                    <img src="code.png" className={`${width! > 1000 ? 'w-10 h-10 min-w-10 min-h-10' : 'w-8 h-8 min-w-8 min-h-8' }  cursor-pointer `}  />
                                 </button>

                                <button  onClick={() => handleCopyScript(code.script) } className=" flex justify-center items-center hover:scale-99 hover:invert-85 invert-70 duration-75">
                                     <img src="copy.png" className={`${width! > 1000 ? 'w-8 h-8 min-w-8 min-h-8' : 'w-7 h-7 min-w-7 min-h-7' } cursor-pointer `}/>
                                </button>

                    {code.info ? ( 
                                <button onClick={() => setViewSignal({
                                        signal: true,
                                        scriptText: code.info!,
                                        scriptEdit: false
                                        })} className=" flex justify-center items-center hover:scale-99 hover:invert-85 invert-70 duration-75">
                                    <img src="info.webp" className={`${width! > 1000 ? 'w-9 h-9 min-w-9 min-h-9' : 'w-7 h-7 min-w-7 min-h-7' } cursor-pointer `} />  
                                </button>) : (null)}
                              
                        </div>
                    </div>
                    ) )}

                
                

                </div>
        </section>''
        </>
    )
}