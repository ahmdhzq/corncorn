import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

function FeedbackForm({ onFeedbackSent }) {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE}/api/feedback`, { feedback });
      setSubmitted(true);
      setFeedback("");
      if (typeof onFeedbackSent === "function") {
        onFeedbackSent(); // panggil fetchFeedbacks dari parent
      }
    } catch (error) {
      console.error("Gagal mengirim feedback:", error);
      alert("Gagal mengirim feedback. Coba lagi nanti.");
    }
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl shadow-emerald-500/5 overflow-hidden">
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-cyan-50/80"></div>
      
      {/* Animated border */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl animate-pulse opacity-30"></div>
      
      <div className="relative z-10 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-600 block">
              Kirim Feedback Baru
            </span>
            <span className="text-xs text-gray-500 mt-1">Ceritakan pengalaman Anda</span>
          </div>
        </div>

        {!submitted ? (
          <div className="space-y-6">
            <div className="relative">
              <textarea
                placeholder="Bagaimana pengalaman Anda? Ceritakan kepada kami..."
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-400 shadow-sm"
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {feedback.length}/500
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className="group relative w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-1 disabled:transform-none overflow-hidden"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                Kirim Feedback
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </span>
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-emerald-600 font-bold text-xl mb-2">Terima kasih!</p>
            <p className="text-gray-600">Ulasan Anda berhasil dikirim dan sangat berarti bagi kami</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackForm;