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

export function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.substring(1);
}

interface HasMap {
	() : string;
	map: {[key:string]: string};
}

/**
 * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
 * @param {string} template
 * @param {any} [argv]
 */
export function format(template: string, ...args: any[]): string {
	let map = (format as HasMap).map;

	let replacer = function(match: string, group1: string, group2: string, index: number) {
		if (template.charAt(index-1) == "%") { return match.substring(1); }
		if (!args.length) { return match; }
		let obj = args[0];

		let group = group1 || group2;
		let parts = group.split(",");
		let name = parts.shift() || "";
		let method = map[name.toLowerCase()];
		if (!method) { return match; }

		obj = args.shift();
		let replaced = obj[method].apply(obj, parts);

		let first = name.charAt(0);
		if (first != first.toLowerCase()) { replaced = capitalize(replaced); }

		return replaced;
	};
	return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
}

(format as HasMap).map = {
	"s": "toString"
}
