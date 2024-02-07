const express = require("express");
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors())
app.use(morgan('tiny')) //logs api req and res

export default app;

