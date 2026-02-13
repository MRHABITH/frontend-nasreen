import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Zap, BarChart } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-8 w-8 text-indigo-600" />
                        <span className="text-xl font-bold text-gray-900">GoGenix-AI</span>
                    </div>
                    <Link to="/check" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">Get Started</Button>
                    </Link>
                </div>
            </header>

            <main>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Ensure Content Originality with <span className="text-indigo-600 block sm:inline">AI Precision</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-8 sm:mb-10">
                        Detect plagiarism, paraphrasing, and semantic similarities using advanced NLP and Sentence-BERT technology. Real-time analysis for students, researchers, and professionals.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/check">
                            <Button size="lg" className="rounded-full px-8 w-full sm:w-auto">Start Checking Now</Button>
                        </Link>
                        <Button variant="outline" size="lg" className="rounded-full px-8 w-full sm:w-auto">Learn More</Button>
                    </div>
                </div>

                {/* Features */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<FileText className="h-8 w-8 text-indigo-600" />}
                            title="Multi-Format Support"
                            description="Upload PDF, DOCX, or simple text. We handle processing and extraction seamlessly."
                        />
                        <FeatureCard
                            icon={<Zap className="h-8 w-8 text-indigo-600" />}
                            title="Semantic Analysis"
                            description="Beats simple keyword matching. Our AI understands context and detects smart paraphrasing."
                        />
                        <FeatureCard
                            icon={<BarChart className="h-8 w-8 text-indigo-600" />}
                            title="Detailed Reports"
                            description="Get comprehensive PDF reports with highlighted matches and similarity scores."
                        />
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sl">
                    &copy; {new Date().getFullYear()} AI-Plagiarism-Checker. Created by Nasreen and his teams. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="mb-4 bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}
