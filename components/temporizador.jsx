"use client";
import axios from "axios";

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

const publicKey =
  "BMx5hpBdfRZdXhHf95gX5yX4iXTupWYCA6ERRvA6j-gb7bG4XT2rM0XLfWwz_VL0CFYMEkfKm0dYC6vVfrYgHXM";

const enviarSuscripcion = async (subscription) => {
  try {
    const response = await axios.post("/notificacion", subscription, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Respuesta del servidor:", response.data);
  } catch (error) {
    console.error(
      "Error enviando la suscripción al servidor:",
      error.response?.data || error.message
    );
  }
};

export default function Temporizador() {
  const notificacion = () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado:", registration);

          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_KEY
              ),
            })
            .then((subscription) => {
              console.log("Suscripción generada:", subscription);
              enviarSuscripcion(subscription);
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
    <div>
      <div
        onClick={() => {
          notificacion();
        }}
      >
        TEMPORIZADOR
      </div>
    </div>
  );
}
