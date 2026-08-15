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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Logo from '@mui/icons-material/LunchDining';
import { appBrand, navigation, STORAGE_KEY, uiText } from './content/common-content';
import { initialQuote } from './content/data';
import { GenericStateStore } from './store';
import { AppState } from './types';
import { buildM3Theme } from './theme/theme';
import { getLabel } from './utils/getLabel';

// Lazy load page components for code splitting
const HomePageMUI = React.lazy(() => import('./pages/HomePageMUI').then(m => ({ default: m.HomePageMUI })));
const MenuPageMUI = React.lazy(() => import('./pages/MenuPageMUI').then(m => ({ default: m.MenuPageMUI })));
const CorporateCateringPageMUI = React.lazy(() => import('./pages/CorporateCateringPageMUI').then(m => ({ default: m.CorporateCateringPageMUI })));
const ContactPageMUI = React.lazy(() => import('./pages/ContactPageMUI').then(m => ({ default: m.ContactPageMUI })));
const OrderFlowPageMUI = React.lazy(() => import('./pages/OrderFlowPageMUI').then(m => ({ default: m.OrderFlowPageMUI })));
const CartDrawerMUI = React.lazy(() => import('./pages/CartDrawerMUI').then(m => ({ default: m.CartDrawerMUI })));
const CheckoutPageMUI = React.lazy(() => import('./pages/CheckoutPageMUI').then(m => ({ default: m.CheckoutPageMUI })));


const getInitialState = (): AppState => {
  if (typeof window === 'undefined') {
    return {
      selectedCategory: 'All',
      selectedDietary: 'All',
      cartCount: 0,
      cartItems: [],
      quote: initialQuote,
      activeNav: 'Home',
    };
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return {
        selectedCategory: 'All',
        selectedDietary: 'All',
        cartCount: 0,
        cartItems: [],
        quote: initialQuote,
        activeNav: 'Home',
      };
    }

    return JSON.parse(saved) as AppState;
  } catch {
    return {
      selectedCategory: 'All',
      selectedDietary: 'All',
      cartCount: 0,
      cartItems: [],
      quote: initialQuote,
      activeNav: 'Home',
    };
  }
};

const appStore = new GenericStateStore(getInitialState());

function App() {
  const [state, setState] = useState(appStore.getState());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const theme = buildM3Theme('#a75b2c', false);

  React.useEffect(() => {
    const unsubscribe = appStore.subscribe(() => setState(appStore.getState()));
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appStore.getState()));
    }
  }, [state]);

  const addToCart = (itemId: string, quantity = 1) => {
    const existing = appStore.getState().cartItems.find((item) => item.id === itemId);
    const nextQuantity = Math.max(1, quantity);

    if (existing) {
      appStore.setState({
        cartItems: appStore.getState().cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + nextQuantity } : item,
        ),
        cartCount: appStore.getState().cartCount + nextQuantity,
      });
      return;
    }

    appStore.setState({
      cartItems: [...appStore.getState().cartItems, { id: itemId, quantity: nextQuantity }],
      cartCount: appStore.getState().cartCount + nextQuantity,
    });
  };

  const updateCartItem = (itemId: string, delta: number) => {
    const items = appStore.getState().cartItems
      .map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
      )
      .filter((item) => item.quantity > 0);

    appStore.setState({
      cartItems: items,
      cartCount: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  };

  const removeCartItem = (itemId: string) => {
    const items = appStore.getState().cartItems.filter((item) => item.id !== itemId);
    appStore.setState({
      cartItems: items,
      cartCount: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  };

  const updateQuote = <K extends keyof typeof initialQuote>(
    key: K,
    value: (typeof initialQuote)[K],
  ) => {
    appStore.setState({
      quote: {
        ...appStore.getState().quote,
        [key]: value,
      },
    });
  };

  const renderPage = () => {
    switch (state.activeNav) {
      case 'Menu':
        return (
          <MenuPageMUI
            state={state}
            onCategoryChange={(value) => appStore.setState({ selectedCategory: value })}
            onDietaryChange={(value) => appStore.setState({ selectedDietary: value })}
            onAddToCart={(itemId, quantity) => addToCart(itemId, quantity)}
          />
        );
      case 'Corporate Catering':
        return <CorporateCateringPageMUI state={state} onChange={updateQuote} />;
      case 'Contact':
        return <ContactPageMUI />;
      case 'Order Online':
        return <OrderFlowPageMUI state={state} onSetActiveNav={(value) => appStore.setState({ activeNav: value })} />;
      case 'Checkout':
        return (
          <CheckoutPageMUI
            state={state}
            onBack={() => appStore.setState({ activeNav: 'Order Online' })}
            onComplete={() => {
              appStore.setState({
                activeNav: 'Order Online',
                cartItems: [],
                cartCount: 0,
              });
              setIsCartOpen(false);
            }}
          />
        );
      case 'Event Catering':
      case 'Our Story':
        return (
          <MenuPageMUI
            state={state}
            onCategoryChange={(value) => appStore.setState({ selectedCategory: value })}
            onDietaryChange={(value) => appStore.setState({ selectedDietary: value })}
            onAddToCart={(itemId, quantity) => addToCart(itemId, quantity)}
          />
        );
      case 'Home':
      default:
        return <HomePageMUI />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="div" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar
          component="header"
          position="sticky"
          elevation={2}
          sx={{
            background: 'linear-gradient(135deg, primary.main 0%, primary.dark 100%)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', py: { xs: 1, sm: 1.5 } }}>
            <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Logo sx={{ fontSize: 32 }} aria-hidden="true" />
              <Box component="div" sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                  {appBrand.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.9 }}>
                  {appBrand.tagline}
                </Typography>
              </Box>
            </Box>

            <Box component="nav" aria-label="Main navigation" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
              {navigation.map((item) => (
                <Button
                  key={item}
                  color="inherit"
                  onClick={() => appStore.setState({ activeNav: item })}
                  sx={{
                    fontWeight: state.activeNav === item ? 700 : 500,
                    opacity: state.activeNav === item ? 1 : 0.7,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getLabel(`nav_${item.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`, item)}
                </Button>
              ))}
            </Box>

            <Box component="div" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => appStore.setState({ activeNav: 'Menu' })}
                sx={{ borderColor: 'inherit', whiteSpace: 'nowrap' }}
              >
                {uiText.app.menu}
              </Button>
              <Button variant="contained" color="secondary" onClick={() => appStore.setState({ activeNav: 'Order Online' })} sx={{ whiteSpace: 'nowrap' }}>
                {uiText.app.orderNow}
              </Button>
              <IconButton
                color="inherit"
                onClick={() => setIsCartOpen(true)}
                aria-label={getLabel('aria_shopping_cart', 'Shopping Cart')}
                sx={{ position: 'relative' }}
              >
                <Badge badgeContent={state.cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="lg" sx={{ flex: 1, py: { xs: 2, sm: 3, md: 4 }, width: '100%' }}>
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
              state={state}
              onClose={() => setIsCartOpen(false)}
              onIncrease={(itemId) => updateCartItem(itemId, 1)}
              onDecrease={(itemId) => updateCartItem(itemId, -1)}
              onRemove={removeCartItem}
              onCheckout={() => {
                setIsCartOpen(false);
                appStore.setState({ activeNav: 'Checkout' });
              }}
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
