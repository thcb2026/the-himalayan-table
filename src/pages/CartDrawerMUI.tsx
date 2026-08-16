import React from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { menuItems } from '../content/data';
import { currency, uiText } from '../content/common-content';
import { useAppDispatch, useAppSelector, updateCartItem, removeCartItem, setActiveNav } from '../store';
import { subtotal } from '../utils/common-helpers';
import { getLabel } from '../utils/getLabel';
import { CartDrawerMUIProps } from '../types';


export function CartDrawerMUI({ isOpen, onClose }: CartDrawerMUIProps) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.app);
  const cartItems = state.cartItems
    .map((line) => {
      const item = menuItems.find((entry) => entry.id === line.id);
      return item ? { ...item, quantity: line.quantity } : null;
    })
    .filter(Boolean) as Array<(typeof menuItems)[number] & { quantity: number }>;

  const handleCheckout = () => {
    onClose();
    dispatch(setActiveNav('Checkout'));
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100vw', sm: 420 },
          maxWidth: '100vw',
          borderTopLeftRadius: { xs: 0, sm: 3 },
          borderBottomLeftRadius: { xs: 0, sm: 3 },
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {uiText.cart.title}
          </Typography>
          <IconButton color="inherit" onClick={onClose} size="small" aria-label="Close cart">
            <CloseIcon />
          </IconButton>
        </Box>

        {cartItems.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 2 }}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
              {uiText.cart.empty}
            </Typography>
            <Button variant="contained" onClick={onClose} sx={{ minHeight: 44 }}>
              {getLabel('act_continue_shopping', uiText.app.continueShopping)}
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <Stack spacing={2}>
                {cartItems.map((item) => (
                  <Card key={item.id} sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden' }}>
                    <CardMedia component="img" sx={{ width: 96, height: 96, objectFit: 'cover' }} image={item.image} alt={item.name} />
                    <CardContent sx={{ flex: 1, p: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                          {item.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => dispatch(removeCartItem(item.id))}
                          sx={{ color: 'error.main', p: 0.5 }}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <IconButton size="small" onClick={() => dispatch(updateCartItem({ itemId: item.id, delta: -1 }))} sx={{ border: '1px solid', borderColor: 'divider', minWidth: 32, minHeight: 32 }} aria-label={`Decrease quantity for ${item.name}`}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ minWidth: 26, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => dispatch(updateCartItem({ itemId: item.id, delta: 1 }))} sx={{ border: '1px solid', borderColor: 'divider', minWidth: 32, minHeight: 32 }} aria-label={`Increase quantity for ${item.name}`}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {currency.symbol} {item.price * item.quantity}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', position: 'sticky', bottom: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>{uiText.cart.subtotal}</Typography>
                <Typography sx={{ fontWeight: 700 }}>{currency.symbol} {subtotal(cartItems)}</Typography>
              </Box>
              <Button variant="contained" fullWidth onClick={handleCheckout} sx={{ minHeight: 48 }}>
                {getLabel('act_go_checkout', uiText.cart.checkout)}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
