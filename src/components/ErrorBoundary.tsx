import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to console AND make sure it shows on screen
    console.error('[ErrorBoundary] caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      const err = this.state.error;
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#1a0000',
            color: '#ff8888',
            padding: '2rem',
            fontFamily: 'monospace',
            fontSize: '14px',
            zIndex: 99999,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          <h1 style={{ color: '#ff4444', fontSize: '24px', marginBottom: '1rem' }}>
            RUNTIME ERROR CAUGHT
          </h1>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Message:</strong> {err?.message || '(none)'}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Name:</strong> {err?.name || '(none)'}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Stack:</strong>
            <pre style={{ background: '#000', padding: '1rem', overflow: 'auto' }}>
              {err?.stack || '(no stack)'}
            </pre>
          </div>
          {this.state.errorInfo && (
            <div>
              <strong>Component Stack:</strong>
              <pre style={{ background: '#000', padding: '1rem', overflow: 'auto' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
