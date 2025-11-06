import styled from "styled-components";

export const ChatContainer = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 600px;
`;

export const ChatTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #111827;
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #e5e7eb;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 3px;

    &:hover {
      background: #6b7280;
    }
  }
`;

export const Message = styled.div<{ role: "user" | "assistant" }>`
  display: flex;
  justify-content: ${(props) =>
    props.role === "user" ? "flex-end" : "flex-start"};
  margin-bottom: 0.5rem;
`;

export const MessageBubble = styled.div<{ role: "user" | "assistant" }>`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  word-wrap: break-word;
  line-height: 1.4;

  ${(props) =>
    props.role === "user"
      ? `
    background-color: #3b82f6;
    color: #ffffff;
    border-bottom-right-radius: 0;
  `
      : `
    background-color: #e5e7eb;
    color: #111827;
    border-bottom-left-radius: 0;
  `}
`;

export const MessageTime = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
  display: block;
`;

export const TypingIndicator = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  color: #9ca3af;
  font-size: 0.875rem;

  span {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #9ca3af;
    animation: bounce 1.4s infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      opacity: 0.5;
      transform: translateY(0);
    }
    40% {
      opacity: 1;
      transform: translateY(-0.5rem);
    }
  }
`;

export const InputSection = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

export const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const TextInput = styled.input`
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 38px;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

export const ClearButton = styled.button`
  padding: 0.625rem 1rem;
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: #dc2626;
  }

  &:disabled {
    background-color: #fca5a5;
    cursor: not-allowed;
  }
`;

export const InfoMessage = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  border-left: 3px solid #3b82f6;
`;
