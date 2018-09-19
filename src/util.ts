/**
 * Always positive modulus
 * @param x Operand
 * @param n Modulus
 * @returns x modulo n
 */
export function mod(x: number, n: number): number {
  return (x % n + n) % n;
}

export function clamp(val: number, min = 0, max = 1): number {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}
