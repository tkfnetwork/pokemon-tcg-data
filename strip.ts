import { writeFileSync } from "node:fs";
import path from "node:path";

const start = async () => {
  for (const rawPath of ["cards/en/sv6.json"]) {
    const filePath = path.resolve(__dirname, rawPath);
    const { default: data } = await import(filePath);
    writeFileSync(
      filePath,
      JSON.stringify(
        data.map(({ cardmarket, tcgplayer, set, ...item }) => item)
      )
    );
  }
  return;
};

start()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
