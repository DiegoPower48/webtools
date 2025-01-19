"use client";
import React, { useState } from "react";

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
      alert(`ERROR DE LA SOLICITUD, MENSAJE DE ERROR:${error.message}`);
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
      alert(`ERROR DE LA SOLICITUD, MENSAJE DE ERROR:${error.message}`);
    }
  };

  return (
    <>
      <div className="h-full border-2 border-white p-5">
        <div className="h-1/6 flex items-center justify-center p-10 bg-red-800 font-bold">
          Recorder
        </div>
        <div className="h-5/6 flex space-x-6  justify-center ">
          <div className=" flex items-center justify-center  ">
            <p
              onClick={() => {
                videoRecorder();
              }}
              className={`flex justify-center bg-red-700 p-20 rounded-lg font-bold hover:scale-105  ${grabando}`}
            >
              AUDIO
            </p>
          </div>
          <div className=" flex items-center justify-center ">
            <p
              onClick={() => {
                videoAndAudioRecorder();
              }}
              className={`flex  justify-center bg-red-700 p-20 rounded-lg font-bold  hover:scale-105 ${filmando}`}
            >
              VIDEO
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
