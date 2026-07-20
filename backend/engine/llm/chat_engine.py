import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

load_dotenv()


class ChatEngine:

    def __init__(self):

        self.llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            groq_api_key=os.getenv("GROQ_API_KEY"),
        )

    def generate(self, prompt: str) -> str:

        response = self.llm.invoke(
            [HumanMessage(content=prompt)]
        )

        return response.content