"use client";
import axios from "axios";
import { useState } from "react";
import { set, useForm } from "react-hook-form";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const enviarSuscripcion = async (subscription, message, time, reminder) => {
  try {
    const payload = {
      subscription,
      message: message,
      time: time,
      reminder: reminder,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/notificacion`,
      payload
    );
    console.log("Respuesta del servidor:", response.data);
  } catch (error) {
    console.error(
      "Error enviando la suscripción al servidor:",
      error.response?.data || error.message
    );
  }
};

export default function Temporizador() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_PUBLIC_KEY
              ),
            })
            .then((subscription) => {
              enviarSuscripcion(
                subscription,
                data.message,
                data.time,
                data.reminder
              );
            })
            .catch((error) => {
              console.error("Error al suscribirse:", error);
            });
        })
        .catch((error) => {
          console.error("Error registrando el Service Worker:", error);
        });
    } else {
      console.error(
        "Service Workers o Push Manager no son compatibles con este navegador."
      );
    }
  };

  return (
    <form
      className="h-full w-full grid grid-cols-2 grid-rows-4 border-2 border-white p-5x"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full col-span-2 row-span-1 flex p-5">
        <div className="flex w-1/6 justify-center items-center font-bold">
          Mensaje:
        </div>
        <input
          className="w-5/6  text-black"
          type="text"
          {...register("message", { required: true })}
        />
      </div>
      <div className="w-full row-span-3 col-span-2 grid grid-cols-2">
        <div className="grid grid-rows-4">
          <div className="w-full  flex justify-center items-center">HORA:</div>
          <div className="w-full h-full flex  text-black items-center justify-center ">
            <input
              type="time"
              className="h-full w-4/6 rounded-xl flex items-center justify-center "
              {...register("time", { required: true })}
            />
          </div>
          <div className="w-full  flex justify-center items-center">
            REPETIR CADA:
          </div>

          <select
            className="p-2 border border-gray-300 rounded w-full text-black"
            {...register("reminder")}
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
          </select>
        </div>
        <button
          className="m-16 flex items-center justify-center  p-4 bg-red-500 rounded-lg hover:scale-105"
          type="submit"
        >
          ESTABLECER RELOJ
        </button>
      </div>
    </form>
  );
}
