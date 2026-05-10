import { createServer } from "node:http";
import app from "../config/express.js";
import { env } from "../config/env.js";

const server = createServer(app);

server.listen(env.PORT, () => {
  const addressInfo = server.address();

  if (addressInfo && typeof addressInfo !== "string") {
    const host = addressInfo.address === "::" ? "localhost" : addressInfo.address;
    const port = addressInfo.port;

    console.log(`🚀 Server ready at http://${host}:${port}`);
  }
});
