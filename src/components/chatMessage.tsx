import { UIMessage } from "ai";
import React from "react";
import ReactMarkdown from "react-markdown";

type ChatMessageProps = {
  message: UIMessage;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className="whitespace-pre-wrap my-1 p-3 bg-gray-100 rounded-lg shadow-md">
      <strong className={isUser ? "text-blue-600" : "text-green-600"}>
        {isUser ? "You: " : "Assistant: "}
      </strong>
      {message.parts.map(
        (part, i) =>
          part.type === "text" && (
            <ReactMarkdown key={`${message.id}-${i}`}>
              {part.text}
            </ReactMarkdown>
          )
      )}
    </div>
  );
}

/*  <div
              key={message.id}
              className="whitespace-pre-wrap my-1 p-3 bg-gray-100 rounded-lg shadow-md"
            >
              <strong
                className={
                  message.role === "user" ? "text-blue-600" : "text-green-600"
                }
              >
                {message.role === "user" ? "You: " : "Assistant: "}
              </strong>
              {message.parts.map(
                (part, i) =>
                  part.type === "text" && (
                    <ReactMarkdown key={`${message.id}-${i}`}>
                      {part.text}
                    </ReactMarkdown>
                  )
              )}
            </div> */
