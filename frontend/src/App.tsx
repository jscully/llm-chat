import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { WifiOff, RefreshCw } from 'lucide-react';
import Chat from './Chat';
import { healthCheck } from './api';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e5e5;
  padding: 32px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  margin: 24px;
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid #f0f0f0;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 16px;
`;

const ErrorIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #fee;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #000;
  margin-bottom: 8px;
`;

const Text = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const Code = styled.code`
  background: #f8f8f8;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  font-family: 'SF Mono', Consolas, monospace;
  display: block;
  margin: 12px 0;
`;

const Button = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;

  &:hover {
    background: #333;
  }
`;

const StatusBadge = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  color: #0369a1;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  background: #0ea5e9;
  border-radius: 50%;
`;

function App() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await healthCheck();
        setConnected(true);
      } catch {
        setConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (connected === null) {
    return (
      <Container>
        <Card>
          <Spinner />
          <Title>Connecting</Title>
          <Text>Checking backend connection...</Text>
        </Card>
      </Container>
    );
  }

  if (!connected) {
    return (
      <Container>
        <Card>
          <ErrorIcon>
            <WifiOff size={20} color="#dc2626" />
          </ErrorIcon>
          <Title>Connection Error</Title>
          <Text>
            Cannot connect to backend service.
            <Code>cd backend && ./run.sh</Code>
          </Text>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw size={14} />
            Retry
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <div className="App">
      <Chat />
      <StatusBadge>
        <StatusDot />
        Connected
      </StatusBadge>
    </div>
  );
}

export default App;