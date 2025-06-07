import express from "express";
import multer from "multer";
import cors from "cors";
import * as tf from "@tensorflow/tfjs-node";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import feedbackRoutes from "./feedback.js";

 // Initialize MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


  // Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const CLASS_NAMES = ["Hawar", "Karat", "Layu", "Sehat"];
let model = null;
let isModelLoading = false;

// Load model with retry
const loadModelWithRetry = async (maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Loading model (attempt ${attempt}/${maxRetries})...`);
      model = await tf.loadGraphModel("file://model/model.json");
      console.log("✅ Model loaded");
      return true;
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed: ${err.message}`);
      if (attempt === maxRetries) return false;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

(async () => {
  isModelLoading = true;
  await loadModelWithRetry();
  isModelLoading = false;
})();

// === ROUTES BEFORE 404 ===
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    model_loaded: !!model,
    model_loading: isModelLoading,
    tensorflow_version: tf.version.tfjs,
    node_version: process.version,
    timestamp: new Date().toISOString()
  });
});

app.post("/api/predict", upload.single("image"), async (req, res) => {
  if (!model || isModelLoading) {
    return res.status(503).json({ error: "Model belum siap." });
  }

  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: "Gambar tidak ditemukan" });
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: "Format gambar tidak didukung." });
  }

  try {
    const decodedImage = tf.node.decodeImage(req.file.buffer, 3);
    const inputTensor = tf.tidy(() => {
      const resized = tf.image.resizeBilinear(decodedImage, [224, 224]);
      const normalized = resized.sub(tf.scalar(127.5)).div(tf.scalar(127.5));
      return tf.expandDims(normalized, 0);
    });

    const prediction = model.predict(inputTensor);
    const data = await prediction.data();

    const maxIndex = data.indexOf(Math.max(...data));
    const confidence = data[maxIndex];

    res.json({
      className: CLASS_NAMES[maxIndex],
      probability: parseFloat(confidence.toFixed(4)),
      allPredictions: CLASS_NAMES.map((name, index) => ({
        className: name,
        probability: parseFloat(data[index].toFixed(4))
      })).sort((a, b) => b.probability - a.probability),
      processingTime: Date.now(),
      timestamp: new Date().toISOString()
    });

    tf.dispose([decodedImage, inputTensor, prediction]);

  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Gagal memproses gambar" });
  }
});

// Memory route
app.get("/api/memory", (req, res) => {
  res.json({
    memory: tf.memory(),
    process: process.memoryUsage()
  });
});

// Feedback route harus sebelum 404
app.use("/api/feedback", feedbackRoutes); // ✅ INI PENTING

// === 404 HANDLER (setelah semua route valid) ===
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    available_endpoints: [
      "GET /api/health",
      "POST /api/predict",
      "POST /api/feedback",
      "GET /api/feedback",
      "GET /api/memory"
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
