export function randomHex(len = 42) {
  const chars = "abcdef0123456789";
  let out = "0x";
  for (let i = 0; i < len - 2; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function randomCode(len = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function fmtDateSafe(d) {
  try { return new Date(d).toLocaleDateString("ru-RU"); } catch { return ""; }
}