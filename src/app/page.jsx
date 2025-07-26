import React from "react";
import Recorder from "../components/recorder";
import Block from "../components/block";
import Calculator from "../components/calculator";
import Conversor from "@/components/Conversor";

export default function page() {
  return (
    <div
      className={`grid  ${
        process.env.NODE_ENV === "development" ? "debug-screens" : ""
      }`}
    >
      <div className="font-bold text-4xl grid h-28 justify-center items-center text-center md:p-4 md:mb-4 bg-red-800">
        <div>WELCOME TO FAST TOOLS</div>
        <div className="text-lg">(browser edition)</div>
      </div>
      <div className="h-full grid grid-cols-1 md:grid-cols-2 auto-rows-[350px] items-center gap-y-4 md:gap-5 ">
        <Conversor />
        <Recorder />
        <Block />
        <Calculator />
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
