import React from 'react';
import { Box, Typography, Button, Container, Alert } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { errorBoundary } from './content/common-content';
import { ErrorBoundaryProps, ErrorBoundaryState } from './types';



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
                {errorBoundary.title}
              </Typography>
              <Alert severity="error" sx={{ width: '100%', mt: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {this.state.error?.message || errorBoundary.defaultError}
                </Typography>
                <Typography variant="caption" component="div" sx={{ color: 'inherit', opacity: 0.8 }}>
                  {errorBoundary.supportMessage}
                </Typography>
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button variant="contained" onClick={this.handleReset}>
                  {errorBoundary.reloadButton}
                </Button>
                <Button variant="outlined" href="/">
                  {errorBoundary.backHomeButton}
                </Button>
              </Box>
              <Typography variant="caption" sx={{ mt: 3, color: 'text.secondary', maxWidth: 400 }}>
                {errorBoundary.backendNote}
              </Typography>
            </Box>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
