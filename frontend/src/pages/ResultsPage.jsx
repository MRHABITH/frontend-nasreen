import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResults, downloadReport } from '../services/api';
import { Button } from '../components/ui/Button';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
    AlertTriangle, CheckCircle, Download, ArrowLeft, Loader2,
    Type, BookOpen, AlignLeft, AlertCircle, SpellCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import RewriteTool from '../components/RewriteTool';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ResultsPage() {
    const { taskId } = useParams();
    const [result, setResult] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await getResults(taskId);
                setResult(data);
            } catch (err) {
                setError("Failed to load results.");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [taskId]);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const blob = await downloadReport(taskId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `plagiarism_report_${taskId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download report. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500">Analyzing content...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/check">
                        <Button variant="outline">Try Again</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Default metrics if not present (backward compatibility)
    const metrics = result.metrics || {
        readability_score: 0,
        readability_label: 'N/A',
        spelling_errors: 0,
        grammar_issues: 0,
        additional_issues: 0
    };

    const chartData = {
        labels: ['Unique', 'Plagiarized'],
        datasets: [
            {
                data: [100 - result.overall_similarity, result.overall_similarity],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link to="/check" className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Check Another
                    </Link>
                    <div className="flex gap-3">
                        <span className={cn("px-3 py-1 rounded-full text-sm font-medium flex items-center",
                            result.verdict === "Clean" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}>
                            {result.verdict === "Clean" ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
                            {result.verdict}
                        </span>
                        <Button onClick={handleDownload} disabled={downloading} size="sm">
                            {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                            {downloading ? "PDF..." : "Download Report"}
                        </Button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                    {/* Main Plagiarism Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center border border-gray-100 relative overflow-hidden">
                        <h3 className="text-gray-500 font-medium mb-4 uppercase tracking-wider text-sm">Plagiarism Score</h3>
                        <div className="relative w-40 h-40">
                            <Doughnut data={chartData} options={{ cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={cn("text-4xl font-extrabold", result.overall_similarity > 20 ? "text-red-600" : "text-green-600")}>
                                    {result.overall_similarity}%
                                </span>
                            </div>
                        </div>
                        <p className="mt-4 text-center text-sm text-gray-400 max-w-xs">{result.explanation}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Grammar */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm uppercase tracking-wide font-medium">Grammar Issues</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{metrics.grammar_issues}</p>
                                <p className="text-xs text-gray-400 mt-1">Potential errors found</p>
                            </div>
                            <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                                <Type className="h-6 w-6" />
                            </div>
                        </div>

                        {/* Spelling */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm uppercase tracking-wide font-medium">Spelling</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{metrics.spelling_errors}</p>
                                <p className="text-xs text-gray-400 mt-1">Misspelled words</p>
                            </div>
                            <div className="h-12 w-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
                                <SpellCheck className="h-6 w-6" />
                            </div>
                        </div>

                        {/* Readability */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm uppercase tracking-wide font-medium">Readability</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">{metrics.readability_label}</p>
                                <p className="text-xs text-gray-400 mt-1">Score: {metrics.readability_score}</p>
                            </div>
                            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                                <BookOpen className="h-6 w-6" />
                            </div>
                        </div>

                        {/* Conciseness / Sentences */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm uppercase tracking-wide font-medium">Conciseness</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{metrics.additional_issues}</p>
                                <p className="text-xs text-gray-400 mt-1">Long sentences</p>
                            </div>
                            <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                                <AlignLeft className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Analysis */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Detailed Text Analysis</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {result.detailed_scores.map((item, index) => (
                            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className={cn("min-w-[60px] text-center px-2 py-1 rounded text-xs font-bold uppercase",
                                        item.similarity_score > 80 ? "bg-red-100 text-red-700" :
                                            item.similarity_score > 40 ? "bg-orange-100 text-orange-700" :
                                                "bg-green-100 text-green-700"
                                    )}>
                                        {item.similarity_score.toFixed(0)}%
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-800 leading-relaxed">{item.sentence}</p>

                                        {item.matched_source && (
                                            <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-bold text-red-700 uppercase block mb-1">Matched Source</span>
                                                        <p className="text-sm text-gray-600 italic">"{item.matched_source}"</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">{item.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <RewriteTool />
            </div>
        </div>
    );
}

