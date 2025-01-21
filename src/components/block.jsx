"use client";
import React, { useEffect, useState } from "react";

export default function Block() {
  const [data, setData] = useState("");
  const [txtname, setTxtName] = useState("note");

  const exportToTextFile = () => {
    const blob = new Blob([data], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${txtname}.txt`; // Nombre del archivo descargado
    link.click();
  };

  const enviarDatos = async (id, texto) => {
    const datos = {
      id: id,
      texto: texto,
    };
    const array = JSON.stringify(datos);
    localStorage.setItem(`memoria`, array);
  };

  const handle = (event) => {
    const newValue = event.target.value;
    setData(newValue);
    enviarDatos(`memoria`, newValue);
  };

  useEffect(() => {
    try {
      const local = localStorage.getItem(`memoria`);
      const datos = JSON.parse(local);
      setData(datos.texto);
    } catch {
      localStorage.setItem(`memoria`, "");
    }
  }, []);

  const nombre = (event) => {
    const newValue = event.target.value;
    setTxtName(newValue);
  };

  return (
    <div className="h-full border-2 border-white rounded-md">
      <div className="grid grid-rows-1 grid-cols-8  border-b-2 h-1/6 ">
        <div className="col-span-1 flex justify-center items-center font-bold bg-white text-black">
          Name:
        </div>
        <input
          className="col-span-5 p-2 w-full bg-black outline-none resize-none"
          spellCheck="false"
          type="text"
          value={txtname}
          onChange={nombre}
        />
        <div
          onClick={exportToTextFile}
          className="col-span-2 flex p-2  bg-red-800 hover:bg-red-600 hover:text-white items-center justify-center font-bold "
        >
          Download
        </div>
      </div>
      <div className="h-5/6 grid">
        <textarea
          className="  bg-black text-white   p-5 resize-none"
          spellCheck="false"
          value={data}
          onChange={handle}
        ></textarea>
      </div>
    </div>
  );
}
