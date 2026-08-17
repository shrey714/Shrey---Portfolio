import { createApplication } from "./server/_core/app";
import { serveStatic } from "./server/_core/ssrServer";

const app = createApplication();
serveStatic(app);

export default app;
