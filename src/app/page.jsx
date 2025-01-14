import React from "react";
import Recorder from "../../components/recorder";
import Block from "../../components/block";
import Calculator from "../../components/calculator";
import Temporizador from "../../components/temporizador";

export default function page() {
  return (
    <div className="w-screen h-screen p-10">
      <div className="flex h-20 font-bold text-4xl justify-center items-center border-b-4 border-white">
        WELCOME TO WEBTOOLS
      </div>
      <div className="h-5/6 grid grid-cols-2 grid-rows-2 items-center ">
        <Recorder />
        <Temporizador />
        <Block />
        <Calculator />
      </div>
    </div>
  );
}
