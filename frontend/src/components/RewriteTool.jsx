import React, { useState } from 'react';

import { Button } from './ui/Button';
import { Loader2, RefreshCw, Copy, Download, Check, Wand2, FileText } from 'lucide-react';
import { rewriteText, generatePDF } from '../services/api';

export default function RewriteTool() {
    const [text, setText] = useState('');
    const [mode, setMode] = useState('academic');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRewrite = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const data = await rewriteText(text, mode);
            setResult(data.rewritten_text);
        } catch (err) {
            console.error(err);
            alert("Rewrite failed. Please check the backend connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleAIGenerate = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const data = await rewriteText(text, 'comprehensive');
            setResult(data.rewritten_text);
        } catch (err) {
            console.error(err);
            alert("AI Generation failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!result) return;
        setPdfLoading(true);
        try {
            const blob = await generatePDF(result);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ai_generated_document.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("PDF download failed:", err);
            alert("Failed to download PDF.");
        } finally {
            setPdfLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadDoc = () => {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + `<p>${result.replace(/\n/g, "<br>")}</p>` + footer;

        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'rewritten_text.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <RefreshCw className="w-5 h-5 mr-2 text-indigo-600" />
                AI Smart Rewriter
            </h3>

            <div className="flex flex-col gap-4">
                <textarea
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[150px]"
                    placeholder="Paste text here to rewrite..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Mode:</label>
                        <select
                            className="p-2 border border-gray-200 rounded-md text-sm bg-gray-50"
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                        >
                            <option value="academic">Academic / Technical (Remove Plagiarism)</option>
                            <option value="humanize">Humanize / Natural Flow</option>
                            <option value="fix">Fix Errors & Logic</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleRewrite} disabled={loading || !text.trim()} variant="outline">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Rewrite
                        </Button>
                        <Button onClick={handleAIGenerate} disabled={loading || !text.trim()} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700">
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                            AI Generate (Fix All)
                        </Button>
                    </div>
                </div>

                {result && (
                    <div className="mt-6 bg-indigo-50 rounded-lg p-6 border border-indigo-100 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-bold text-indigo-900 uppercase">Rewritten Result</h4>
                            <div className="flex gap-2">
                                <button onClick={handleCopy} className="p-2 hover:bg-white rounded-md transition-colors text-indigo-600" title="Copy">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button onClick={handleDownloadDoc} className="p-2 hover:bg-white rounded-md transition-colors text-indigo-600" title="Download Word Doc">
                                    <FileText className="w-4 h-4" />
                                </button>
                                <Button onClick={handleDownloadPDF} disabled={pdfLoading} size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                    {pdfLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Download className="w-3 h-3 mr-1" />}
                                    PDF
                                </Button>
                            </div>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{result}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
