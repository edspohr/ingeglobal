// Extracts up to two initials from a display name.
// - "Edmundo Administrador" -> "EA"
// - "Juan Soto"             -> "JS"
// - "Fernando"              -> "F"
// - null / "" / whitespace  -> "?"
// - three or more words: first initial + last initial
export function getInitials(displayName) {
  if (typeof displayName !== "string") return "?";
  const words = displayName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  const first = words[0].charAt(0);
  const last = words[words.length - 1].charAt(0);
  return (first + last).toUpperCase();
}
