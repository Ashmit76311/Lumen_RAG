import os

from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

from src.config.settings import Config
from src.llms.groq_llm import llm
from src.rag.retriever_setup import get_retriever

config = Config()

def get_agent_executor():
    tools = [get_retriever()]

    if os.path.exists("description.txt"):
        with open("description.txt", "r", encoding="utf-8") as f:
            description = f.read()
    else:
        description = None

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", config.prompt("system_prompt")),
            ("human", "{input}"),
            ("ai", "{agent_scratchpad}"),
        ]
    )

    react_agent = create_react_agent(llm, tools, prompt)
    return AgentExecutor(
        agent=react_agent,
        tools=tools,
        handle_parsing_errors=True,
        max_iterations=2,
        verbose=True,
        return_intermediate_steps=True,
    )
