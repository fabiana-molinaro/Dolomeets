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

/**
 * Validates if the card is a UniBZ (Free University of Bozen-Bolzano) student card
 */
export function isUniBZCard(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Check for UniBZ identifiers
  const unibzIndicators = [
    "libera università di bolzano",
    "free university of bozen",
    "bolzano",
    "bozen",
    "unibz",
    "università libera",
  ];

  return unibzIndicators.some(indicator => lowerText.includes(indicator));
}
