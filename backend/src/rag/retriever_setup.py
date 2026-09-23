import os
import tempfile

from langchain_core.documents import Document
from langchain_core.tools import create_retriever_tool
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

_embeddings = None

def get_embeddings():
    global _embeddings
    if _embeddings is None:
        _embeddings = FastEmbedEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            threads=1
        )
    return _embeddings


def retriever_chain(chunks: list[Document]):
    """
    Initialize and store documents in FAISS vector database.

    Args:
        chunks: List of document chunks to store.

    Returns:
        Boolean indicating success of the operation.
    """
    try:
        QdrantVectorStore.from_documents(
            documents=chunks,
            embedding=get_embeddings(),
            url=os.getenv("QDRANT_URL", "http://qdrant:6333"),
            api_key=os.getenv("QDRANT_API_KEY", ""),
            collection_name=os.getenv("QDRANT_CODE_COLLECTION", "adaptive_rag_docs"),
            force_recreate=True,
        )

        print("Qdrant vector store initialized with documents")
        print(f"Vectorstore contains {len(chunks)} document chunks")
        return True
    except Exception as e:
        print(f"Error storing documents in Qdrant: {e}")
        return False


def get_retriever():
    """
    Get a retriever tool connected to the FAISS vector store.

    Returns the retriever tool that can search documents stored by retriever_chain().
    If no documents have been uploaded yet, creates a retriever with a dummy document.

    Returns:
        A LangChain retriever tool configured for the vector store.

    Raises:
        Exception: If vector store initialization fails.
    """
    try:
        url = os.getenv("QDRANT_URL", "http://qdrant:6333")
        api_key = os.getenv("QDRANT_API_KEY", "")
        collection_name = os.getenv("QDRANT_CODE_COLLECTION", "adaptive_rag_docs")

        client = QdrantClient(url=url, api_key=api_key)

        if not client.collection_exists(collection_name):
            print("No documents uploaded yet, creating dummy vectorstore in Qdrant")
            from langchain_core.documents import Document as LangChainDocument

            dummy_doc = LangChainDocument(
                page_content="No documents have been uploaded yet. Please upload a document first.",
                metadata={"source": "initialization"},
            )
            vectorstore = QdrantVectorStore.from_documents(
                documents=[dummy_doc],
                embedding=get_embeddings(),
                url=url,
                api_key=api_key,
                collection_name=collection_name,
                force_recreate=True,
            )
        else:
            vectorstore = QdrantVectorStore.from_existing_collection(
                embedding=get_embeddings(),
                collection_name=collection_name,
                url=url,
                api_key=api_key,
            )

        retriever = vectorstore.as_retriever()

        desc_path = os.path.join(tempfile.gettempdir(), "description.txt")
        if os.path.exists(desc_path):
            with open(desc_path, "r", encoding="utf-8") as f:
                description = f.read()
        else:
            description = None

        retriever_tool = create_retriever_tool(
            retriever,
            "retriever_customer_uploaded_documents",
            f"Use this tool **only** to answer questions about: {description}\n"
            "Don't use this tool to answer anything else.",
        )

        return retriever_tool

    except Exception as e:
        print(f"Error initializing retriever: {e}")
        import traceback

        traceback.print_exc()
        raise Exception(e)
