import styled from "styled-components";

export const ConfigContainer = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
`;

export const ConfigTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #111827;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  input,
  select,
  textarea {
    width: 100%;
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
  }

  textarea {
    resize: vertical;
    min-height: 100px;
    font-family: "Courier New", monospace;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
`;

export const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === "secondary"
      ? `
    background-color: #e5e7eb;
    color: #374151;

    &:hover {
      background-color: #d1d5db;
    }

    &:disabled {
      background-color: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
    }
  `
      : `
    background-color: #3b82f6;
    color: #ffffff;

    &:hover {
      background-color: #2563eb;
    }

    &:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
  `}
`;

export const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border-left: 4px solid #10b981;
`;

export const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border-left: 4px solid #ef4444;
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
