// @ts-ignore
import React, { useState } from "react";
// @ts-ignore
import { scanStudentCard, isUniBZCard } from "./ocr";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

function parseStudentCard(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const result: { name?: string; surname?: string; studentId?: string; [key: string]: any } = {};

  for (const line of lines) {
    const idMatch = line.match(/\b(\d{6,12})\b/);
    if (idMatch) {
      result.studentId = idMatch[1];
      break;
    }
  }

  if (lines.length > 0) {
    const nameLine = lines[0].replace(/[^A-Za-zÀ-ž\s'-]/g, "").trim();
    const parts = nameLine.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      result.name = parts[0];
      result.surname = parts.slice(1).join(" ");
    } else if (parts.length === 1) {
      result.name = parts[0];
    }
  }

  return result;
}

export default function VerifyStudent() {
  interface StudentData {
    name?: string;
    surname?: string;
    studentId?: string;
    [key: string]: any;
  }

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<StudentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const text = await scanStudentCard(file);
      if (typeof text !== "string" || !text.trim()) {
        throw new Error("Nessun testo rilevato nella scansione");
      }
      
      // ✅ Validate that it's a UniBZ card
      if (!isUniBZCard(text)) {
        throw new Error("❌ Solo le carte UniBZ sono accettate. Inserisci una carta della Libera Università di Bolzano.");
      }
      
      const parsed = parseStudentCard(text) as StudentData;
      setResult(parsed ?? null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Errore durante la scansione";
      console.error(err);
      setError(errorMessage);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  // @ts-ignore - React JSX runtime types not available
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Verifica Student Card UniBZ</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFile(e.target.files?.[0] ?? null)
        }
      />

      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        disabled={!file || loading}
      >
        {loading ? "Scansione..." : "Scansiona"}
      </button>

      {error && (
        <div className="mt-4 p-4 border border-red-500 bg-red-50 rounded text-red-700">
          <p><strong>Errore:</strong> {error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 border border-green-500 bg-green-50 rounded">
          <p className="text-green-700 mb-3">✅ Card UniBZ riconosciuta!</p>
          <p><strong>Nome:</strong> {result.name}</p>
          <p><strong>Cognome:</strong> {result.surname}</p>
          <p><strong>Matricola:</strong> {result.studentId}</p>
        </div>
      )}
    </div>
  );
}
