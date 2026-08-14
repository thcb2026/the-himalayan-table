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
import { CartDrawerProps } from '../types';

export function CartDrawerMUI({
  state,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const cartItems = state.cartItems
    .map((line) => {
      const item = menuItems.find((entry) => entry.id === line.id);
      return item ? { ...item, quantity: line.quantity } : null;
    })
    .filter(Boolean) as Array<(typeof menuItems)[number] & { quantity: number }>;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Drawer anchor="right" open={true} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 400 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Cart
          </Typography>
          <IconButton color="inherit" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {cartItems.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Your cart is empty.
            </Typography>
            <Button variant="contained" onClick={onClose}>
              Continue shopping
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <Stack spacing={2}>
                {cartItems.map((item) => (
                  <Card key={item.id} sx={{ display: 'flex' }}>
                    <CardMedia component="img" sx={{ width: 100, height: 100, objectFit: 'cover' }} image={item.image} alt={item.name} />
                    <CardContent sx={{ flex: 1, p: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {item.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => onRemove(item.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                        <IconButton size="small" onClick={() => onDecrease(item.id)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 30, textAlign: 'center' }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => onIncrease(item.id)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }}>
                        NRs {item.price * item.quantity}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Subtotal</Typography>
                <Typography sx={{ fontWeight: 700 }}>NRs {subtotal}</Typography>
              </Box>
              <Button variant="contained" fullWidth onClick={onCheckout}>
                Go to checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
