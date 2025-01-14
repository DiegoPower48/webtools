"use client";
import React, { useEffect, useState } from "react";

export default function Block() {
  const [data, setData] = useState("");
  const [txtname, setTxtName] = useState("nota");

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
    <div className="bg-black  h-full w-full border-4 border-white ">
      <div className="flex w-full border-b-2 border-white h-1/6">
        <div className="flex w-4/6">
          <div className="flex items-center bg-white text-black">Nombre: </div>
          <input
            className="p-2 w-full bg-black outline-none resize-none"
            spellCheck="false"
            type="text"
            value={txtname}
            onChange={nombre}
          />
        </div>
        <div
          onClick={exportToTextFile}
          className="flex p-2 w-2/6 text-black bg-white hover:bg-red-700 hover:text-white items-center justify-center font-bold "
        >
          Descargar
        </div>
      </div>
      <div className="h-5/6">
        <textarea
          className="  bg-black text-white h-full w-full p-5 resize-none border-b-2 border-white"
          spellCheck="false"
          value={data}
          onChange={handle}
        ></textarea>
      </div>
    </div>
  );
}
