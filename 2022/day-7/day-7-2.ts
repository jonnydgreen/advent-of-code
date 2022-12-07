const input = await Deno.readTextFile("input.txt");

const directoryContents = new Map<string, (string | number)[]>();
let currentDirName = "";
let currentDirContents = [];
let shouldAddContents = false;
const currentPath: string[] = [];
for (const line of input.split("\n")) {
  if (line.startsWith("$ cd")) {
    if (shouldAddContents) {
      directoryContents.set(currentPath.join("-"), currentDirContents);
    }
    currentDirName = line.replace("$ cd", "").trim();
    if (currentDirName === "..") {
      currentPath.pop();
    } else {
      currentPath.push(currentDirName);
    }
    shouldAddContents = false;
    currentDirContents = [];
    continue;
  }

  if (line.startsWith("$ ls")) {
    shouldAddContents = true;
    continue;
  }

  if (shouldAddContents) {
    if (line.startsWith("dir ")) {
      currentDirContents.push(line.replace("dir ", "").trim());
    } else {
      currentDirContents.push(Number(line.split(" ")[0].trim()));
    }
  }
}
directoryContents.set(currentPath.join("-"), currentDirContents);

function getDirectorySize(
  currentPath: string,
  dirContents: (string | number)[],
): number {
  let size = 0;
  for (const dirOrFile of dirContents) {
    if (typeof dirOrFile === "string") {
      size += getDirectorySize(
        `${currentPath}-${dirOrFile}`,
        directoryContents.get(`${currentPath}-${dirOrFile}`) ?? [],
      );
    } else {
      size += dirOrFile;
    }
  }
  return size;
}

const directorySizes = new Map<string, number>();
for (const [name, contents] of directoryContents.entries()) {
  directorySizes.set(name, getDirectorySize(name, contents));
}

const minimumDirectorySize = 30000000 - (70000000 - (directorySizes.get("/") ?? 0));
let smallestDir = directorySizes.get("/") ?? 70000000
for (const [, size] of directorySizes.entries()) {
  if (size >= minimumDirectorySize && size <= smallestDir) {
    smallestDir = size;
  }
}
console.log(smallestDir)
