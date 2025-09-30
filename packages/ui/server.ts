import next from "next";
import { endDb, getDb } from "@my-project/common/db";
import express from "express";
import routes from "@my-project/server/routes";
import { parse } from "node:url";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import type { AddressInfo } from "net";

// noinspection SpellCheckingInspection
const { promise: terminate, resolve: terminateResolve } = Promise.withResolvers<void>();
process.on("SIGINT", terminateResolve);
process.on("SIGTERM", terminateResolve);

const development = process.env.NODE_ENV !== "production";
if (!development) {
    const nextConfig = (await readFile(".next/required-server-files.json")).toString("utf-8");
    const nextConfigJson = JSON.parse(nextConfig);
    process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfigJson.config);
}

// Next application
const nextApp = next({ dev: development, customServer: true });
const nextAppHandler = nextApp.getRequestHandler();

// Warm-up
await getDb();

// Start-up
await nextApp.prepare();

// Prepare API routes
const expressApp = express();
expressApp.enable("strict routing");
expressApp.use(routes());

expressApp.use(async (req, res) => {
    const parsedUrl = parse(req.url!, true);
    await nextAppHandler(req, res, parsedUrl);
});


const server = createServer(expressApp);

const { promise: listening, resolve: listeningResolve, reject: listeningReject } = Promise.withResolvers<void>();
server.once("error", listeningReject);
server.once("listening", () => {
  server.off("error", listeningReject);
  listeningResolve();
});

server.listen(Number.parseInt(process.env.PORT ?? "3000"));

try {
    await listening;
    server.off("error", listeningReject);

    console.log(`Server listening on port ${ (server.address() as AddressInfo).port } as ${ development ? "development" : "production" }`);

    // Wait for termination
    await terminate;

    console.log("Terminating...");
} catch (err) {
    console.error(err);
    console.log("Cleaning up...");
}

const stopPromises = [
    nextApp.close(),
    ...(server.listening ? [new Promise<void>((resolve, reject) => {
      server.close((err?: Error) => (err ? reject(err) : resolve()));
    }) ] : [])
];
try {
    await Promise.all(stopPromises);
} catch (err) {
    console.error(err);
} finally {
    await Promise.allSettled(stopPromises);
}

await endDb();

console.log("Terminated");
process.exit(0);
