"use client";

import { useState, useRef } from "react";

export default function Conversor() {
  const [preview, setPreview] = useState(null);
  const [webpUrl, setWebpUrl] = useState(null);
  const [filename, setFilename] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFilename(nameWithoutExt);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const webpBlobUrl = URL.createObjectURL(blob);
          setWebpUrl(webpBlobUrl);
        }, "image/webp");
        setPreview(img.src);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => e.preventDefault();
  const canvasRef = useRef();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFilename(nameWithoutExt);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const webpBlobUrl = URL.createObjectURL(blob);
          setWebpUrl(webpBlobUrl);
        }, "image/webp");

        setPreview(img.src);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full w-full flex flex-col items-center border-2 border-white rounded-md ">
      <div className="bg-red-700 h-16 items-center justify-center flex w-full">
        <h1 className="text-xl font-bold text-center">CONVERT IMAGE TO .WEB</h1>
      </div>
      <div
        className={`grid ${
          webpUrl && "grid-cols-[3fr_1fr]"
        } p-5 h-full justify-center`}
      >
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full h-full flex flex-col justify-center items-center"
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
                <div className="uppercase">{'"' + filename + '"'}</div>
              </>
            ) : (
              <div className="font-bold">SELECT OR DRAG IMAGEN</div>
            )}
          </label>
          <input
            className="bg-red-500 hidden"
            type="file"
            id="imagen"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {webpUrl && (
          <div className="w-full h-full flex items-center">
            <a
              href={webpUrl}
              download={`${filename}.webp`}
              className="bg-green-500 flex text-center justify-center items-center font-bold text-xl text-white p-2 rounded hover:bg-green-600"
            >
              CONVERT & DOWNLOAD
            </a>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
