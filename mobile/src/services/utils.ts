export const numberToPrice = (value: number = 0, prefix: string = null): string => {
    const [a, s] = `${value}`.split('.')
    const p = prefix ? `${prefix} ${a}` : a
    if (!s) return `${p},00`
    else if (s.length == 1) return `${p},${s}0`
    else return `${p},${s.substring(0,2)}`
}