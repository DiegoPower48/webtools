import React from "react";
import Recorder from "../../components/recorder";
import Block from "../../components/block";
import Calculator from "../../components/calculator";
import Temporizador from "../../components/temporizador";

export default function page() {
  return (
    <div className="grid grid-rows-[1fr,9fr,1fr] h-screen">
      <div className="row-span-1 font-bold text-4xl grid justify-center items-center p-4 mb-4 bg-red-800">
        WELCOME TO WEBTOOLS
      </div>
      <div className="row-span-2 grid grid-cols-2 grid-rows-2 items-center gap-5 ">
        <div className="h-full w-full">
          <Recorder />
        </div>
        <div className="  h-full w-full">
          <Temporizador />
        </div>
        <div className="  h-full w-full">
          <Block />
        </div>
        <div className="  h-full w-full">
          <Calculator />
        </div>
      </div>
      <div className="row-span-1 grid">
        <a href="https://diegotorres-portfoliodev.vercel.app">
          Web created by: Diego Torres
        </a>
      </div>
    </div>
  );
}
