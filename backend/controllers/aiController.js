import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";
import dotenv from "dotenv"

dotenv.config()

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

const parsePDF = (buffer) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataReady", (data) => {
            const text = data.Pages
                .flatMap(page => page.Texts)
                .map(t => decodeURIComponent(t.R.map(r => r.T).join("")))
                .join(" ");
            resolve(text);
        });

        pdfParser.on("pdfParser_dataError", (err) => {
            reject(err);
        });

        pdfParser.parseBuffer(buffer);
    });
};

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const result = await model.generateContent(message);
        const aiResponse = result.response.text();
        
        res.json({
            success: true,
            response: aiResponse
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Error al generar la respuesta"
        });
    }
};

export const summarizePDF = async (req, res) => {
    try {
        const pdfBuffer = req.file.buffer;
        const text = await parsePDF(pdfBuffer);
        
        const prompt = `Resume el siguiente documento de forma clara y organizada: ${text}`;
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();
        
        res.json({
            success: true,
            summary: aiResponse
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Error al resumir el PDF"
        });
    }
};

export const generateQuiz = async (req, res) => {
    try {
        const pdfBuffer = req.file.buffer;
        const text = await parsePDF(pdfBuffer);

        const prompt = `Genera un quiz de 10 preguntas basado en el siguiente documento.
        Incluye:
        - Pregunta
        - 4 opciones
        - Respuesta correcta
        
        Documento:
        ${text}`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        res.json({
            success: true,
            quiz: aiResponse
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Error al generar el quiz"
        });
    }
};