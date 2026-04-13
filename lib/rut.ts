export function formatearRut(valor: string): string {
  const limpio = valor.replace(/[^0-9kK]/g, "").toUpperCase();
  if (limpio.length === 0) return "";
  if (limpio.length === 1) return limpio;

  const dv = limpio.slice(-1);
  const body = limpio.slice(0, -1);
  const bodyFormateado = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${bodyFormateado}-${dv}`;
}

function calcularDv(body: string): string {
  let sum = 0;
  let mult = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const r = 11 - (sum % 11);
  if (r === 11) return "0";
  if (r === 10) return "K";
  return String(r);
}

export function validarRut(rut: string): boolean {
  const limpio = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (limpio.length < 2) return false;
  const dv = limpio.slice(-1);
  const body = limpio.slice(0, -1);
  if (!/^\d+$/.test(body)) return false;
  return calcularDv(body) === dv;
}
