import os
import tempfile

from fastapi import UploadFile, File
from langchain_community.document_loaders import PyPDFLoader, TextLoader
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

    suffix = os.path.splitext(filename)[1]
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp_path = tmp_file.name
    try:
        tmp_file.write(file_bytes)
        tmp_file.flush()
        tmp_file.close()

        if filename.endswith(".pdf"):
            loader = PyPDFLoader(tmp_path)
        else:
            loader = TextLoader(tmp_path, encoding="utf-8")

        try:
            docs = loader.load()
        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail=f"Error loading file: {e}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

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
