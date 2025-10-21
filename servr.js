import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// --- Paths ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middlewares ---
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- MongoDB ---
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch((err) => console.error("❌ Error:", err));

// --- Schema y Modelo ---
const voteSchema = new mongoose.Schema({
    voterId: String,
    candidate: String,
});
const Vote = mongoose.model("nominated_admins_list", voteSchema);

// --- Candidatos ---
const candidates = ["Lexi", "Will", "Gaby", "Alex", "Alex Pato"];

// --- Función para verificar si ya es hora de revelar ---
const revealTime = new Date(process.env.REVEAL_TIME);
function isRevealTime() {
    return new Date() >= revealTime;
}

// --- Ruta principal ---
app.get("/", async (req, res) => {
    const voterId = req.cookies.voterId;

    if (isRevealTime()) {
        const results = await Vote.aggregate([
            { $group: { _id: "$candidate", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        return res.render("results", { results });
    }

    if (voterId) {
        // Ya votó
        return res.render("index", { candidates: null, voted: true });
    }

    res.render("index", { candidates, voted: false });
});

// --- Enviar voto ---
app.post("/vote", async (req, res) => {
    const { candidate } = req.body;
    const voterId = req.cookies.voterId;

    if (voterId) return res.redirect("/");

    if (!candidates.includes(candidate)) return res.status(400).send("Candidato inválido");

    const uniqueId = Math.random().toString(36).substring(2, 15);
    res.cookie("voterId", uniqueId, { maxAge: 1000 * 60 * 60 * 24 * 365 });

    await Vote.create({ voterId: uniqueId, candidate });
    res.redirect("/");
});

// --- Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 Servidor en http://localhost:${PORT}`));
