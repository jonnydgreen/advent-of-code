const input = await Deno.readTextFile("input.txt");

for (const pointer of [...new Array(input.length).keys()]) {
  if (pointer < 13) {
    continue;
  }
  const chunk = input.slice(pointer - 13, pointer + 1)
  if (chunk.length === 14 && new Set([...chunk]).size === 14) {
    console.log(pointer + 1, chunk)
    break
  }
}
