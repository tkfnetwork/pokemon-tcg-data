import data from "./cards/en/sv6.json" assert { type: "json" };
import { writeFileSync } from "node:fs";
import path from "node:path";

const start = async () => {
  console.log(path.resolve(__dirname, "./cards/en/sv6ee.json"));
  const d = writeFileSync(
    path.resolve(__dirname, "./cards/en/sv6ee.json"),
    JSON.stringify(data.map(({ cardmarket, tcgplayer, set, ...item }) => item))
  );

  console.log(d);
  return;
};

start()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
