import express from "express";
import dotenv from "dotenv";
import { getDBFromContext } from "../util/uow.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello API" });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
