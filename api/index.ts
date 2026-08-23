import express from "express";
import { configureApp } from "../server";

const app = express();
configureApp(app);

export default app;
