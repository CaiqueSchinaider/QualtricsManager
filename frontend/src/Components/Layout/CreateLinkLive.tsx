import { useEffect, useState } from "react";
import Button from "../Misc/Button";
import Input from "../Misc/Input";
import Text from "../Misc/Text";
import PopUp from "./PopUp";
import toast from "react-hot-toast";
import { motion } from "framer-motion";





interface SignalCopyProps {
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
    obs: String;
    link: String;
    params: string[];
    idioma: string;
    tipo: 'live'
}

export default function CreateLinkLive() {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  const [params, setParams] = useState<string[]>(["owid", "panelistid"]);
  const [idioma, setIdioma] = useState<string>("Portugues");
  const [obs, setObs] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [signalCopy, setSignalCopy] = useState<SignalCopyProps>({
    signal: false,
    resposta: "",
  });

  const [signalProcessando, setSignalProcessando] =
    useState<SignalProcessandoProps>({
      signal: false,
      text: "Gerar mensagem",
    });

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

  function handleSetParams(prm: string) {
    let signalPrm = params.includes(prm);
    if (signalPrm) {
      let updatePrm = params.filter((param) => param !== prm);
      setParams(updatePrm);
    } else {
      setParams([...params, prm]);
    }
  }



  function isValidURL(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  async function handleCallbackPrompt() {
    if (!isValidURL(link)) {
      toast.error("Verifique a URL informada.");
      return;
    }
    if (signalProcessando.signal) return;

    toast.loading("Gerando mensagem link LIVE...");

    setSignalProcessando({
      signal: true,
      text: "Gerando mensagem...",
    });
    const resposta = await perguntar({
        obs: obs,
        link: link,
        params: params,
        idioma: idioma,
      tipo: 'live'
      });

    if (resposta.signal) {
      setSignalCopy({
        signal: true,
        resposta: resposta.text,
      });
      
      toast.dismiss();
      toast.success("Mensagem de link LIVE gerada");
      setSignalProcessando({
        signal: false,
        text: "Gerar mensagem",
      });
    } else {
      setSignalProcessando({
        signal: true,
        text: "Erro! Tente novamente",
      });
        toast.dismiss();
      toast.error("Cota por minuto excedida, ou erro de servidor");
    
      setTimeout(() => {
        setSignalProcessando({
          signal: false,
          text: "Gerar mensagem",
        });
      }, 3000);
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
    if (!response.ok) {
      return {
        text: '',
        signal: false,
      }
    }
    let resFormat: ResponseIA = await response.json()
    return resFormat
  }

  async function handleCopyLinkLive() {
    try {
      const url = createLinkLive();
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado com sucesso!");
    } catch (error) {
      toast.error("Não foi possível copiar o link. Verifique a URL informada.");
    }
  }

  function createLinkLive(): string {
    const url = new URL(link);

    url.searchParams.append("link", "LIVE");

    params.forEach((param) => {
      url.searchParams.append(param, "");
    });

    return url.toString();
  }

  return (
    <>
      {signalCopy.signal ? (
        <PopUp
          preset="linklive"
          text={signalCopy.resposta}
          linkToCheck={createLinkLive()}
          back={() =>
            setSignalCopy({
              signal: false,
              resposta: "",
            })
          }
        />
      ) : null}

      <motion.div 

          initial={{  opacity: 0 }}
        animate={{  opacity: 1 }}
        transition={{ duration: 0.2 }}

        className={`w-full h-full flex flex-col justify-start items-center select-none`}
      >
        <div
          className={`${width! < 1335 ? "justify-center flex" : ""} ${height! < 885 ? "flex flex-nowrap gap-8 mt-18 items-center" : "mt-28"} w-full     border-b-2 border-schin-gray-medium pb-5`}
        >
          <Input
            InputConfig={{
              onChange: (e) => setLink(e.target.value),
              placeholder: "Insira um link válido...",
              readOnly: signalProcessando.signal,
              style: { borderColor: "#7c7c7c" },
            }}
            size={height! > 835 ? "extra large" : "large"}
            label="Insira o link"
            className={` ${width! < 1335 && height! > 885 ? " w-150 " : height! < 836 ? "w-100  " : ''}  ${width! >= 1335 ? 'ml-20' : ''}`}
          />
          {height! < 835 && width! > 1335 ? (
            <div
              className={` w-full flex-row gap-5 h-24 items-end justify-start  flex   relative`}
            >
              <Text
                size="large"
                className="text-schin-gray-light pb-2 absolute top-0"
              >
                Escolha um Idioma
              </Text>
              <Button
                text="Português"
                size="small"
                onChildClick={() => setIdioma("Portugues")}
                block={signalProcessando.signal}
                activate={idioma === "Portugues"}
              />
              <Button
                text="inglês"
                size="small"
                onChildClick={() => setIdioma("Ingles")}
                block={signalProcessando.signal}
                activate={idioma === "Ingles"}
              />
              <Button
                text="Espanhol"
                size="small"
                onChildClick={() => setIdioma("Espanhol")}
                block={signalProcessando.signal}
                activate={idioma === "Espanhol"}
              />
            </div>
          ) : null}
          {height! > 885 && width! > 1335 ? null : width! <= 1335 &&
            height! <= 835 ? (
            <div className={`w-75 justify-center h-full flex items-end gap-5`}>
              <Button
                text={signalProcessando.text}
                size="small"
                onChildClick={() => handleCallbackPrompt()}
                block={signalProcessando.signal}
                contrastStyle
                activate={signalProcessando.signal}
              />
              <Button
                text="Criar Somente Link"
                size="small"
                onChildClick={() => handleCopyLinkLive()}
                block={signalProcessando.signal}
                contrastStyle
              />
            </div>
          ) : width! < 768 && height! <= 835 ? (
            <div
              className={`w-30 justify-center items-center flex flex-col gap-2`}
            >
              <Button
                text={signalProcessando.text}
                size="small"
                onChildClick={() => handleCallbackPrompt()}
                block={signalProcessando.signal}
                contrastStyle
                activate={signalProcessando.signal}
              />
              <Button
                text="Criar Somente Link"
                size="small"
                onChildClick={() => handleCopyLinkLive()}
                block={signalProcessando.signal}
                contrastStyle
              />
            </div>
          ) : null}
        </div>

        <div
          className={`w-full flex flex-col ${width! < 1335 ? " h-67 items-center" : "pl-16"} ${width! < 1335 ? "" : "min-h-30  "}   py-3  border-b-2 border-schin-gray-medium `}
        >
          <Text size="large" className="text-schin-gray-light pb-2">
            Selecione os parametros
          </Text>

          <div
            className={` ${width! < 1335 ? "grid-cols-[120px_120px_120px_120px] items-center justify-center grid-rows-3 grid-flow-row  gap-3  grid w-4/10 min-w-100" : "flex flex-row gap-5 w-full  justify-start items-center"}   `}
          >
            <Button
              text="owid"
              size="small"
              onChildClick={() => handleSetParams("owid")}
              block={signalProcessando.signal}
              activate={params.includes("owid")}
            />
            <Button
              text="panelistid"
              size="small"
              onChildClick={() => handleSetParams("panelistid")}
              block={signalProcessando.signal}
              activate={params.includes("panelistid")}
            />
            <Button
              text="age"
              size="small"
              onChildClick={() => handleSetParams("age")}
              block={signalProcessando.signal}
              activate={params.includes("age")}
            />
            <Button
              text="gender"
              size="small"
              onChildClick={() => handleSetParams("gender")}
              block={signalProcessando.signal}
              activate={params.includes("gender")}
            />
            <Button
              text="sel"
              size="small"
              onChildClick={() => handleSetParams("sel")}
              block={signalProcessando.signal}
              activate={params.includes("sel")}
              className=""
            />
            <Button
              text="region"
              size="small"
              onChildClick={() => handleSetParams("region")}
              block={signalProcessando.signal}
              activate={params.includes("region")}
            />
            <Button
              text="state"
              size="small"
              onChildClick={() => handleSetParams("state")}
              block={signalProcessando.signal}
              activate={params.includes("state")}
            />
            <Button
              text="am"
              size="small"
              onChildClick={() => handleSetParams("am")}
              block={signalProcessando.signal}
              activate={params.includes("am")}
            />
            <Button
              text="city"
              size="small"
              onChildClick={() => handleSetParams("city")}
              block={signalProcessando.signal}
              activate={params.includes("city")}
              className={`${width! < 1335 ? 'col-span-4 w-full' : ''} `}
            />
          </div>
        </div>
        {height! < 835 && width! > 1335 ? null : (
          <div
            className={`w-full ${width! < 1335 ? " h-65 min-h-65 flex-row-reverse gap-3 justify-center items-center" : "h-30 flex-col mt-10 pl-17 "} flex border-b-2 border-schin-gray-medium `}
          >
            <div
              className={` ${width! < 1335 ? " w-1/7 min-w-40  flex-col gap-2 h-9/10 justify-end items-center" : "w-full flex-row gap-5 h-24 items-end justify-start "} flex   relative`}
            >
              <Text
                size="medium"
                className="text-schin-gray-light pb-2 absolute top-0"
              >
                Escolha um Idioma
              </Text>
              <Button
                text="Português"
                size="small"
                onChildClick={() => setIdioma("Portugues")}
                block={signalProcessando.signal}
                activate={idioma === "Portugues"}
              />
              <Button
                text="inglês"
                size="small"
                onChildClick={() => setIdioma("Ingles")}
                block={signalProcessando.signal}
                activate={idioma === "Ingles"}
              />
              <Button
                text="Espanhol"
                size="small"
                onChildClick={() => setIdioma("Espanhol")}
                block={signalProcessando.signal}
                activate={idioma === "Espanhol"}
              />
            </div>
            {width! < 1335 ? (
              <textarea
                placeholder="Faça uma observação que possa ser util para o PM..."
                readOnly={signalProcessando.signal}
                onChange={(e) => setObs(e.target.value)}
                className="resize-none w-2/5 max-w-90 min-w-90 h-50 border-schin-gray-medium border rounded-2xl text-schin-gray-light px-5 pt-5"
              ></textarea>
            ) : null}
          </div>
        )}

        <div
          className={` ${width! < 1335 ? "h-40 w-full" : " mt-15 h-80 w-9/10"}  bg- flex items-start flex-col  `}
        >
          {width! > 1335 ? (
            <Text size="large" className="text-schin-gray-light pb-2">
              Alguma Observação?
            </Text>
          ) : null}
          <div className="w-full h-full flex flex-row  ">
            {width! > 1335 ? (
              <textarea
                placeholder="Faça uma observação que possa ser util para o PM..."
                readOnly={signalProcessando.signal}
                onChange={(e) => setObs(e.target.value)}
                className="resize-none w-5/10 min-h-50 h-19/20 border-schin-gray-medium border rounded-2xl text-schin-gray-light pl-5 pt-5"
              ></textarea>
            ) : null}
            {height! > 835 || width! > 1335 ? (
              <div
                className={`${width! < 1335 ? "flex-row h-full min-w-150 w-full" : "flex-col h-7/10 w-1/2"}   justify-center items-center flex  gap-5`}
              >
                <Button
                  text={signalProcessando.text}
                  size="large"
                  onChildClick={() => handleCallbackPrompt()}
                  block={signalProcessando.signal}
                  contrastStyle
                  activate={signalProcessando.signal}
                />
                <Button
                  text="Criar Somente Link"
                  size="large"
                  onChildClick={() => handleCopyLinkLive()}
                  block={signalProcessando.signal}
                  contrastStyle
                />
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </>
  );
}
