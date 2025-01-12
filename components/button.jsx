"use client";
import React, { useState } from "react";

export default function Button(props) {
  const { tipo, grabacion } = props;

  const [media, setMedia] = useState(grabacion);

  const date = new Date();

  const videoRecorder = async () => {
    try {
      alert("SE GRABARÁ SOLO VIDEO SIN AUDIO");
      const media = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
      });

      const mediarecorder = new MediaRecorder(media, {
        mimeType: "video/webm;codecs=vp8,opus",
      });
      mediarecorder.start();

      const [video] = media.getVideoTracks();
      video.addEventListener("ended", () => {
        mediarecorder.stop();
      });

      mediarecorder.addEventListener("dataavailable", (e) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(e.data);
        link.download = `${grabacion}.webm`;
        link.click();
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

      const mediarecorder = new MediaRecorder(media, {
        mimeType: "video/webm;codecs=vp8,opus",
      });
      mediarecorder.start();

      const [video] = media.getVideoTracks();
      video.addEventListener("ended", () => {
        mediarecorder.stop();
      });

      mediarecorder.addEventListener("dataavailable", (e) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(e.data);
        link.download = `${grabacion}.webm`;
        link.click();
      });
    } catch (error) {
      alert(`ERROR DE LA SOLICITUD, MENSAJE DE ERROR:${error.message}`);
    }
  };

  return (
    <>
      {media === "audio" ? (
        <div
          className="flex justify-center"
          onClick={() => {
            videoRecorder();
          }}
        >
          <p className="text-center w-64 bg-red-700 p-20 rounded-lg font-bold">
            {tipo}
          </p>
        </div>
      ) : (
        <div
          className="flex justify-center"
          onClick={() => {
            videoAndAudioRecorder();
          }}
        >
          <p className="text-center w-64 bg-red-700 p-20 rounded-lg font-bold">
            {tipo}
          </p>
        </div>
      )}
    </>
  );
}
