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

export default function Temporizador() {
  const notificacion = () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("Service Worker registrado.");

        // Solicitar permiso
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Permiso concedido.");

            // Suscribir al usuario
            registration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey),
              })
              .then((subscription) => {
                console.log("Suscripción exitosa:", subscription);
                // Envía la suscripción al servidor
                axios.post(
                  "http://localhost:3000/notificacion",
                  JSON.stringify(subscription)
                );
              })
              .catch((error) => {
                console.error("Error al suscribir al usuario:", error);
              });
          }
        });
      });
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
