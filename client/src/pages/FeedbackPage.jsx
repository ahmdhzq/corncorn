import { useEffect, useState } from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackCard from "../components/FeedbackCard";

const API_BASE = import.meta.env.VITE_API_URL;

function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    const fetchFeedbacks = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/api/feedback?page=${page}&limit=5`);
            setFeedbacks(res.data.feedbacks);
            setPagination(res.data.pagination);
            setError(null);
        } catch (err) {
            console.error("Gagal mengambil data feedback:", err);
            setError("Gagal mengambil data feedback");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchFeedbacks(newPage);
        // Smooth scroll to top of feedback section
        document.getElementById('feedback-list')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    };

    const handleFeedbackSent = () => {
        // Reset to first page when new feedback is added
        fetchFeedbacks(1);
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
            <div className="max-w-4xl mx-auto py-12 px-6">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                        Umpan Balik Pengguna
                    </h1>
                    <p className="text-gray-600 text-lg">Bagikan pengalaman dan saran Anda untuk membantu kami berkembang</p>
                </div>

                {/* Feedback Form */}
                <div className="mb-16">
                    <FeedbackForm onFeedbackSent={handleFeedbackSent} />
                </div>

                {/* Feedback List Section */}
                <div className="space-y-8" id="feedback-list">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <h2 className="text-2xl font-bold text-gray-800 px-6">Daftar Umpan Balik</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>
                        {pagination.totalItems > 0 && (
                            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {pagination.totalItems} total feedback
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-gray-600 font-medium">Memuat feedback...</span>
                            </div>
                        </div>
                    )}

                    {feedbacks.length === 0 && !error && !loading && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg font-medium">Belum ada feedback</p>
                            <p className="text-gray-400 mt-2">Jadilah yang pertama memberikan feedback!</p>
                        </div>
                    )}

                    {!loading && (
                        <div className="grid gap-6">
                            {feedbacks.map((fb, i) => (
                                <FeedbackCard
                                    key={`${pagination.currentPage}-${i}`}
                                    feedback={fb.feedback}
                                    timestamp={fb.timestamp}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && !loading && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Halaman <span className="font-semibold">{pagination.currentPage}</span> dari{' '}
                                <span className="font-semibold">{pagination.totalPages}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrevPage}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Sebelumnya
                                </button>

                                {/* Page Numbers */}
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = pagination.currentPage - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                    pageNum === pagination.currentPage
                                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                                        : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Selanjutnya
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FeedbackPage;