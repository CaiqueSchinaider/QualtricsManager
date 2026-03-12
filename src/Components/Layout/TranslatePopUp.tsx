import { useState } from "react";
import Button from "../Misc/Button";
import Text from "../Misc/Text";

export default function TranslatePopUp() {
  const [idioma, setIdioma] = useState<string>("Português");
  const [tom, setTom] = useState<string>("Neutro");
  const [text, setText] = useState<string>("");

  return (
    <section className="backdrop-blur-sm w-full h-screen fixed z-4 top-0 flex justify-center items-center">
      <div className="w-8/10 relative h-9/10 min-w-150 min-h-120 bg-schin-black rounded-2xl border-2 border-schin-gray-strong flex flex-row max-h-155">
        <textarea
          onChange={(e) => setText(e.target.value)}
          className=" resize-none w-4/10 h-full text-schin-gray-light pt-20 pl-5 pr-5 border-r-2 border-schin-gray-strong"
        ></textarea>
        <Text
          size="extra large"
          className="font-protest font-light py-1 px-5 rounded-xl bg-schin-gray-strong text-schin-black  absolute top-5 left-5"
        >
          Entrada
        </Text>
        <div className="w-2/10 h-full  flex flex-col">
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
            />
            <Button
              size="small"
              text="Inglês"
              onChildClick={() => setIdioma("Inglês")}
              activate={idioma === "Inglês"}
            />
            <Button
              size="small"
              text="Espanhol"
              onChildClick={() => setIdioma("Espanhol")}
              activate={idioma === "Espanhol"}
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
            />
            <Button
              size="small"
              text="Neutro"
              onChildClick={() => setTom("Neutro")}
              activate={tom === "Neutro"}
            />
          </div>
          <div className="mt-5 w-full h-70 border-t-2 border-schin-gray-strong flex justify-center items-center flex-col gap-3">
            <Button size="small" text="Traduzir" contrastStyle />
          </div>
        </div>
        <textarea
          readOnly
          className="resize-none w-4/10  h-full text-schin-gray-light pt-20 pl-5 border-l-2 border-schin-gray-strong"
        />
        <Text
          size="extra large"
          className="font-protest font-light py-1 px-5 rounded-xl bg-schin-gray-strong text-schin-black  absolute top-5 right-67"
        >
          Tradução
        </Text>
      </div>
    </section>
  );
}
