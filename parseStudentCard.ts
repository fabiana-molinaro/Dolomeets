export function parseStudentCard(text: string) {
  const lines = text.split("\n").map(l => l.trim());

  let name = "";
  let surname = "";
  let studentId = "";

  // Esempio: matricola = numero di 6–8 cifre
  const idRegex = /\b\d{6,8}\b/;

  for (const line of lines) {
    if (idRegex.test(line)) {
      studentId = line.match(idRegex)![0];
    }

    // euristica semplice: prima riga = nome cognome
    if (!name && line.split(" ").length >= 2) {
      const parts = line.split(" ");
      name = parts[0];
      surname = parts.slice(1).join(" ");
    }
  }

  return {
    name,
    surname,
    studentId,
  };
}
