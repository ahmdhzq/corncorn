import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE;

function ResultCard({ result }) {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (!result || typeof result.probability !== 'number') {
    return null; // atau tampilkan pesan error yang ramah
}


  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/api/feedback`, {
        prediction: result.className,
        probability: result.probability,
        feedback: feedback
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Gagal mengirim feedback:", error);
      alert("Gagal mengirim feedback. Coba lagi nanti.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200 shadow-sm">
      <span className="text-sm font-semibold uppercase tracking-wider text-gray-600 block mb-3">
        Catatan Akurasi
      </span>
      <p className="text-gray-700 leading-relaxed mb-4">
        {result.probability >= 0.7
          ? "Hasil deteksi sangat akurat. Kondisi daun telah teridentifikasi dengan baik. Lakukan tindakan sesuai rekomendasi di atas."
          : result.probability >= 0.4
          ? "Hasil deteksi cukup baik. Disarankan untuk mengambil foto dengan pencahayaan lebih baik untuk konfirmasi yang lebih akurat."
          : "Hasil deteksi kurang akurat. Silakan ambil foto ulang dengan kualitas yang lebih baik. Jika masalah berlanjut, konsultasikan dengan ahli pertanian."}
      </p>

      {!submitted ? (
        <div className="space-y-2">
          <textarea
            placeholder="Beri masukan atau ulasan di sini..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Kirim Ulasan
          </button>
        </div>
      ) : (
        <p className="text-green-600 font-semibold mt-2">✅ Ulasan berhasil dikirim. Terima kasih!</p>
      )}
    </div>
  );
}

export default ResultCard;
