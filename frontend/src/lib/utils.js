// lib/utils.js
export function formatDate(date) {
  return date.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
 