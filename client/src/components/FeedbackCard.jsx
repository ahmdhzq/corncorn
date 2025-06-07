import React from "react";
import { MessageSquare } from "lucide-react";

const FeedbackCard = ({ feedback, timestamp }) => {
    const formattedDate = new Date(timestamp).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
    });

    return (
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2 hover:bg-white relative overflow-hidden">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Animated border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <MessageSquare className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600 font-semibold tracking-wide uppercase">
                                Feedback Pengguna
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 font-medium mt-1 block">
                            {formattedDate}
                        </span>
                    </div>
                </div>
                
                <div className="pl-16">
                    <div className="relative">
                        <div className="absolute -left-8 top-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                        <p className="text-gray-700 leading-relaxed text-base font-medium">
                            {feedback}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20"></div>
        </div>
    );
};

export default FeedbackCard;