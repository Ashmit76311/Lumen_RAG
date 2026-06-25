# Deployment Guide for Lumen RAG

Because your project has multiple interconnected pieces (React Frontend, FastAPI Backend, MongoDB, Qdrant Vector DB), you have two primary ways to deploy it. 

---

## Option A: The "All-in-One" VPS Deployment (Recommended & Easiest)
Since you already have a perfect `docker-compose.yml` file, the absolute easiest way to deploy is to rent a single Virtual Private Server (VPS) and run everything together, exactly as it runs on your local machine.

**Recommended Providers:**
- **DigitalOcean** (Basic Droplet) - ~$6 to $12/month
- **AWS** (EC2 t3.small or t3.medium)
- **Hetzner** or **Linode**

**Steps to Deploy:**
1. **Provision a Server**: Create an Ubuntu server on your chosen provider. Make sure it has at least 2GB of RAM (4GB recommended for Qdrant and LLM orchestration).
2. **Install Docker**: SSH into your server and install Docker and Docker Compose.
3. **Clone your Repo**:
   ```bash
   git clone https://github.com/Ashmit76311/Lumen_RAG.git
   cd Lumen_RAG
   ```
4. **Setup Environment**:
   Create a `.env` file on the server and add your real API keys (`GROQ_API_KEY`, `TAVILY_API_KEY`, etc.).
5. **Run it**:
   ```bash
   docker-compose up --build -d
   ```
6. **Reverse Proxy (Optional but Recommended)**: Install Nginx to point a custom domain (e.g., `app.yourdomain.com`) to your frontend running on port `5173`, and route `/api` to port `8000`.

---

## Option B: The "Serverless / Managed" Deployment (Highly Scalable)
If you want each service to run independently without managing a server, you can deploy them to managed platforms. This takes a bit more setup but scales automatically.

### 1. The Databases (Managed)
- **MongoDB**: Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas). Copy the connection string and use it as your `MONGODB_URL`.
- **Qdrant**: Create a free cluster on [Qdrant Cloud](https://cloud.qdrant.io/). Get the URL and API key and use them for `QDRANT_URL` and `QDRANT_API_KEY`.

### 2. The Backend (FastAPI)
- **Provider**: [Render.com](https://render.com) or **Heroku**.
- **Setup**: Connect your GitHub repo, select the `backend` folder as the root directory, and deploy it as a "Web Service".
- Set all your environment variables (Groq, Tavily, MongoDB Atlas, Qdrant Cloud) in the Render dashboard.

### 3. The Frontend (React/Lumen UI)
- **Provider**: [Vercel](https://vercel.com) or [Netlify](https://www.netlify.com/).
- **Setup**: Connect your GitHub repo and select the `frontend` folder as the root.
- **Environment Variable**: Set `VITE_API_URL` to the live URL of your Render backend (e.g., `https://lumen-backend.onrender.com`).
- Vercel will automatically build and host your frontend on a blazing-fast global CDN.

---

### Which should you choose?
- **Choose Option A (VPS)** if you want everything in one place and want to leverage the `docker-compose.yml` file I already built for you. It's much cheaper.
- **Choose Option B (Managed)** if you want a professional-grade deployment where you don't have to worry about server maintenance, and want a free domain from Vercel for your frontend.
