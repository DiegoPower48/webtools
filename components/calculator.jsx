"use client";
import React, { useState } from "react";

const Calculator = () => {
  const [input, setInput] = useState(""); // Estado para el input del usuario
  const [result, setResult] = useState("");

  // Manejar la entrada del usuario
  const handleInput = (value) => {
    const newInput = input + value;
    setInput(newInput);

    // Calcular automáticamente
    try {
      const evalResult = eval(newInput); // Evalúa la expresión
      setResult(evalResult.toString());
    } catch {
      setResult(""); // Si hay un error (expresión inválida), limpiar resultado
    }
  };

  // Realizar la operación
  const calculateResult = () => {
    try {
      // Evaluar la expresión ingresada
      const result = eval(input); // Nota: Usa eval con precaución
      setResult(result.toString());
    } catch (error) {
      setInput("Error");
    }
  };

  // Limpiar la entrada
  const clearInput = () => {
    setInput("");
    setResult("");
  };

  return (
    <div className="max-w-xs mx-auto  p-4 bg-gray-100 rounded-lg shadow-lg">
      <div className="mb-4">
        <input
          type="text"
          value={input}
          readOnly
          className="w-full p-2 text-right text-black bg-white border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        {result && `= ${result}` ? (
          <div className="flex w-full p-2  text-black h-5 items-center justify-center">
            {result}
          </div>
        ) : (
          <div className="w-full p-2 text-right text-black h-5"></div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[
          "7",
          "8",
          "9",
          "/",
          "4",
          "5",
          "6",
          "*",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          "+",
        ].map((symbol) => (
          <button
            key={symbol}
            onClick={() => handleInput(symbol)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {symbol}
          </button>
        ))}
        <button
          onClick={clearInput}
          className="col-span-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Calculator;
