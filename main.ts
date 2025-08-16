import express, { json } from "express";
import { env } from "./src/config/env";
import router from "./src/services/auth/auth.router";

const port = env.PORT;

const app = express();

app.use(json());
app.use("/auth", router);

app.get("/", (_, res) => {
  res.send("dont worry, ur app is fine...");
});

app.listen(port, () => {
  console.log(`STUFF app listening on port ${port}`);
});
