// @ts-ignore
import React, { useState } from "react";
// @ts-ignore
import { scanStudentCard } from "./ocr";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Lightweight local parser to replace the missing external module.
// It extracts a probable studentId (6-12 digits) and a simple name/surname from the first meaningful line.
function parseStudentCard(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const result: { name?: string; surname?: string; studentId?: string; [key: string]: any } = {};

  // find a numeric student id (6-12 digits) anywhere in the text
  for (const line of lines) {
    const idMatch = line.match(/\b(\d{6,12})\b/);
    if (idMatch) {
      result.studentId = idMatch[1];
      break;
    }
  }

  // use the first non-empty line as a name line and split into name/surname
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

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    try {
      const text = await scanStudentCard(file);
      if (typeof text !== "string" || !text.trim()) {
        throw new Error("Nessun testo rilevato nella scansione");
      }
      const parsed = parseStudentCard(text) as StudentData;
      setResult(parsed ?? null);
    } catch (err) {
      console.error(err);
      alert("Errore durante la scansione");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  // @ts-ignore - React JSX runtime types not available
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Verifica Student Card</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFile(e.target.files?.[0] ?? null)
        }
      />

      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!file || loading}
      >
        {loading ? "Scansione..." : "Scansiona"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <p><strong>Nome:</strong> {result.name}</p>
          <p><strong>Cognome:</strong> {result.surname}</p>
          <p><strong>Matricola:</strong> {result.studentId}</p>
        </div>
      )}
    </div>
  );
}
