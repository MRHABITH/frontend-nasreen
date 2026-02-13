# How to Deploy Frontend to Vercel

1.  **Push your code to GitHub**
    *   If you haven't already, push your entire project to a GitHub repository.

2.  **Go to Vercel**
    *   Log in to [vercel.com](https://vercel.com).
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your GitHub repository.

3.  **Configure Project**
    *   **Framework Preset**: Vite (should be auto-detected).
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Environment Variables**:
        *   Add a new variable: `VITE_API_URL`
        *   Value: Your Hugging Face Backend URL (e.g., `https://habith-plagiarism-backend.hf.space`).
        *   *Note: Ensure the URL does not end with a slash `/`.*

4.  **Deploy**
    *   Click **Deploy**.
    *   Wait for the build to finish.

Your frontend will be live!
