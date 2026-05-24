import { bootstrapWorker } from "@vendure/core";
import { config } from "./vendure-config";

bootstrapWorker(config)
  .then((worker) => worker.startJobQueue())
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
