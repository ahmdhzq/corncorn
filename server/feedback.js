import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', new mongoose.Schema({
    feedback: String,
    timestamp: { type: Date, default: Date.now }
}));

router.post('/', async (req, res) => {
    try {
        const { feedback } = req.body;
        if (!feedback || typeof feedback !== 'string') {
            return res.status(400).json({ error: "Feedback kosong atau tidak valid" });
        }

        const newFeedback = new Feedback({ feedback });
        await newFeedback.save();
        console.log("✅ Feedback saved:", newFeedback);
        res.status(201).json({ message: "Feedback berhasil disimpan" });
    } catch (err) {
        console.error("❌ Error simpan feedback:", err);
        res.status(500).json({ error: "Gagal menyimpan feedback" });
    }
});

router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default 5 items per page
    const skip = (page - 1) * limit;

    try {
        const total = await Feedback.countDocuments();
        const feedbacks = await Feedback.find({}, { feedback: 1, timestamp: 1, _id: 0 })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            feedbacks,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage,
                hasPrevPage
            }
        });
    } catch (error) {
        console.error("❌ Error fetch feedbacks:", error);
        res.status(500).json({ error: "Gagal mengambil data feedback" });
    }
});

export default router;