"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Recorder() {
  const [filmando, setfilmando] = useState("");
  const [grabando, setGrabando] = useState("");

  const date = new Date();
  const fecha = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  // Obtener hora en formato hh:mm
  const hora = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const concate = `${fecha}-${hora}`;

  const videoRecorder = async () => {
    try {
      alert("SE GRABARÁ VIDEO SIN AUDIO");

      const media = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
      });

      const mediarecorder = new MediaRecorder(media, {
        mimeType: "video/webm;codecs=vp8,opus",
      });
      mediarecorder.start();
      setGrabando("bg-white text-gray-500 ");

      const [video] = media.getVideoTracks();
      video.addEventListener("ended", () => {
        mediarecorder.stop();
      });

      mediarecorder.addEventListener("dataavailable", (e) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(e.data);
        link.download = `${concate}.webm`;
        link.click();
        setGrabando("");
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const videoAndAudioRecorder = async () => {
    alert("SE GRABARÁ VIDEO CON AUDIO");

    try {
      const media = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: true,
      });
      setfilmando("bg-white text-gray-500");
      const mediarecorder = new MediaRecorder(media, {
        mimeType: "video/webm;codecs=vp8,opus",
      });
      mediarecorder.start();

      const [video] = media.getVideoTracks();
      video.addEventListener("ended", () => {
        mediarecorder.stop();
        setfilmando("");
      });

      mediarecorder.addEventListener("dataavailable", (e) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(e.data);
        link.download = `${concate}.webm`;
        link.click();
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="h-full grid border-2 border-white p-5">
        <div className="grid grid-cols-2 grid-row-1 md:gap-x-5 gap-x-4 ">
          <div className=" flex items-center justify-center ">
            <p
              onClick={() => {
                videoRecorder();
              }}
              className={`flex h-full w-full items-center justify-center bg-red-700  rounded-lg font-bold hover:scale-105  ${grabando}`}
            >
              <img className="fill-slate-800" src="./video.svg" alt="video" />
            </p>
          </div>
          <div className="  flex items-center justify-center ">
            <p
              onClick={() => {
                videoAndAudioRecorder();
              }}
              className={`flex h-full w-full items-center justify-center bg-red-700  rounded-lg font-bold  hover:scale-105 ${filmando}`}
            >
              <img src="./video.svg" alt="video" />
              <img src="./audio.svg" alt="audio" />
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
