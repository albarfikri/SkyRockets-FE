export const capitalizeWord = (s: string) => s[0].toUpperCase() + s.slice(1);

export const capitalizeEachWord = (s: string) => s.replace(/\b\w/g, (char) => char.toUpperCase());