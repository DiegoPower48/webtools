import React from "react";
import Recorder from "../components/recorder";
import Block from "../components/block";
import Calculator from "../components/calculator";
import Temporizador from "../components/temporizador";

export default function page() {
  return (
    <div
      className={`grid grid-rows-[2fr,20fr,1fr] md:grid-rows-[1fr,9fr,1fr] md:h-screen ${
        process.env.NEXT_PUBLIC_DEVELOPMENT ? "debug-screens" : ""
      }`}
    >
      <div className="font-bold text-4xl grid h-32 justify-center items-center text-center md:p-4 md:mb-4 bg-red-800">
        <div>WELCOME TO FAST TOOLS</div>
        <div className="text-lg">(browser edition)</div>
      </div>
      <div className=" md:row-span-2  grid  grid-cols-1 md:grid-cols-2 md:grid-rows-2 grid-rows-4 items-center gap-y-4 md:gap-5 ">
        <div className="h-full w-full ">
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
      <div className="flex justify-between items-center px-10">
        <a href="https://diegotorres-portfoliodev.vercel.app">
          Web created by: Diego Torres
        </a>
        <div>Browser edition</div>
      </div>
    </div>
  );
}
