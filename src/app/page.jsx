import React from "react";
import Button from "../../components/button";

export default function page() {
  return (
    <div className="w-screen h-screen">
      <div className="flex h-1/6 font-bold text-4xl justify-center items-center">
        WELCOME TO WEBTOOLS
      </div>
      <div className="h-5/6 grid grid-cols-2 grid-rows-2 items-center ">
        <Button tipo={"AUDIO"} grabacion={"audio"} />
        <Button tipo={"VIDEO"} grabacion={"video"} />
        <Button tipo={"AUDIO Y VIDEO"} />
        <Button tipo={"OTROS"} />
      </div>
    </div>
  );
}
