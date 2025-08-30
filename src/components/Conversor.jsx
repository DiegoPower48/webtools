"use client";

import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Conversor() {
  const canvasRef = useRef();
  const [preview, setPreview] = useState(null);
  const [webUrl, setWebpUrl] = useState(null);
  const [filename, setFilename] = useState("");
  const [format, setFormat] = useState("webp");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [aspectRatio, setAspectRatio] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const handleImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFilename(nameWithoutExt);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setPreview(img.src);
        setOriginalImage(img);
        setAspectRatio(img.width / img.height);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!originalImage || !canvasRef.current) return;

    const parsedWidth = parseInt(width);
    const parsedHeight = parseInt(height);

    if (isNaN(parsedWidth) || isNaN(parsedHeight)) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = parsedWidth;
    canvas.height = parsedHeight;

    ctx.clearRect(0, 0, parsedWidth, parsedHeight);
    ctx.drawImage(originalImage, 0, 0, parsedWidth, parsedHeight);

    const mimeType = `image/${format}`;
    canvas.toBlob((blob) => {
      
      const blobUrl = URL.createObjectURL(blob);
      setWebpUrl(blobUrl);
    }, mimeType);
  }, [format, width, height, originalImage]);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImage(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleImage(file);
  };

  const descargar = () => {
    if (
      !width ||
      !height ||
      isNaN(parseInt(width)) ||
      isNaN(parseInt(height))
    ) {
      toast.error("Por favor ingresa una resolución válida.");
      return;
    }
    const canvas = canvasRef.current;
    const mimeType = `image/${format}`;
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error(`El formato "${format}" no es soportado por tu navegador.`);
        return;
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.${format}`;
      link.click();
    }, mimeType);
  };

  return (
    <div className="h-full w-full flex flex-col items-center border-2 border-white rounded-md">
      <div className="bg-red-700 h-14 items-center justify-center flex w-full">
        <h1 className="text-xl font-bold text-center">CONVERT IMAGE</h1>
      </div>

      <div
        className={` ${
          webUrl ? "grid grid-cols-[3fr_1fr]":"flex w-full"
        } h-full justify-center`}
      >
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full h-full flex-1 justify-center items-center  border-t-2 border-r-2 border-white"
        >
          <label
            htmlFor="imagen"
            className="h-full w-full grid gap-4 items-center grid-rows-[5fr_1fr] justify-center"
          >
            {preview ? (
              <>
              <div className="w-full h-full flex justify-center items-center p-4">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="max-h-48 object-contain border rounded"
                /></div>
                <div className="w-full h-full flex items-center justify-center">
                <p className=" h-full flex justify-center items-center">{filename + "." + format}</p></div>
              </>
            ) : (
              <div className="font-bold">SELECT OR DRAG IMAGE</div>
            )}
          </label>
          <input
            className="hidden"
            type="file"
            id="imagen"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {webUrl && (
          <div className="p-4 flex flex-col gap-2 h-full  bg-red-700">
            <div className="flex h-full gap-2 flex-col py-2 ">
              <div className="w-full flex flex-col justify-center">
                <p className="text-xl font-bold">FORMAT:</p>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className=" h-fit p-1 border rounded text-black"
                >
                  <option value="webp">WEBP</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="bmp">BMP</option>
                  <option value="avif">AVIF</option>
                </select>
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-bold">RESOLUTION:</p>
                <div className="flex w-full gap-2 text-black text-center">
                  <input
                    name="width"
                    type="number"
                    className="w-full text-center p-1 rounded"
                    value={width}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWidth(val);
                      if (val && aspectRatio) {
                        setHeight(Math.round(parseInt(val) / aspectRatio));
                      }
                    }}
                  />
                  <div className="text-white h-full flex items-center">X</div>
                  <input
                    name="height"
                    type="number"
                   className="w-full text-center p-1 rounded"
                    value={height}
                    onChange={(e) => {
                      const val = e.target.value;
                      setHeight(val);
                      if (val && aspectRatio) {
                        setWidth(Math.round(parseInt(val) * aspectRatio));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center items-center">
              <div className="h-full">
                <button
                  onClick={() => descargar()}
                  className="bg-green-500 flex text-center justify-center items-center font-bold text-xl text-white p-2 rounded hover:bg-green-600"
                >
                  CONVERT & DOWNLOAD
                </button>
              </div>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <Toaster />
    </div>
  );
}
