// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import addInsight from "./operations/add-insight.ts";
import { createTableStatement } from "./tables/insights.ts";
import { Insight } from "./models/insight.ts";
import deleteInsight from "./operations/delete-insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
try {
  // Pass the imported raw SQL string directly into the database execution engine
  db.sql([createTableStatement] as any);
  console.log("🎉 SUCCESS: Insights table verified and ready!");
} catch (error) {
  console.error("❌ Failed to verify database structure:", error);
}

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx: { response: { body: string; status: number; }; }) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx: { response: { body: Insight[]; status: number; }; }) => {
  const result = listInsights({ db });
  console.log(`listInsights result: ${JSON.stringify(result)}`);
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx: { params: Record<string, any>; response: { body: any; status: number; }; }) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  console.log(`lookupInsight result: ${JSON.stringify(result)}`);
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights/create", async (ctx: { request: { body: { json: () => any; }; }; response: { body: any; status: number; }; }) => {
  const body = await ctx.request.body.json();
  const params = body as Record<string, any>;
  const result = addInsight({ db, brand: params.brand, text: params.content });
  console.log(`addInsight result: ${JSON.stringify(result)}`);
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.delete("/insights/:id", (ctx: { params: Record<string, any>; response: { status: number; body: { error: string; }; }; }) => {
  const params = ctx.params as Record<string, any>
  const id = parseInt(params.id, 10)
  if (isNaN(id)) {
    ctx.response.status = 400
    ctx.response.body = { error: "Invalid ID" }
    return;
  }
  const result = deleteInsight({ db, id })
  console.log(`Deleting insight with id=${id}`)
  ctx.response.status = 200
  ctx.response.body = result
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
