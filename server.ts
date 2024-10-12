import { merge } from "config-plus"
import dotenv from "dotenv"
import express, { json, Request, Response } from "express"
import { allow, MiddlewareLogger } from "express-ext"
import http from "http"
import { createLogger } from "logger-core"
import { Pool } from "pg"
import { PoolManager } from "pg-extension"
import { config, env } from "./config"
import { useContext } from "./context"
import { route } from "./route"

dotenv.config()
const conf = merge(config, process.env, env, process.env.ENV)

const app = express()
// Define public folder :
app.use(express.static(__dirname + "/public"))
// Setup views folder :
app.set("views", __dirname + "/views")
// Setup view engine :
app.set("view engine", "ejs")

const logger = createLogger(conf.log)
const middleware = new MiddlewareLogger(logger.info, conf.middleware)
app.use(allow(conf.allow), json(), middleware.log)

const pool = new Pool(conf.db)
const db = new PoolManager(pool)
const ctx = useContext(db, logger, middleware)
route(app, ctx)

app.get("/", (req: Request, res: Response) => {
  res.render("index", {
    message: "Welcome in Express",
  })
})

http.createServer(app).listen(conf.port, () => {
  console.log("Start server at port " + conf.port)
})
