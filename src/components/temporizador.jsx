"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

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
  console.log(message, time);
  try {
    const payload = {
      subscription,
      message: message,
      time: time,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/notificacion`,
      payload
    );

    toast.success(
      `Timer set:
      Message: ${message}
      Time: ${time}`,
      {
        style: {
          background: "#333",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "16px",
        },
      }
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
      className="h-full w-full grid grid-cols-2 grid-rows-6 border-2 justify-center rounded-md  border-white p-5x"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full row-span-2 col-span-2 grid grid-rows-[2fr,1fr,1fr] p-5 border-b-2 border-white ">
        <div className=" flex w-full rounded-xl ">
          <div className="rounded-l-lg  flex w-1/6 justify-center items-center font-bold  bg-white text-black">
            Message:
          </div>
          <textarea
            className="rounded-r-lg  w-full text-white bg-black border-white border-2 justify-center content-center pl-2 resize-none "
            type="text"
            {...register("message", {
              required: "Message is required",
              maxLength: { value: 80, message: "Max 80 characters" },
            })}
          />
        </div>
        <div className="text-red-600 font-bold flex items-end justify-center">
          {errors.message && errors.message.message}
        </div>
      </div>
      <div className="w-full row-span-4 col-span-2 grid grid-cols-2">
        <div className="grid grid-rows-[1fr,1fr,1fr,1fr] justify-center">
          <div className="w-full font-bold row-span-1 flex justify-center items-center">
            TIME:
          </div>
          <input
            type="time"
            className="w-44 row-span-1  rounded-xl flex  text-4xl   justify-end text-black"
            {...register("time", { required: "Time is required" })}
          />

          <div className="text-red-600  grid-rows-1  font-bold flex items-center justify-center">
            {errors.time && errors.time.message}
          </div>
        </div>
        <button
          className="md:m-9 m-6 flex items-center justify-center font-bold p-4 bg-red-800 rounded-lg  hover:bg-red-600"
          type="submit"
        >
          SET TIME
        </button>
      </div>
      <Toaster />
    </form>
  );
}
