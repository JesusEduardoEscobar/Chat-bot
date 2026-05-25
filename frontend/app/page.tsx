"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [type, setType] = useState("explain");
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const sendMessage = async () => {
    try {
      setLoading(true);
      if (pdfFile) {
        const formData = new FormData();
        formData.append("pdf", pdfFile);
        let endpoint = "";

        switch (type) {
          case "quiz":
            endpoint = "generateQuiz";
            break;
          case "summary":
            endpoint = "summarizePdf";
            break;
          default:
            endpoint = "summarize-pdf";
        }

        const res = await axios.post(
          `http://localhost:4040/api/ai/${endpoint}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setResponse(
          res.data.summary ||
          res.data.quiz ||
          "No se obtuvo respuesta"
        );

      } else {
        const res = await axios.post(
          "http://localhost:4040/api/ai/chat",
          {
            message,
            type,
          }
        );
        setResponse(res.data.response);
      }
    } catch (error) {
      console.log(error);
      setResponse(
        "Ocurrió un error al conectar con el backend"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-3">
          AI Study Assistant
        </h1>
        <p className="text-zinc-400 text-lg">
          Resume PDFs, genera quizzes y aprende con IA
        </p>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => {
            setType("explain");
            setPdfFile(null);
          }}
          className={`
            px-5 py-3 rounded-2xl transition-all cursor-pointer
            ${
              type === "explain"
                ? "bg-blue-500"
                : "bg-zinc-800 hover:bg-zinc-700"
            }
          `}
        >
          Explicar
        </button>
        <button
          onClick={() => setType("quiz")}
          className={`
            px-5 py-3 rounded-2xl transition-all cursor-pointer
            ${
              type === "quiz"
                ? "bg-green-500"
                : "bg-zinc-800 hover:bg-zinc-700"
            }
          `}
        >
          Quiz PDF
        </button>
        <button
          onClick={() => setType("summary")}
          className={`
            px-5 py-3 rounded-2xl transition-all cursor-pointer
            ${
              type === "summary"
                ? "bg-purple-500"
                : "bg-zinc-800 hover:bg-zinc-700"
            }
          `}
        >
          Resumen PDF
        </button>
      </div>
      <div className="mb-5">
        <span className="text-zinc-400">
          Modo actual:
        </span>
        <span className="ml-2 font-bold capitalize">
          {type}
        </span>
      </div>

      {type !== "explain" && (
        <div className="mb-8">
          <label
            className="
              flex
              items-center
              justify-center
              w-full
              h-40
              border-2
              border-dashed
              border-zinc-700
              rounded-3xl
              cursor-pointer
              hover:border-blue-500
              transition-all
              bg-zinc-900
            "
          >
            <div className="text-center">
              <p className="font-semibold text-lg">
                Subir PDF
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                Haz click para seleccionar un archivo
              </p>
              {pdfFile && (
                <p className="mt-4 text-green-400 font-semibold">
                  {pdfFile.name}
                </p>
              )}
            </div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPdfFile(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      )}

      {type === "explain" && (
        <textarea
          className="
            w-full
            min-h-[200px]
            bg-zinc-900
            border
            border-zinc-700
            rounded-3xl
            p-6
            outline-none
            resize-none
            focus:border-blue-500
            transition-all
            text-lg
          "
          placeholder="Escribe aquí tu pregunta o tema..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      )}

      <button
        onClick={sendMessage}
        disabled={loading}
        className="
          mt-8
          bg-white
          text-black
          px-8
          py-4
          rounded-2xl
          font-bold
          text-lg
          hover:scale-105
          transition-all
          cursor-pointer
          disabled:opacity-50
        "
      >
        {loading ? "Generando..." : "Enviar"}
      </button>

      <div
        className="
          mt-12
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-8
        "
      >
        {response ? (
          <div className="whitespace-pre-wrap leading-8 text-zinc-200">
            {response}
          </div>
        ) : (
          <p className="text-zinc-500">
            Aquí aparecerá la respuesta de la IA...
          </p>
        )}

      </div>

    </main>
  );
}