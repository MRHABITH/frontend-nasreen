import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { checkText, uploadFile } from '../services/api';

export default function CheckPage() {
    const [text, setText] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCheck = async () => {
        if (!text.trim()) return;
        setIsChecking(true);
        setError(null);
        try {
            const response = await checkText(text);
            // Navigate to results page with taskId
            navigate(`/results/${response.task_id}`);
        } catch (err) {
            console.error(err);
            const detail = err.response?.data?.detail;
            const errorMessage = typeof detail === 'object'
                ? JSON.stringify(detail)
                : (detail || err.message || "Failed to check text. Please try again.");
            setError(errorMessage);
        } finally {
            setIsChecking(false);
        }
    };

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            try {
                setIsChecking(true);
                // Special handling for text files to allow editing before check
                if (file.type === 'text/plain') {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setText(e.target.result);
                        setIsChecking(false);
                    };
                    reader.readAsText(file);
                    return;
                }

                // For PDF/DOCX, upload immediately and get results
                const response = await uploadFile(file);
                if (response.task_id) {
                    navigate(`/results/${response.task_id}`);
                } else {
                    alert("File uploaded but no task ID returned.");
                    setIsChecking(false);
                }
            } catch (err) {
                console.error(err);
                const detail = err.response?.data?.detail;
                let errorMessage;

                if (Array.isArray(detail)) {
                    errorMessage = detail.map(e => e.msg).join(", ");
                } else if (typeof detail === 'object') {
                    errorMessage = JSON.stringify(detail);
                } else {
                    errorMessage = detail || err.message || "File upload failed. Please try again.";
                }

                setError(errorMessage);
                setIsChecking(false);
            }
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/*': ['.txt'], 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] } });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Check for Plagiarism</h2>

                        <div className="mb-6">
                            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                                Paste your text here
                            </label>
                            <textarea
                                id="text-input"
                                rows={10}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 border"
                                placeholder="Enter text to analyze..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}>
                                <input {...getInputProps()} />
                                <CloudUpload className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500 text-center">
                                    Drag & drop files here, or click to select
                                </p>
                                <p className="text-xs text-gray-400 mt-1">.txt, .pdf, .docx supported</p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-4 rounded-md bg-red-50 flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-sm text-red-700">{error}</span>
                            </div>
                        )}

                        <div className="flex sm:justify-end">
                            <Button onClick={handleCheck} isLoading={isChecking} size="lg" disabled={!text && !isDragActive} className="w-full sm:w-auto">
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Analyze Text
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
