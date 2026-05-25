import express from "express"
import multer from "multer"
import { chatWithAI, summarizePDF, generateQuiz } from "../controllers/aiController.js"

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
})

router.post("/chat", chatWithAI)
router.post("/summarizePdf", upload.single("pdf"), summarizePDF)
router.post('/generateQuiz', upload.single("pdf"), generateQuiz)

export default router