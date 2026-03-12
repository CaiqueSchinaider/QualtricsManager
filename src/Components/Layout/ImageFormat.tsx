import { useEffect, useState } from "react";
import Button from "../Misc/Button";
import Input from "../Misc/Input";
import Text from "../Misc/Text";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import Pica from "pica";
import JSZip from "jszip";
import { motion } from "framer-motion";


export default function ImageFormat() {
  const [width, setWidth] = useState<number>(innerWidth);

  useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth)
    
  }

  window.addEventListener("resize", handleResize)

  return () => {
    window.removeEventListener("resize", handleResize)
  }
}, [])

  const [files, setFiles] = useState<File[]>([]);
  const [ext, setExt] = useState<number>(0);
  const [imgWidth, setImgWidth] = useState<string>("");
  const [imgHeight, setImgHeight] = useState<string>("");
  const [reduceImg, setReduceImg] = useState<number>(0);
  const [resizeScale, setResizeScale] = useState<number>(0);
  const [formatI, setFormatI] = useState<number>(0);

  async function handleFormat() {
    if (files.length === 0) {
      toast.error("Selecione uma imagem");
      return;
    }

    if (formatI !== 0) {
      if (ext || imgWidth || imgHeight || reduceImg || resizeScale) {
        toast.error(
          "Não é possivel realizar outras formatações juntamente com a inteligente",
        );
        return;
      }
    }

    if ((imgHeight || imgWidth) && resizeScale !== 0) {
      toast.error(
        "Não é possivel redimensionar imagem e diminuir propoção ao mesmo tempo",
      );
      return;
    }

    const loading = toast.loading("Carregando...");

    try {
      const zip = new JSZip();
      const results: any[] = [];

      for (const file of files) {
        let processedFile = file;

        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });

        if (formatI === 3) {
          const canvas = document.createElement("canvas");
          canvas.width = img.width * 2;
          canvas.height = img.height * 2;

          await Pica().resize(img, canvas);
          const blob = await Pica().toBlob(canvas, "image/png", 1);
          processedFile = new File([blob], file.name, { type: blob.type });
        }

        if (resizeScale !== 0) {
          const scaleMap: any = { 1: 0.25, 2: 0.5, 3: 0.75 };
          const scale = scaleMap[resizeScale];

          const canvas = document.createElement("canvas");
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          await Pica().resize(img, canvas);
          const blob = await Pica().toBlob(canvas, file.type, 0.95);
          processedFile = new File([blob], file.name, { type: blob.type });
        }

        if (imgWidth || imgHeight) {
          const canvas = document.createElement("canvas");
          canvas.width = imgWidth ? Number(imgWidth) : img.width;
          canvas.height = imgHeight ? Number(imgHeight) : img.height;

          await Pica().resize(img, canvas);
          const blob = await Pica().toBlob(canvas, file.type, 0.95);
          processedFile = new File([blob], file.name, { type: blob.type });
        }

        const compressionOptions: any = { useWebWorker: true };

        if (reduceImg !== 0) {
          const qualityMap: any = { 1: 0.9, 2: 0.7, 3: 0.4 };
          compressionOptions.initialQuality = qualityMap[reduceImg];
        }

        if (ext !== 0) {
          const extMap: any = {
            1: "image/webp",
            2: "image/png",
            3: "image/jpeg",
          };
          compressionOptions.fileType = extMap[ext];
        }

        if (formatI !== 0) {
          if (formatI === 1) {
            compressionOptions.initialQuality = 0.5;
            compressionOptions.fileType = "image/webp";
          }
          if (formatI === 2) {
            compressionOptions.initialQuality = 0.9;
            compressionOptions.fileType = "image/png";
          }
          if (formatI === 3) {
            compressionOptions.initialQuality = 1;
            compressionOptions.fileType = "image/png";
          }
        }

        const finalFile = await imageCompression(
          processedFile,
          compressionOptions,
        );

        const originalName = file.name.split(".").slice(0, -1).join(".");
        const newExt = finalFile.type.split("/")[1];

        const renamedFile = new File([finalFile], `${originalName}.${newExt}`, {
          type: finalFile.type,
        });

        results.push(renamedFile);
      }

      if (results.length === 1) {
        const file = results[0];

        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = file.name;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        for (const file of results) {
          zip.file(file.name, file);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipBlob);
        link.download = "imagens-formatadas.zip";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.dismiss(loading);
      toast.success("Imagem formatada com sucesso");
    } catch {
      toast.dismiss(loading);
      toast.error("Erro ao processar imagem");
    }
  }

  return (
    <motion.div
      initial={{  opacity: 0 }}
        animate={{  opacity: 1 }}
        transition={{ duration: 0.2 }}
    className={`${width! < 1120 ? "flex justify-center items-center flex-col" : ""}w-full h-full select-none`}>
      {width! > 1120 ? (
        <>
          <div className="w-full  h-20 mt-20">
            <div className="flex  items-center justify-center w-full">
              <label className="flex  flex-col items-center justify-center w-full max-w-md h-44 border-2 border-dashed border-schin-gray-strong rounded-2xl cursor-pointer transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-3 text-schin-gray-light"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16V4m0 0l-4 4m4-4l4 4m6 8v8m0 0l-4-4m4 4l4-4"
                    />
                  </svg>

                  <p className="mb-2 text-sm text-schin-gray-light">
                    <span className="font-semibold">
                      Clique para enviar uma imagem
                    </span>
                  </p>

                  <p className="text-xs text-schin-gray-light">PNG, JPG ou JPEG</p>
                </div>

                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e: any) => {
                    const selected = Array.from(e.target.files) as File[];
                    if (selected.length > 0) {
                      setFiles(selected);
                      const fileName = document.getElementById("fileName");
                      if (fileName)
                        fileName.textContent = selected
                          .map((f: any) => f.name)
                          .join(", ");
                      toast.success("Imagem anexada com sucesso");
                    }
                  }}
                />
              </label>
            </div>

            <p id="fileName" className="mt-3 text-center text-sm text-gray-600"></p>
          </div>

          <div className="w-full h-30  mt-38 flex flex-row">
            <div className="w-1/2 h-full  flex flex-row relative pt-10 justify-center gap-3 border-r-2 border-schin-gray-strong  ">
              <Text size="large" className="text-schin-gray-light absolute top-0 ">
                Converter extensão
              </Text>
              <Button
                text="Webp"
                size="small"
                onChildClick={() => (ext === 1 ? setExt(0) : setExt(1))}
                activate={ext === 1}
              />
              <Button
                text="png"
                size="small"
                onChildClick={() => (ext === 2 ? setExt(0) : setExt(2))}
                activate={ext === 2}
              />
              <Button
                text="jpeg"
                size="small"
                onChildClick={() => (ext === 3 ? setExt(0) : setExt(3))}
                activate={ext === 3}
              />
            </div>
            <div className="w-1/2 h-full  flex flex-row relative pt-10 justify-center gap-3 ">
              <Text size="large" className="text-schin-gray-light absolute top-0 ">
                Redimensionar imagem
              </Text>
              <Input
                label=""
                size="medium"
                InputConfig={{
                  placeholder: "Largura em pixel...",
                  onChange: (e) => setImgWidth(e.target.value),
                }}
              />
              <Input
                label=""
                size="medium"
                InputConfig={{
                  placeholder: "Altura em pixel...",
                  onChange: (e) => setImgHeight(e.target.value),
                }}
              />
            </div>
          </div>

          <div className="w-full h-30  mt-20 flex flex-row">
            <div className="w-1/2 h-full  flex flex-row relative pt-10 justify-center gap-3 border-r-2 border-schin-gray-strong">
              <Text size="large" className="text-schin-gray-light absolute top-0 ">
                Diminuir tamanho de arquivo
              </Text>
              <Button
                text="Manter qualidade"
                size="small"
                onChildClick={() =>
                  reduceImg === 1 ? setReduceImg(0) : setReduceImg(1)
                }
                activate={reduceImg === 1}
              />
              <Button
                text="Deixar leve"
                size="small"
                onChildClick={() =>
                  reduceImg === 2 ? setReduceImg(0) : setReduceImg(2)
                }
                activate={reduceImg === 2}
              />
              <Button
                text="Reduzir muito"
                size="small"
                onChildClick={() =>
                  reduceImg === 3 ? setReduceImg(0) : setReduceImg(3)
                }
                activate={reduceImg === 3}
              />
            </div>
            <div className="w-1/2 h-full  flex flex-row relative pt-10 justify-center gap-3">
              <Text size="large" className="text-schin-gray-light absolute top-0 ">
                Diminuir proporção
              </Text>
              <Button
                text="25%"
                size="small"
                onChildClick={() =>
                  resizeScale === 1 ? setResizeScale(0) : setResizeScale(1)
                }
                activate={resizeScale === 1}
              />
              <Button
                text="50%"
                size="small"
                onChildClick={() =>
                  resizeScale === 2 ? setResizeScale(0) : setResizeScale(2)
                }
                activate={resizeScale === 2}
              />
              <Button
                text="75%"
                size="small"
                onChildClick={() =>
                  resizeScale === 3 ? setResizeScale(0) : setResizeScale(3)
                }
                activate={resizeScale === 3}
              />
            </div>
          </div>

          <div className="w-full h-30   mt-20 flex flex-row">
            <div className="w-1/2 h-full  flex flex-row relative pt-10 justify-center gap-3 border-r-2 border-schin-gray-strong">
              <Text size="large" className="text-schin-gray-light absolute top-0 ">
                Formatação inteligente
              </Text>
              <Button
                text="Para rapidez"
                size="small"
                onChildClick={() => (formatI === 1 ? setFormatI(0) : setFormatI(1))}
                activate={formatI === 1}
              />
              <Button
                text="Para qualidade"
                size="small"
                onChildClick={() => (formatI === 2 ? setFormatI(0) : setFormatI(2))}
                activate={formatI === 2}
              />
              <Button
                text="Upscale (Beta)"
                size="small"
                onChildClick={() => (formatI === 3 ? setFormatI(0) : setFormatI(3))}
                activate={formatI === 3}
              />
            </div>
            <div className="w-1/2 h-full  flex flex-row relative pt-10 justify-center gap-3">
              <Button
                text="Formatar"
                size="large"
                contrastStyle
                onChildClick={() => handleFormat()}
              />
            </div>
          </div>
        </>
      ) : (
        <section className=" w-full h-full flex flex-col items-center ">
          <div className="flex items-center justify-center w-full bg-schin-black mt-15">
            <label className="flex  flex-col items-center justify-center w-80 max-w-md h-30 border-2 border-dashed border-schin-gray-strong rounded-2xl cursor-pointer transition-all duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-3 text-schin-gray-light"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                    
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V4m0 0l-4 4m4-4l4 4m6 8v8m0 0l-4-4m4 4l4-4"
                  />
                </svg>

                <p className="mb-2 text-sm text-schin-gray-light">
                  <span className="font-semibold">
                    Clique para enviar uma imagem
                  </span>
                </p>

                <p className="text-xs text-schin-gray-light">PNG, JPG ou JPEG</p>
              </div>

              <input
                id="fileUpload"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e: any) => {
                  const selected = Array.from(e.target.files) as File[];
                  if (selected.length > 0) {
                    setFiles(selected);
                    const fileName = document.getElementById("fileName");
                    if (fileName)
                      fileName.textContent = selected
                        .map((f: any) => f.name)
                        .join(", ");
                    toast.success("Imagem anexada com sucesso");
                  }
                }}
              />
            </label>
          </div>

          <div className="w-115 border-schin-gray-strong border rounded-2xl py-8 mt-5 h-10/10 min-h-35 flex flex-col overflow-scroll hide-scrollbar gap-15 ">
            <div className="w-full h-30 flex flex-row relative pt-10 justify-center gap-3 border-r-2 border-schin-gray-strong  ">
              <Text size="large" className="text-schin-gray-light absolute top-0 ">
                Converter extensão
              </Text>
              <Button
                text="Webp"
                size="small"
                onChildClick={() => (ext === 1 ? setExt(0) : setExt(1))}
                activate={ext === 1}
              />
              <Button
                text="png"
                size="small"
                onChildClick={() => (ext === 2 ? setExt(0) : setExt(2))}
                activate={ext === 2}
              />
              <Button
                text="jpeg"
                size="small"
                onChildClick={() => (ext === 3 ? setExt(0) : setExt(3))}
                activate={ext === 3}
              />
            </div>
            <div className="w-full h-h-30   flex flex-row relative pt-10 justify-center gap-3 ">
              <Text size="large" className="text-schin-gray-light absolute top-0 ">
                Redimensionar imagem
              </Text>
              <Input
                label=""
                size="small"
                InputConfig={{
                  placeholder: "Largura",
                  onChange: (e) => setImgWidth(e.target.value),
                  style: {textAlign: 'center', paddingLeft: '0'}
                }}
              />
              <Input
                label=""
                size="small"
                InputConfig={{
                  placeholder: "Altura",
                  onChange: (e) => setImgHeight(e.target.value),
                     style: {textAlign: 'center', paddingLeft: '0'}
                }}
              />
            </div>
            <div className="w-full h-30  flex flex-row relative pt-10 justify-center gap-3 border-r-2 border-schin-gray-strong">
              <Text size="large" className="text-schin-gray-light absolute top-0 ">
                Diminuir tamanho de arquivo
              </Text>
              <Button
                text="Manter qualidade"
                size="small"
                onChildClick={() =>
                  reduceImg === 1 ? setReduceImg(0) : setReduceImg(1)
                }
                activate={reduceImg === 1}
              />
              <Button
                text="Deixar leve"
                size="small"
                onChildClick={() =>
                  reduceImg === 2 ? setReduceImg(0) : setReduceImg(2)
                }
                activate={reduceImg === 2}
              />
              <Button
                text="Reduzir muito"
                size="small"
                onChildClick={() =>
                  reduceImg === 3 ? setReduceImg(0) : setReduceImg(3)
                }
                activate={reduceImg === 3}
              />
            </div>
            <div className="w-full h-30  flex flex-row relative pt-10 justify-center gap-3">
              <Text size="large" className="text-schin-gray-light absolute top-0 ">
                Diminuir proporção
              </Text>
              <Button
                text="25%"
                size="small"
                onChildClick={() =>
                  resizeScale === 1 ? setResizeScale(0) : setResizeScale(1)
                }
                activate={resizeScale === 1}
              />
              <Button
                text="50%"
                size="small"
                onChildClick={() =>
                  resizeScale === 2 ? setResizeScale(0) : setResizeScale(2)
                }
                activate={resizeScale === 2}
              />
              <Button
                text="75%"
                size="small"
                onChildClick={() =>
                  resizeScale === 3 ? setResizeScale(0) : setResizeScale(3)
                }
                activate={resizeScale === 3}
              />
            </div>
            <div className="w-full h-30  flex flex-row relative pt-10 justify-center gap-3 border-r-2 border-schin-gray-strong">
              <Text size="large" className="text-schin-gray-light absolute top-0 ">
                Formatação inteligente
              </Text>
              <Button
                text="Para rapidez"
                size="small"
                onChildClick={() => (formatI === 1 ? setFormatI(0) : setFormatI(1))}
                activate={formatI === 1}
              />
              <Button
                text="Para qualidade"
                size="small"
                onChildClick={() => (formatI === 2 ? setFormatI(0) : setFormatI(2))}
                activate={formatI === 2}
              />
              <Button
                text="Upscale (Beta)"
                size="small"
                onChildClick={() => (formatI === 3 ? setFormatI(0) : setFormatI(3))}
                activate={formatI === 3}
              />
            </div>
          </div>
          <div className="w-1/2 h-3/20  flex relative justify-center mt-3 gap-3">
            <Button
              text="Formatar"
              size="medium"
              contrastStyle
              onChildClick={() => handleFormat()}
            />
          </div>
        </section>
      )}
    </motion.div>
  );
}