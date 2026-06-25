"""
API routes for RAG operations.
"""

import traceback
import logging

from fastapi import APIRouter, UploadFile, File, Header, Depends, HTTPException
from langchain_core.messages import HumanMessage, AIMessage

logger = logging.getLogger(__name__)

from src.memory.chat_history_mongo import ChatHistory
from src.models.query_request import QueryRequest
from src.rag.document_upload import documents
from src.rag.graph_builder import builder
from src.auth.utils import get_current_user
from src.db.mongo_client import db
import uuid
from datetime import datetime

router = APIRouter()


@router.post("/rag/query")
async def rag_query(req: QueryRequest):
    """
    Process a RAG query and return the result.

    Args:
        req: The query request containing query text and session_id.

    Returns:
        The generated response from the RAG pipeline.
    """
    # chat_history=ChatInMemoryHistory.get_session_history(req.token)
    chat_history = ChatHistory.get_session_history(req.session_id)
    await chat_history.add_message(HumanMessage(content=req.query))

    # Fetch full history
    messages = await chat_history.get_messages()
    result = builder.invoke({"messages": messages})
    output_text = result["messages"][-1].content

    # Save assistant message
    await chat_history.add_message(AIMessage(content=output_text))

    return {"result": result["messages"][-1]}


@router.post("/rag/documents/upload")
async def upload_file(
    file: UploadFile = File(...),
    description: str = Header(..., alias="X-Description"),
    username: str = Depends(get_current_user),
):
    """
    Upload a document for RAG processing.
    """
    try:
        status_upload = documents(description, file)

        # Save document metadata to DB
        doc_id = str(uuid.uuid4())
        await db.documents.insert_one(
            {
                "id": doc_id,
                "name": file.filename,
                "description": description,
                "username": username,
                "created_at": datetime.utcnow().isoformat(),
            }
        )

        return {"status": status_upload, "id": doc_id}
    except Exception as e:
        logger.error("Upload failed: %s", traceback.format_exc())
        print("UPLOAD ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/documents")
async def list_documents(username: str = Depends(get_current_user)):
    """List all documents for the current user."""
    cursor = db.documents.find({"username": username})
    docs = await cursor.to_list(length=100)
    # format _id properly if needed or just return standard dict
    result = []
    for doc in docs:
        result.append(
            {
                "id": doc.get("id"),
                "name": doc.get("name"),
                "description": doc.get("description"),
                "created_at": doc.get("created_at"),
            }
        )
    return result


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str, username: str = Depends(get_current_user)):
    """Delete a document."""
    result = await db.documents.delete_one({"id": doc_id, "username": username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"status": "success"}
