/**
 * Always positive modulus
 * @param x Operand
 * @param n Modulus
 * @returns x modulo n
 */
export function mod(x, n) {
    return (x % n + n) % n;
}
export function clamp(val, min = 0, max = 1) {
    if (val < min)
        return min;
    if (val > max)
        return max;
    return val;
}
