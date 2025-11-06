import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
`;

export const Header = styled.header`
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
  margin-bottom: 2rem;
`;

export const HeaderContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;

  h1 {
    font-size: 1.875rem;
    font-weight: bold;
    color: #111827;
  }
`;

export const MainContent = styled.main`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
`;

export const Card = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #111827;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 0.5rem 0;
      color: #4b5563;
    }
  }
`;

export const AlertCard = styled(Card)`
  background-color: #dbeafe;
  border-left: 4px solid #3b82f6;

  h3 {
    font-weight: bold;
    color: #0c3b8d;
    margin-bottom: 0.5rem;
  }

  ol {
    list-style-position: inside;
    color: #1e40af;

    li {
      margin: 0.25rem 0;
    }

    code {
      background-color: #bfdbfe;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      font-family: monospace;
    }
  }
`;
