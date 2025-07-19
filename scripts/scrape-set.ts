import dotenv from "dotenv";
import { writeFile } from "fs/promises";
import path from "path";

const [setId] = process.argv.slice(2);

if (!setId) {
  console.error("SetId required");
  process.exit(1);
}

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const get = (endpoint: string) => {
  const url = [process.env.API_URL, endpoint].join("");
  console.log(url);
  return fetch(url, {
    headers: { "x-Api-Key": String(process.env.API_KEY) },
  }).then((response) => response.json());
};

const scrape = async (setId: string) => {
  let page = 0;
  let pages = 1;
  const cards: any[] = [];

  const setsPath = path.resolve(__dirname, "..", "sets", "en.json");

  const sets = await import(setsPath).then(({ default: data }) => data);
  const { data: setData } = await get(["/sets", setId].join("/"));

  const nextSets = [...sets.filter(({ id }) => id !== setId), setData];

  await writeFile(setsPath, JSON.stringify(nextSets, undefined, 2));

  while (page < pages) {
    const iteration = page || 1;
    const data = (await get(
      ["/cards", `q=set.id:${setId}&page=${iteration}`].join("?")
    )) as { data: any[]; page: number; count: number; pageSize: number };

    console.log(`Page: ${iteration} of ${pages}`);

    pages = Math.ceil(data.count / data.pageSize);
    page = data.page;

    cards.push(...data.data);
  }

  if (cards.length) {
    console.log(`Set: ${setId} Total: ${cards.length}`);
    await writeFile(
      path.resolve(__dirname, "..", "cards", "en", `${setId}.json`),
      JSON.stringify(
        cards.map(
          ({ tcgplayer: _, cardmarket: __, set: ___, ...card }) => card
        ),
        undefined,
        2
      )
    );
  }
};

scrape(setId).then(() => process.exit(0));
