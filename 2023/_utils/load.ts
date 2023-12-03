import { join } from 'https://deno.land/std@0.208.0/path/mod.ts'

const ROOT = join(new URL('.', import.meta.url).pathname, '..')

export interface LoadInputOptions<TSplitLines extends boolean> {
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25
  splitLines: TSplitLines
  part: 1 | 2
  test?: boolean
}

export async function loadInput<
  TSplitLines extends boolean,
  TReturn extends TSplitLines extends true ? string[] : string
>(options: LoadInputOptions<TSplitLines>): Promise<TReturn> {
  const { day, part, test, splitLines } = options
  const inputPath = join(ROOT, `day-${day}`, `input-${day}-${part}${test ? '-test' : ''}.txt`)
  const text = await Deno.readTextFile(inputPath)
  return (splitLines ? text.split('\n').filter((l) => !!l) : text) as TReturn
}

export async function loadMatrix(options: Omit<LoadInputOptions<false>, 'splitLines'>): Promise<string[][]> {
  const raw = await loadInput({ ...options, splitLines: true })
  const edge = Array(raw[0].length + 2).fill('.')
  const input: string[][] = [[...edge]]
  for (const line of raw) {
    const newLine = ['.']
    newLine.push(...line.split(''))
    newLine.push('.')
    input.push([...newLine])
  }
  input.push([...edge])
  return input
}
