import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
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
import { currency, steps, uiText } from '../content/common-content';
import { useAppDispatch } from '../store';
import { setActiveNav } from '../store';
import { getLabel } from '../utils/getLabel';

export function OrderFlowPageMUI() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(menuItems[0].id);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMode, setDeliveryMode] = useState<'Pickup' | 'Delivery'>('Delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<(typeof uiText.orderFlow.paymentOptions)[number]>('Esewa');

  const selectedItem = useMemo(
    () => menuItems.find((item) => item.id === selectedItemId) ?? menuItems[0],
    [selectedItemId],
  );

  const subtotal = selectedItem.price * quantity;
  const deliveryFee = deliveryMode === 'Delivery' ? 150 : 0;
  const total = subtotal + deliveryFee;


  return (
    <Box component="main" aria-labelledby="order-flow-title">
      <Box component="header" sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
          {uiText.orderFlow.eyebrow}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography id="order-flow-title" variant="h5" sx={{ fontWeight: 700 }}>
            {uiText.orderFlow.title}
          </Typography>
          <Button variant="outlined" onClick={() => dispatch(setActiveNav('Menu'))} sx={{ minHeight: 48 }}>
            {getLabel('act_back_to_menu', uiText.orderFlow.backToMenu)}
          </Button>
        </Box>
      </Box>

      <Stepper activeStep={step} sx={{ mb: 4, overflowX: 'auto' }} aria-label={uiText.accessibility.orderProgressSteps}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          <Box component="section" aria-labelledby="choose-food-heading">
            <Card>
              <CardContent>
                <Typography id="choose-food-heading" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {uiText.orderFlow.stepChooseFood}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {menuItems.map((item) => (
                    <Box
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      tabIndex={0}
                      role="button"
                      aria-label={uiText.accessibility.selectItem(item.name)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedItemId(item.id);
                        }
                      }}
                      sx={{
                        cursor: 'pointer',
                        border: selectedItemId === item.id ? '2px solid' : '1px solid',
                        borderColor: selectedItemId === item.id ? 'primary.main' : 'divider',
                        display: 'flex',
                        borderRadius: 1,
                        overflow: 'hidden',
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: 2,
                        },
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
                          {currency.symbol} {item.price}
                        </Typography>
                      </CardContent>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box component="aside" aria-label={uiText.accessibility.selectedItemSummary}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {uiText.orderFlow.selectedItem}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography>{selectedItem.name}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{currency.symbol} {selectedItem.price}</Typography>
                </Box>
                <TextField
                  label={uiText.orderFlow.quantityLabel}
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  fullWidth
                  slotProps={{ htmlInput: { min: 1 } }}
                  sx={{ mb: 2 }}
                  aria-label={uiText.orderFlow.quantityLabel}
                />
                <Button variant="contained" fullWidth onClick={() => setStep(1)} sx={{ minHeight: 48 }}>
                  {getLabel('act_continue', uiText.orderFlow.continue)}
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {step === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          <Box component="section" aria-labelledby="pickup-details-heading">
            <Card>
              <CardContent>
                <Typography id="pickup-details-heading" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {uiText.orderFlow.stepPickup}
                </Typography>
                <Stack spacing={2} component="fieldset" sx={{ border: 0, p: 0, m: 0 }}>
                  <Typography component="legend" variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                    {uiText.orderFlow.paymentMethod}
                  </Typography>
                  <FormControlLabel
                    control={<Radio />}
                    label={uiText.orderFlow.deliveryModePickup}
                    checked={deliveryMode === 'Pickup'}
                    onChange={() => setDeliveryMode('Pickup')}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label={uiText.orderFlow.deliveryModeDelivery}
                    checked={deliveryMode === 'Delivery'}
                    onChange={() => setDeliveryMode('Delivery')}
                  />
                  {deliveryMode === 'Delivery' && (
                    <TextField
                      label={uiText.orderFlow.deliveryAddress}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder={uiText.orderFlow.addressPlaceholder}
                      fullWidth
                      multiline
                      rows={2}
                      aria-label={uiText.orderFlow.deliveryAddress}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box component="aside" aria-label={uiText.accessibility.orderSummaryPickup}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {uiText.orderFlow.orderSummary}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{uiText.orderFlow.subtotal}</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{currency.symbol} {subtotal}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>{uiText.orderFlow.deliveryLabel}</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{currency.symbol} {deliveryFee}</Typography>
                  </Box>
                </Box>
                <Box sx={{ py: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">{uiText.orderFlow.total}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {currency.symbol} {total}
                    </Typography>
                  </Box>
                </Box>
                <Button variant="contained" fullWidth onClick={() => setStep(2)} sx={{ mt: 2, minHeight: 48 }}>
                  {getLabel('act_continue', uiText.orderFlow.continue)}
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          <Box component="section" aria-labelledby="datetime-heading">
            <Card>
              <CardContent>
                <Typography id="datetime-heading" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {uiText.orderFlow.stepDateTime}
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label={uiText.orderFlow.preferredDate}
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    aria-label={uiText.orderFlow.preferredDate}
                  />
                  <TextField
                    label={uiText.orderFlow.preferredTime}
                    type="time"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    aria-label={uiText.orderFlow.preferredTime}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box component="aside" aria-label={uiText.accessibility.paymentSelection}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {uiText.orderFlow.stepPayment}
                </Typography>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} aria-label={uiText.accessibility.choosePaymentMethod}>
                  {uiText.orderFlow.paymentOptions.map((option) => (
                    <FormControlLabel key={option} control={<Radio />} label={option} value={option} />
                  ))}
                </RadioGroup>
                <Button variant="contained" fullWidth onClick={() => setStep(3)} sx={{ mt: 2, minHeight: 48 }}>
                  {getLabel('act_confirm_order', uiText.orderFlow.confirmOrder)}
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
                {uiText.orderFlow.orderConfirmedMessage}
              </Alert>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {uiText.orderFlow.thankYou}
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 3 }}>
                {uiText.orderFlow.orderScheduled
                  .replace('{itemName}', selectedItem.name)
                  .replace('{quantity}', String(quantity))}
              </Typography>
              <Stack spacing={1} sx={{ textAlign: 'left', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="textSecondary">{uiText.orderFlow.paymentMethod}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{paymentMethod}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="textSecondary">{uiText.orderFlow.totalAmount}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{currency.symbol} {total}</Typography>
                </Box>
              </Stack>
              <Button variant="contained" onClick={() => dispatch(setActiveNav('Home'))} size="large">
                {getLabel('act_back_home', uiText.orderFlow.backToHome)}
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
