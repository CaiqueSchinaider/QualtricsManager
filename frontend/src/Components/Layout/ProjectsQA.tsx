import { useEffect, useState } from "react";
import Button from "../Misc/Button";
import Text from "../Misc/Text";
import toast from "react-hot-toast";
import PopUp from "./PopUp";

import { motion } from "framer-motion";
import { useCredentials } from "../../Hooks/Credentials";

interface copySignalProps {
  signal: boolean;
  resposta: string;
}

interface SignalProcessandoProps {
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
    type: 'qa'
}


export default function ProjectsQA() {
  const [idioma, setIdioma] = useState("Portugues");
  const [textQa, setTextQa] = useState("");
  const {credentials} = useCredentials()
  const [promisseBackup, setPromisseBackup] = useState<boolean>(false);
  const [copySignal, setCopySignal] = useState<copySignalProps>({
    signal: false,
    resposta: "",
  });

  const [signalProcessando, setSignalProcessando] =
    useState<SignalProcessandoProps>({
      signal: false,
      text: "Formatar com IA",
    });


  useEffect(() => {
    getBackupText();
  }, []);

  useEffect(() => {
    if (textQa.length > 5) {
      const loopBackup = setTimeout(() => {
        localStorage.setItem("backupQa", textQa);
      }, 2000);

      return () => {
        clearTimeout(loopBackup);
      };
    }
  }, [textQa]);

  function getBackupText() {
    let isBackupText = localStorage.getItem("backupQa");
    if (isBackupText) {
      toast.success("Último texto restaurado");
      setPromisseBackup(true);
      setTextQa(isBackupText);
    } else {
      setPromisseBackup(true);
    }
  }

    async function perguntar(ParamsPrompt: ParamsPrompt): Promise<ResponseIA> {
    let response = await fetch('/api/promptlive', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(ParamsPrompt)
    } )
    let resFormat: ResponseIA = await response.json()
    return resFormat
  }


  async function handleFormatQa() {
    if (textQa === "" || textQa.length < 10) {
      toast.error("Texto de QA muito curto");
      return;
    }
    setSignalProcessando({
      signal: true,
      text: "Formatando texto...",
    });
    toast.loading("Gerando mensagem aguarde...");
    let resposta = await perguntar({
      username: credentials?.username || undefined,
      token: credentials?.token || undefined,
      text: textQa,
      idioma: idioma,
      type: 'qa'
    });
    if (resposta.signal) {
      setCopySignal({
        signal: true,
        resposta: resposta.text,
      });
      setSignalProcessando({
        signal: false,
        text: "Formatar com IA",
      });
      toast.dismiss();
      toast.success("Mensagem gerada");
    } else {
      toast.dismiss();
      toast.error("Erro ao gerar mensagem");

    }
  }

  return (
    <>
      {copySignal.signal ? (
        <PopUp
          preset="qa"
          text={copySignal.resposta}
          back={() =>
            setCopySignal({
              signal: false,
              resposta: "",
            })
          }
        />
      ) : null}

      {promisseBackup ? (
        <motion.div
        initial={{  opacity: 0 }}
        animate={{  opacity: 1 }}
        transition={{ duration: 0.2 }}
        className=" w-full h-full flex flex-col items-center  select-none">
          <Text size="custom" className="text-4xl pt-15 pb-5 select-none  font-protest text-schin-gray-light mt-4"> 
                          Escreva suas anotações
                      </Text>
          <div className="w-full h-7/10  pt-5 flex justify-center items-center">
            <textarea
              value={textQa}
              placeholder="Insira apenas pontos para ajustes ou apenas diga que não encontrou nenhum..."
              readOnly={signalProcessando.signal}
              onChange={(e) => setTextQa(e.target.value)}
              className=" resize-none border-2 border-schin-gray-strong rounded-2xl w-9/10 h-full text-schin-gray-light text-lg p-10"
            ></textarea>
          </div>
          <div className="w-full h-2/10 flex justify-center items-center">
            <div className="relative   w-7/10 max-w-150 h-9/10 flex flex-row justify-center  items-center gap-5 pt-5">
              <Text size="large" className="absolute top-2 text-schin-gray-light">
                Selecione um idioma
              </Text>
              <Button
                text="Português"
                size="small"
                activate={idioma === "Portugues"}
                onChildClick={() => setIdioma("Portugues")}
                block={signalProcessando.signal}
              />
              <Button
                text="Inglês"
                size="small"
                activate={idioma === "Ingles"}
                onChildClick={() => setIdioma("Ingles")}
                block={signalProcessando.signal}
              />
              <Button
                text="Espanhol"
                size="small"
                activate={idioma === "Espanhol"}
                onChildClick={() => setIdioma("Espanhol")}
                block={signalProcessando.signal}
              />
            </div>
            <div className="  w-3/10 h-7/10 max-w-75    flex flex-row justify-center items-center pt-5">
              <Button
                text={signalProcessando.text}
                size="medium"
                onChildClick={() => handleFormatQa()}
                block={signalProcessando.signal}
                contrastStyle
                activate={signalProcessando.signal}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </>
  );
}
