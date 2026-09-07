import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

load_dotenv()


class ChatEngine:

    def __init__(self):

        api_key = (os.getenv("GROQ_API_KEY") or "").strip()

        if not api_key:
            raise RuntimeError("GROQ_API_KEY is not configured.")

        self.llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key,
        )

    def generate(self, prompt: str) -> str:

        response = self.llm.invoke(
            [HumanMessage(content=prompt)]
        )

        return response.content
