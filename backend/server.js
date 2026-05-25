import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import aiRoutes from "./routes/aiRoutes.js"
import { genAI } from "./controllers/aiController.js";

dotenv.config()
// console.log(process.env.GEMINI_API_KEY)
// console.log(genAI)
const app = express()
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}))
app.use(express.json())

app.use("/api/ai", aiRoutes)

const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
    console.log(`Se conecto de forma correcta, PUERTO=${PORT}`)
})