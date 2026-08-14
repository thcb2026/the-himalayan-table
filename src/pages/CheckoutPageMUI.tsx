import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  Divider,
} from '@mui/material';
import { menuItems } from '../content/data';
import { CheckoutPageProps, FormErrors } from '../types';
import { initialFormData, uiText, validationMessages } from '../content/common-content';

export function CheckoutPageMUI({ state, onBack, onComplete }: CheckoutPageProps) {
  const [form, setForm] = useState(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cartItems = useMemo(
    () =>
      state.cartItems
        .map((line) => {
          const item = menuItems.find((entry) => entry.id === line.id);
          return item ? { ...item, quantity: line.quantity } : null;
        })
        .filter(Boolean) as Array<(typeof menuItems)[number] & { quantity: number }>,
    [state.cartItems],
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = cartItems.length > 0 ? 150 : 0;
  const total = subtotal + deliveryCharge;

  const handleInputChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = validationMessages.checkout.firstName;
    if (!form.lastName.trim()) newErrors.lastName = validationMessages.checkout.lastName;
    if (!form.email.trim()) newErrors.email = validationMessages.checkout.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = validationMessages.checkout.emailInvalid;
    if (!form.phone.trim()) newErrors.phone = validationMessages.checkout.phoneRequired;
    else if (!/^[0-9+\-\s()]{7,}$/.test(form.phone)) newErrors.phone = validationMessages.checkout.phoneInvalid;
    if (!form.deliveryAddress.trim()) newErrors.deliveryAddress = validationMessages.checkout.deliveryAddress;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="overline" sx={{ color: 'success.main', fontWeight: 700 }}>
              {uiText.checkout.orderPlaced}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
              {uiText.checkout.sentTitle}
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
              {uiText.checkout.sentMessage}
            </Typography>

            <Box
              sx={{
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
                mb: 3,
                textAlign: 'left',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography color="textSecondary">{uiText.checkout.customerLabel}</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {form.firstName} {form.lastName}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography color="textSecondary">{uiText.checkout.email}</Typography>
                <Typography sx={{ fontWeight: 700 }}>{form.email}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography color="textSecondary">{uiText.checkout.phone}</Typography>
                <Typography sx={{ fontWeight: 700 }}>{form.phone}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography color="textSecondary">{uiText.checkout.deliveryTo}</Typography>
                <Typography sx={{ fontWeight: 700 }}>{form.deliveryAddress}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography color="textSecondary">{uiText.checkout.totalAmount}</Typography>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem' }}>
                  NRs {total}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography color="textSecondary">{uiText.checkout.paymentMethod}</Typography>
                <Typography sx={{ fontWeight: 700 }}>{form.paymentMethod}</Typography>
              </Box>
            </Box>

            <Button variant="contained" onClick={onComplete} size="large">
              {uiText.checkout.backToHome}
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {uiText.checkout.eyebrow}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {uiText.checkout.title}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={onBack}>
          {uiText.checkout.back}
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {uiText.checkout.customerDetails}
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label={uiText.checkout.firstName}
                    value={form.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    fullWidth
                  />
                  <TextField
                    label={uiText.checkout.lastName}
                    value={form.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    fullWidth
                  />
                  <TextField
                    label={uiText.checkout.email}
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                  />
                  <TextField
                    label={uiText.checkout.phone}
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    fullWidth
                  />
                </Box>
                <TextField
                  label={uiText.checkout.deliveryAddress}
                  value={form.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  error={!!errors.deliveryAddress}
                  helperText={errors.deliveryAddress}
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  label={uiText.checkout.notes}
                  value={form.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {uiText.checkout.orderSummary}
              </Typography>
              <Stack spacing={1}>
                {cartItems.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      {item.name} × {item.quantity}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      NRs {item.price * item.quantity}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{uiText.cart.subtotal}</Typography>
                <Typography sx={{ fontWeight: 700 }}>NRs {subtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>{uiText.orderFlow.deliveryLabel}</Typography>
                <Typography sx={{ fontWeight: 700 }}>NRs {deliveryCharge}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {uiText.orderFlow.total}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  NRs {total}
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                {uiText.checkout.paymentMethod}
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                {(['Esewa', 'IME Pay', 'Cash on Delivery'] as const).map((option) => (
                  <Button
                    key={option}
                    variant={form.paymentMethod === option ? 'contained' : 'outlined'}
                    onClick={() => handleInputChange('paymentMethod', option)}
                    fullWidth
                  >
                    {option}
                  </Button>
                ))}
              </Stack>

              <Button variant="contained" size="large" fullWidth onClick={handleSubmit}>
                {uiText.checkout.placeOrder}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
