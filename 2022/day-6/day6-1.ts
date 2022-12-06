const input = await Deno.readTextFile("input.txt");

for (const pointer of [...new Array(input.length).keys()]) {
  if (pointer < 3) {
    continue;
  }
  const chunk = input.slice(pointer - 3, pointer + 1)
  if (chunk.length === 4 && new Set([...chunk]).size === 4) {
    console.log(pointer + 1, chunk)
    break
  }
}
