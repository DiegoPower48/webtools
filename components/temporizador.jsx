"use client";
import axios from "axios";
import { useForm } from "react-hook-form";

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

const enviarSuscripcion = async (subscription, message, time) => {
  try {
    const payload = {
      subscription,
      message: message,
      time: time,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    console.log(payload);
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
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
              enviarSuscripcion(subscription, data.message, data.time);
              reset();
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
      className="h-full w-full grid grid-cols-2 grid-rows-3 border-2 border-white p-5x"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full col-span-3 row-span-1  flex p-5">
        <div className="flex w-1/6 justify-center items-center font-bold">
          Mensaje:
        </div>
        <textarea
          className="w-3/6  text-white bg-black border-white border-2 justify-center items-center resize-none "
          type="text"
          {...register("message", {
            required: "Message is required",
            maxLength: { value: 30, message: "Max 30 characters" },
          })}
        />
        <div className="text-red-600 font-bold flex items-center justify-center w-2/6">
          {errors.message && errors.message.message}
        </div>
      </div>
      <div className="w-full row-span-2 col-span-2 grid grid-cols-2">
        <div className="grid grid-rows-6">
          <div className="w-full row-span-1 flex justify-center items-center">
            HORA:
          </div>
          <input
            type="time"
            className="w-4/6 row-span-3 m-7 rounded-xl flex items-center text-4xl justify-center text-black"
            {...register("time", { required: "Time is required" })}
          />

          <div className="text-red-600 grid-rows-1  font-bold flex items-center justify-center">
            {errors.message && errors.time.message}
          </div>
        </div>
        <button
          className="m-10 flex items-center justify-center  p-4 bg-red-500 rounded-lg hover:scale-105"
          type="submit"
        >
          ESTABLECER RELOJ
        </button>
      </div>
    </form>
  );
}
