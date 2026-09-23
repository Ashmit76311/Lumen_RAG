import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY", "")

llm = ChatGroq(model="llama3-70b-8192")
