import React, { ReactNode } from 'react';
import { Box, Typography, Button, Container, Alert } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            p: 2,
          }}
        >
          <Container maxWidth="sm">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 2,
              }}
            >
              <ErrorIcon
                sx={{
                  fontSize: 64,
                  color: 'error.main',
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Oops! Something went wrong
              </Typography>
              <Alert severity="error" sx={{ width: '100%', mt: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {this.state.error?.message || 'An unexpected error occurred'}
                </Typography>
                <Typography variant="caption" component="div" sx={{ color: 'inherit', opacity: 0.8 }}>
                  Please try refreshing the page or contact support if the problem persists.
                </Typography>
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button variant="contained" onClick={this.handleReset}>
                  Reload Page
                </Button>
                <Button variant="outlined" href="/">
                  Back to Home
                </Button>
              </Box>
              <Typography variant="caption" sx={{ mt: 3, color: 'text.secondary', maxWidth: 400 }}>
                If you're seeing this error repeatedly, the backend service may be unavailable. The app will work with local content, but shared content updates won't be available.
              </Typography>
            </Box>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
