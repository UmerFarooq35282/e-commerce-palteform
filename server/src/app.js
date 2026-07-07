import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { notfoundError } from "./middlewares/notfound.middleware.js"
import { errorHandleMiddleware } from "./middlewares/error.middleware.js"
import { requestIdMiddleware } from "./middlewares/request-id.middleware.js"
import healthRouter from "./routes/health.routes.js"
import authRouter from "./routes/auth.routes.js";


const app = express();
app.use(cors());
app.use(helmet())
app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/health", healthRouter)

app.use("/api/v1/auth", authRouter);


app.use(notfoundError)
app.use(errorHandleMiddleware)
app.use(requestIdMiddleware);

export { app } 