export function toTitleCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      if (word.length === 0) return word;
      if (word.includes("-")) {
        return word
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("-");
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
