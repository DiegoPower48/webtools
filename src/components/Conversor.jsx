"use client";

import { useEffect, useRef, useState } from "react";

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

  // Redibuja en canvas cuando cambian valores importantes
  useEffect(() => {
    if (!originalImage || !canvasRef.current || !width || !height) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const finalWidth = parseInt(width);
    const finalHeight = parseInt(height);
    const mimeType = `image/${format}`;

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    ctx.clearRect(0, 0, finalWidth, finalHeight);
    ctx.drawImage(originalImage, 0, 0, finalWidth, finalHeight);

    canvas.toBlob((blob) => {
      if (!blob) {
        alert(`El formato "${format}" no es soportado por tu navegador.`);
        return;
      }

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

  const syncAspect = (type, value) => {
    const val = parseInt(value);
    if (!aspectRatio || isNaN(val)) return;

    if (type === "width") {
      setWidth(val);
      setHeight(Math.round(val / aspectRatio));
    } else {
      setHeight(val);
      setWidth(Math.round(val * aspectRatio));
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center border-2 border-white rounded-md">
      <div className="bg-red-700 h-16 items-center justify-center flex w-full">
        <h1 className="text-xl font-bold text-center">CONVERT IMAGE</h1>
      </div>

      <div
        className={`grid ${
          webUrl && "grid-cols-[3fr_1fr] grid-rows-2"
        } p-5 h-full justify-center`}
      >
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="row-span-2 w-full h-full flex flex-col justify-center items-center"
        >
          <label
            htmlFor="imagen"
            className="h-full flex gap-4 items-center flex-col justify-center"
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Vista previa"
                  className="max-h-48 object-contain border rounded"
                />
                <div className="">{'"' + filename + "." + format}</div>
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
          <>
            <div>
              <p className="text-lg font-bold">Select format:</p>
              <div className="w-full flex justify-center">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mt-4 h-fit p-1 border rounded text-black"
                >
                  <option value="webp">WEBP</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="bmp">BMP</option>
                  <option value="avif">AVIF</option>
                </select>
              </div>
              <div className="text-black flex gap-2 mt-2">
                <input
                  name="width"
                  type="number"
                  className="w-full text-center"
                  value={width}
                  onChange={(e) => syncAspect("width", e.target.value)}
                />
                <input
                  name="height"
                  type="number"
                  className="w-full text-center"
                  value={height}
                  onChange={(e) => syncAspect("height", e.target.value)}
                />
              </div>
            </div>
            <div className="w-full h-full flex items-center">
              <a
                href={webUrl}
                download={`${filename}.${format}`}
                className="bg-green-500 flex text-center justify-center items-center font-bold text-xl text-white p-2 rounded hover:bg-green-600"
              >
                CONVERT & DOWNLOAD
              </a>
            </div>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
