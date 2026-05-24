/* eslint-disable no-console */
import { generateMigration, revertLastMigration, runMigrations } from "@vendure/core";
import { config } from "./src/vendure-config";

const command = process.argv[2];
const name = process.argv[3];

(async () => {
  try {
    switch (command) {
      case "generate":
        if (!name) throw new Error("Usage: ts-node migration.ts generate <name>");
        await generateMigration(config, { name, outputDir: "./migrations" });
        break;
      case "run":
        await runMigrations(config);
        break;
      case "revert":
        await revertLastMigration(config);
        break;
      default:
        console.log("Usage: ts-node migration.ts [generate|run|revert]");
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
