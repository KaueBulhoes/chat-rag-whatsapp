import styled from "styled-components";

export const DocumentContainer = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

export const DocumentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #111827;
`;

export const UploadSection = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const UploadForm = styled.form`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const InputWrapper = styled.div`
  flex: 1;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  input {
    width: 100%;
    padding: 0.625rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
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
  }
`;

export const UploadButton = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: #059669;
  }

  &:disabled {
    background-color: #6ee7b7;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const DocumentListSection = styled.div`
  min-height: 200px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;

  p {
    margin: 0;
  }
`;

export const DocumentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

export const DocumentCard = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
`;

export const DocumentName = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #111827;
  word-break: break-word;
`;

export const DocumentInfo = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.75rem;

  p {
    margin: 0.25rem 0;
  }
`;

export const DocumentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

export const DeleteButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #dc2626;
  }

  &:disabled {
    background-color: #fca5a5;
    cursor: not-allowed;
  }
`;

export const ViewButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
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

export const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border-left: 4px solid #10b981;
  font-size: 0.875rem;
`;

export const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border-left: 4px solid #ef4444;
  font-size: 0.875rem;
`;
