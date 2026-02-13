import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

export const checkText = async (text, sources) => {
    const formData = new FormData();
    formData.append('text', text);
    if (sources && sources.length > 0) {
        sources.forEach(source => formData.append('sources', source));
    }
    const response = await api.post('/check-text', formData);
    return response.data;
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await api.post('/upload-file', formData);
        return response.data;
    } catch (error) {
        console.error("Upload failed details:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getResults = async (taskId) => {
    const response = await api.get(`/results/${taskId}`);
    return response.data;
};

export const downloadReport = async (taskId) => {
    const response = await api.get(`/download-report/${taskId}`, {
        responseType: 'blob',
    });
    return response.data;
};

export const rewriteText = async (text, mode) => {
    const response = await api.post('/rewrite', { text, mode });
    return response.data;
};

export const generatePDF = async (text) => {
    const response = await api.post('/generate-pdf', { text }, {
        responseType: 'blob'
    });
    return response.data;
};

export default api;
