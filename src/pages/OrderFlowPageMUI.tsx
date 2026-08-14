import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
  Grid,
  TextField,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Alert,
} from '@mui/material';
import { menuItems } from '../content/data';
import { OrderFlowPageProps } from '../types';
import { steps } from '../content/common-content';

export function OrderFlowPageMUI({ state, onSetActiveNav }: OrderFlowPageProps) {
  const [step, setStep] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(menuItems[0].id);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMode, setDeliveryMode] = useState<'Pickup' | 'Delivery'>('Delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Esewa' | 'IME Pay'>('Esewa');

  const selectedItem = useMemo(
    () => menuItems.find((item) => item.id === selectedItemId) ?? menuItems[0],
    [selectedItemId],
  );

  const subtotal = selectedItem.price * quantity;
  const deliveryFee = deliveryMode === 'Delivery' ? 150 : 0;
  const total = subtotal + deliveryFee;


  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
          Order Online
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Simple ordering flow for pickup or delivery
          </Typography>
          <Button variant="outlined" onClick={() => onSetActiveNav('Menu')}>
            Back to menu
          </Button>
        </Box>
      </Box>

      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  1. Choose your food
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {menuItems.map((item) => (
                    <Box
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      sx={{
                        cursor: 'pointer',
                        border: selectedItemId === item.id ? '2px solid' : '1px solid',
                        borderColor: selectedItemId === item.id ? 'primary.main' : 'divider',
                        display: 'flex',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.name}
                        sx={{ width: 80, height: 80, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flex: 1, p: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          NRs {item.price}
                        </Typography>
                      </CardContent>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Selected item
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography>{selectedItem.name}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>NRs {selectedItem.price}</Typography>
                </Box>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  fullWidth
                  slotProps={{ htmlInput: { min: 1 } }}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" fullWidth onClick={() => setStep(1)}>
                  Continue
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {step === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  2. Choose pickup or delivery
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={<Radio />}
                    label="Pickup"
                    checked={deliveryMode === 'Pickup'}
                    onChange={() => setDeliveryMode('Pickup')}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="Delivery"
                    checked={deliveryMode === 'Delivery'}
                    onChange={() => setDeliveryMode('Delivery')}
                  />
                  {deliveryMode === 'Delivery' && (
                    <TextField
                      label="Delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter household or office address"
                      fullWidth
                      multiline
                      rows={2}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Order summary
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal</Typography>
                    <Typography sx={{ fontWeight: 700 }}>NRs {subtotal}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Delivery</Typography>
                    <Typography sx={{ fontWeight: 700 }}>NRs {deliveryFee}</Typography>
                  </Box>
                </Box>
                <Box sx={{ py: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      NRs {total}
                    </Typography>
                  </Box>
                </Box>
                <Button variant="contained" fullWidth onClick={() => setStep(2)} sx={{ mt: 2 }}>
                  Continue
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  3. Choose date and time
                </Typography>
                <Stack spacing={2}>
                  <TextField label="Preferred date" type="date" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField label="Preferred time" type="time" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Payment
                </Typography>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
                  <FormControlLabel control={<Radio />} label="Esewa" value="Esewa" />
                  <FormControlLabel control={<Radio />} label="IME Pay" value="IME Pay" />
                  <FormControlLabel control={<Radio />} label="Cash on Delivery" value="Cash on Delivery" />
                </RadioGroup>
                <Button variant="contained" fullWidth onClick={() => setStep(3)} sx={{ mt: 2 }}>
                  Confirm order
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {step === 3 && (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Order confirmed
              </Alert>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Thank you for your order.
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 3 }}>
                Your {selectedItem.name} order for {quantity} item(s) has been scheduled. A confirmation will be sent to your email and phone.
              </Typography>
              <Stack spacing={1} sx={{ textAlign: 'left', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="textSecondary">Payment method</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{paymentMethod}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="textSecondary">Total amount</Typography>
                  <Typography sx={{ fontWeight: 700 }}>NRs {total}</Typography>
                </Box>
              </Stack>
              <Button variant="contained" onClick={() => onSetActiveNav('Home')} size="large">
                Back to home
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
