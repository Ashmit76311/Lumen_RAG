import os
import tempfile

from fastapi import UploadFile, File
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.rag.retriever_setup import retriever_chain
from src.tools.common_tools import enhance_description_with_llm


def documents(description: str, file: UploadFile = File(...)):
    filename = file.filename
    print(filename)
    if not filename.endswith(".pdf") and not filename.endswith(".txt"):
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400, detail="Only PDF and TXT files are supported"
        )

    file_bytes = file.file.read()

    try:
        if filename.endswith(".txt"):
            # Directly create Document from bytes — no disk I/O needed
            text = file_bytes.decode("utf-8", errors="replace")
            docs = [Document(page_content=text, metadata={"source": filename})]
        else:
            # PDFs require a file path, write to /tmp
            tmp_path = None
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
                    tmp_file.write(file_bytes)
                    tmp_path = tmp_file.name
                loader = PyPDFLoader(tmp_path)
                docs = loader.load()
            finally:
                if tmp_path and os.path.exists(tmp_path):
                    os.unlink(tmp_path)
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"Error loading file: {e}")

    description_llm = enhance_description_with_llm(description)

    desc_path = os.path.join(tempfile.gettempdir(), "description.txt")
    with open(desc_path, "w", encoding="utf-8") as f:
        f.write(description_llm)

    with open(desc_path, "r", encoding="utf-8") as f:
        print("Document description from storage:")
        print(f.read())

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    chunks = splitter.split_documents(docs)

    return retriever_chain(chunks)
