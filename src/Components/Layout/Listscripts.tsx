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
}

export default function Listscripts() {
    const [scripts, setScripts] = useState<scriptDB[]>([])
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

                    <div className="w-8/10 min-h-20 h-20 border   border-schin-gray-strong rounded-2xl flex flex-row">
                        <div className="  w-7/10 h-full flex justify-start items-center pl-5 select-none">
                            <picture className="flex mr-2.5 w-14 h-14 justify-center items-center ">
                                <img style={code.imgStyle} src={code.scriptImg} />
                            </picture>
                            <Text size="extra large" className="text-schin-white  border-l-2 border-schin-gray-strong h-6/10 flex pl-5 justify-center items-center">{code.name}</Text>   
                        </div>
                        <div className=" h-full select-none w-3/10 flex flex-row items-center justify-end pr-8 gap-8 ">
                            <img src="code.png" className="w-10 h-10 invert-80 hover:scale-98 cursor-pointer duration-75" onClick={() => setViewSignal({
                                signal: true,
                                scriptText: code.script,
                                scriptEdit: code.edit,
                            })} />
                            <img src="copy.png" className="w-8 h-8 invert-80  hover:scale-98 cursor-pointer duration-75" onClick={() => handleCopyScript(code.script) }/>
                        </div>
                    </div>
                    ) )}

                
                

                </div>
        </section>''
        </>
    )
}