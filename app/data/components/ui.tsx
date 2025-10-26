export function cn(...arr: (string | boolean | undefined)[]) {
  return arr.filter(Boolean).join(" ");
}

export function ron(n: number) {
  try { return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(n); }
  catch { return `${n} RON`; }
}

export function waOrderLink(productName: string, priceRON: number) {
  const phone = "40721527147";
  const msg = `Salut! Vreau sa comand: ${productName} (${priceRON} RON).`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
