
import toast from "react-hot-toast";
import Button from "../Misc/Button";
import Text from "../Misc/Text";


interface PopUpProps {
    text: string;
    back: () => void
    linkToCheck?: string;
    preset: 'linklive' | 'qa' | 'view';
    editScript?: boolean;
}

function checkParams(urlString: string) {
  const url = new URL(urlString);

  const valores: Record<string, string> = {
    owid: "teste",
    panelistid: "teste",
    age: "22",
    gender: "2",
    sel: "2",
    region: "2",
    am: "2",
  };

  Object.entries(valores).forEach(([param, valor]) => {
    if (url.searchParams.has(param)) {
      url.searchParams.set(param, valor);
    }
  });

  window.open(url.toString(), "_blank", "noopener,noreferrer");
}

 function handleCopyText(textCopy: string, edit: boolean) {
            navigator.clipboard.writeText(textCopy)
            if (edit) {
                
                toast(" Esse script possui uma variavel necessariamente editavel", {
                    icon: "⚠️",
                    style: {
                        background: "#fff3cd",
                        color: "#856404",
                         textAlign: "center",
                    }
                });
                toast.success('Copiado')
            } else {
                toast.success('Copiado')
            }
        }


export default function PopUp({text, back, linkToCheck, preset, editScript}: PopUpProps) {
  
    

    return (
        <div className=" select-none w-screen h-screen backdrop-blur-2xl flex justify-center items-center fixed top-0 left-0 z-1000">

            <div className="relative flex justify-start pt-5 gap-5 items-center flex-col w-6/10 h-7/10 bg-schin-black rounded-2xl border border-schin-gray-strong">
                <Text size="large" className="text-schin-white" >
               {preset  === 'view' ? 'Visualizando o Script' : 'Verifique e copie a mensagem'}   
                </Text>
                <textarea value={text} className="w-9/10 h-15/20 resize-none p-10 text-schin-white border-schin-gray-strong border rounded-lg  hide-scrollbar" >
                    
                </textarea>
                <div className="flex justify-center gap-5 items-center flex-row  w-100">
                        
                    
                 
                    <Button text="Copiar" size="small" onChildClick={() => handleCopyText(text, editScript ?? false)} />    
               {preset === 'linklive' && linkToCheck ? (  <Button text="Testar Link" size="small" onChildClick={() => checkParams(linkToCheck)} />): (null)}       
                    <Button text="Voltar" size="small" onChildClick={back} />    
                </div>
            </div>

            
        </div>


    )
}