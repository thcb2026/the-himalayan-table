import React, { useState, Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Logo from '@mui/icons-material/LunchDining';
import SettingsIcon from '@mui/icons-material/Settings';
import { appBrand, hydrateFrontendContent, navigation, STORAGE_KEY, uiText } from './content/common-content';
import { useAppDispatch, useAppSelector, setActiveNav } from './store';
import { buildM3Theme } from './theme/theme';
import { getLabel, hydrateSharedContentRegistry } from './utils/getLabel';

// Lazy load page components for code splitting
const HomePageMUI = React.lazy(() => import('./pages/HomePageMUI').then(m => ({ default: m.HomePageMUI })));
const MenuPageMUI = React.lazy(() => import('./pages/MenuPageMUI').then(m => ({ default: m.MenuPageMUI })));
const CorporateCateringPageMUI = React.lazy(() => import('./pages/CorporateCateringPageMUI').then(m => ({ default: m.CorporateCateringPageMUI })));
const ContactPageMUI = React.lazy(() => import('./pages/ContactPageMUI').then(m => ({ default: m.ContactPageMUI })));
const OrderFlowPageMUI = React.lazy(() => import('./pages/OrderFlowPageMUI').then(m => ({ default: m.OrderFlowPageMUI })));
const CartDrawerMUI = React.lazy(() => import('./pages/CartDrawerMUI').then(m => ({ default: m.CartDrawerMUI })));
const CheckoutPageMUI = React.lazy(() => import('./pages/CheckoutPageMUI').then(m => ({ default: m.CheckoutPageMUI })));
const AdminContentEditorPageMUI = React.lazy(() => import('./pages/AdminContentEditorPageMUI').then(m => ({ default: m.AdminContentEditorPageMUI })));

function App() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.app);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [contentVersion, setContentVersion] = useState(0);
  const [fallbackNotice, setFallbackNotice] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const theme = buildM3Theme('#a75b2c', false);

  React.useEffect(() => {
    const handleRegistryUpdate = () => {
      console.log('[AppMUI] Registry updated, forcing re-render');
      setContentVersion((current) => current + 1);
    };
    const handleFrontendContentUpdate = async () => {
      console.log('[AppMUI] Frontend content updated, rehydrating content and forcing re-render');
      try {
        await hydrateFrontendContent();
      } catch (error) {
        console.warn('[AppMUI] Content rehydration failed after update:', error);
      }
      setContentVersion((current) => current + 1);
    };
    const handleFallbackNotice = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      const message = customEvent.detail?.message || 'Shared content is temporarily unavailable. Local content is being served instead.';
      console.warn('[AppMUI] Fallback notice:', message);
      setFallbackNotice({ open: true, message });
    };

    // Trigger registry hydration on mount
    console.log('[AppMUI] Mounting, starting registry hydration');
    hydrateSharedContentRegistry()
      .then(() => console.log('[AppMUI] Registry hydration completed'))
      .catch(err => {
        // Catch any errors from hydration and log them without crashing
        console.error('[AppMUI] Registry hydration error (non-critical):', err);
        console.info('[AppMUI] App will continue with local content fallback');
      });

    hydrateFrontendContent().catch((err) => {
      console.warn('[AppMUI] Frontend content hydration failed:', err);
    });

    if (typeof window !== 'undefined') {
      const queuedMessage = (window as Window & { __contentRegistryFallbackMessage?: string }).__contentRegistryFallbackMessage;
      if (queuedMessage) {
        console.warn('[AppMUI] Using queued fallback message:', queuedMessage);
        setFallbackNotice({ open: true, message: queuedMessage });
      }

      window.addEventListener('content-registry-updated', handleRegistryUpdate);
      window.addEventListener('content-registry-fallback', handleFallbackNotice);
      window.addEventListener('frontend-content-updated', handleFrontendContentUpdate);
      window.addEventListener('content-editor-updated', handleFrontendContentUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('content-registry-updated', handleRegistryUpdate);
        window.removeEventListener('content-registry-fallback', handleFallbackNotice);
        window.removeEventListener('frontend-content-updated', handleFrontendContentUpdate);
        window.removeEventListener('content-editor-updated', handleFrontendContentUpdate);
      }
    };
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, contentVersion]);

  const renderPage = () => {
    // contentVersion is used here to ensure re-render when registry updates
    const key = state.activeNav + contentVersion;
    
    switch (state.activeNav) {
      case 'Menu':
        return <MenuPageMUI key={key} />;
      case 'Corporate Catering':
        return <CorporateCateringPageMUI key={key} />;
      case 'Contact':
        return <ContactPageMUI key={key} />;
      case 'Order Online':
        return <OrderFlowPageMUI key={key} />;
      case 'Checkout':
        return <CheckoutPageMUI key={key} />;
      case 'Admin':
        return <AdminContentEditorPageMUI key={key} />;
      case 'Event Catering':
      case 'Our Story':
        return <MenuPageMUI key={key} />;
      case 'Home':
      default:
        return <HomePageMUI key={key} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snackbar
        open={fallbackNotice.open}
        autoHideDuration={5000}
        onClose={() => setFallbackNotice((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setFallbackNotice((current) => ({ ...current, open: false }))}
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {fallbackNotice.message}
        </Alert>
      </Snackbar>
      <Box component="div" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar
          component="header"
          position="sticky"
          elevation={2}
          sx={{
            background: 'linear-gradient(135deg, primary.main 0%, primary.dark 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 1.5, md: 2 },
              py: { xs: 1.25, md: 1.5 },
              px: { xs: 1.5, sm: 2 },
            }}
          >
            <Box
              component="div"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'space-between', md: 'flex-start' },
                gap: 1,
                minWidth: 0,
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <Logo sx={{ fontSize: { xs: 28, md: 32 } }} aria-hidden="true" />
                <Box component="div" sx={{ minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
                    {appBrand.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.9, display: { xs: 'none', sm: 'block' } }}>
                    {appBrand.tagline}
                  </Typography>
                </Box>
              </Box>

              <IconButton
                color="inherit"
                onClick={() => setIsCartOpen(true)}
                aria-label={getLabel('aria_shopping_cart', 'Shopping Cart')}
                sx={{
                  position: 'relative',
                  ml: 'auto',
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'common.white',
                    outlineOffset: 2,
                    borderRadius: 1,
                  },
                }}
              >
                <Badge badgeContent={state.cartCount} color="error">
                  <ShoppingCartIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
                </Badge>
              </IconButton>

              <IconButton
                color="inherit"
                onClick={() => dispatch(setActiveNav('Admin'))}
                aria-label="Admin Panel"
                title="Content Editor (Admin)"
                sx={{
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'common.white',
                    outlineOffset: 2,
                    borderRadius: 1,
                  },
                }}
              >
                <SettingsIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
              </IconButton>
            </Box>

            <Box
              component="nav"
              aria-label="Main navigation"
              sx={{
                display: 'flex',
                gap: { xs: 0.75, sm: 1 },
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: { xs: '100%', md: 'auto' },
                flex: { md: 1 },
                overflowX: { xs: 'auto', md: 'visible' },
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                pb: { xs: 0.25, md: 0 },
              }}
            >
              {navigation.map((item) => (
                <Button
                  key={item}
                  color="inherit"
                  aria-current={state.activeNav === item ? 'page' : undefined}
                  onClick={() => dispatch(setActiveNav(item))}
                  sx={{
                    fontWeight: state.activeNav === item ? 700 : 500,
                    opacity: state.activeNav === item ? 1 : 0.7,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    borderRadius: 1,
                    px: { xs: 1.25, sm: 1.5 },
                    py: { xs: 0.6, sm: 0.8 },
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'common.white',
                      outlineOffset: 2,
                      backgroundColor: 'rgba(255,255,255,0.12)',
                    },
                  }}
                >
                  {getLabel(`nav_${item.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`, item)}
                </Button>
              ))}
            </Box>

            <Box
              component="div"
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: { xs: 'stretch', md: 'flex-end' },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => dispatch(setActiveNav('Menu'))}
                sx={{
                  borderColor: 'rgba(255,255,255,0.7)',
                  whiteSpace: 'nowrap',
                  flex: { xs: 1, sm: '0 0 auto' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'common.white',
                    outlineOffset: 2,
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  },
                }}
              >
                {uiText.app.menu}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => dispatch(setActiveNav('Order Online'))}
                sx={{
                  whiteSpace: 'nowrap',
                  flex: { xs: 1, sm: '0 0 auto' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'common.white',
                    outlineOffset: 3,
                  },
                }}
              >
                {uiText.app.orderNow}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Container
          component="main"
          maxWidth="lg"
          sx={{
            flex: 1,
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1.5, sm: 2, md: 3 },
            width: '100%',
            maxWidth: { xs: '100%', md: 'lg' },
          }}
        >
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress aria-label="Loading content" />
            </Box>
          }>
            {renderPage()}
          </Suspense>
        </Container>

        {isCartOpen && (
          <Suspense fallback={null}>
            <CartDrawerMUI
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />
          </Suspense>
        )}

        <Box
          component="footer"
          aria-label="Site footer"
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: { xs: 3, md: 4 },
            px: 2,
            mt: 'auto',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {appBrand.name}
                </Typography>
                <Typography variant="body2">{appBrand.footerText}</Typography>
              </Box>
              <Box>
                <Typography variant="body2">{uiText.footer.contactPhone}</Typography>
                <Typography variant="body2">{uiText.footer.contactEmail}</Typography>
              </Box>
              <Box>
                <Typography variant="body2">{uiText.footer.socials[0]}</Typography>
                <Typography variant="body2">{uiText.footer.socials[1]}</Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;