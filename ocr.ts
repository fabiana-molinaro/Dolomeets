export async function scanStudentCard(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", "eng");
  formData.append("OCREngine", "2");

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: import.meta.env.VITE_OCR_API_KEY,
    },
    body: formData,
  });

  const data = await res.json();

  if (!data.ParsedResults || data.ParsedResults.length === 0) {
    throw new Error("Nessun testo trovato");
  }

  const text = data.ParsedResults[0].ParsedText;

  return text;
}
