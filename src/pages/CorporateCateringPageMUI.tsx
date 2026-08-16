import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  Alert,
  InputAdornment,
  Divider,
  Paper,
} from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { currency, uiText, validationMessages } from '../content/common-content';
import { getLabel } from '../utils/getLabel';
import { useAppDispatch, useAppSelector, selectAppState, updateQuote } from '../store';

export const CorporateCateringPageMUI = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectAppState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!state.quote.companyName?.trim()) newErrors.companyName = validationMessages.corporate.companyName;
    if (!state.quote.contactPerson?.trim()) newErrors.contactPerson = validationMessages.corporate.contactPerson;
    if (!state.quote.email?.trim()) newErrors.email = validationMessages.corporate.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.quote.email)) newErrors.email = validationMessages.corporate.emailInvalid;
    if (!state.quote.phone?.trim()) newErrors.phone = validationMessages.corporate.phone;
    if (!state.quote.eventDate?.trim()) newErrors.eventDate = validationMessages.corporate.eventDate;
    if (!state.quote.numberOfPeople || state.quote.numberOfPeople < 10)
      newErrors.numberOfPeople = validationMessages.corporate.numberOfPeople;
    if (!state.quote.deliveryAddress?.trim()) newErrors.deliveryAddress = validationMessages.corporate.deliveryAddress;
    if (!state.quote.mealType?.trim()) newErrors.mealType = validationMessages.corporate.mealType;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const estimate = (state.quote.numberOfPeople || 0) * (state.quote.budgetPerPerson || 500);
  const corporateFeatures = Array.isArray(uiText?.corporate?.features) ? uiText.corporate.features : [];

  return (
    <Box component="main" sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Box component="header" sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          component="span"
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            letterSpacing: '0.1em',
            display: 'block',
            mb: 0.5,
          }}
        >
          {uiText.corporate.eyebrow}
        </Typography>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          {uiText.corporate.title}
        </Typography>
      </Box>

      {submitted && (
        <Alert
          severity="success"
          aria-live="polite"
          sx={{
            mb: 4,
            borderRadius: 3,
            bgcolor: 'primaryContainer.main',
            color: 'onPrimaryContainer.main',
          }}
        >
          {uiText.corporate.successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            component="form"
            variant="outlined"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
            sx={{
              borderRadius: 4,
              boxShadow: 'none',
              borderColor: 'divider',
              p: { xs: 1, sm: 2 },
            }}
          >
            <CardContent>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    variant="filled"
                    label={uiText.corporate.companyName}
                    value={state.quote.companyName || ''}
                    onChange={(e) => dispatch(updateQuote({ key: 'companyName', value: e.target.value }))}
                    error={!!errors.companyName}
                    helperText={errors.companyName}
                    fullWidth
                    autoComplete="organization"
                    aria-label={uiText.corporate.companyName}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                  <TextField
                    variant="filled"
                    label={uiText.corporate.contactPerson}
                    value={state.quote.contactPerson || ''}
                    onChange={(e) => dispatch(updateQuote({ key: 'contactPerson', value: e.target.value }))}
                    error={!!errors.contactPerson}
                    helperText={errors.contactPerson}
                    fullWidth
                    autoComplete="name"
                    aria-label={uiText.corporate.contactPerson}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                  <TextField
                    variant="filled"
                    label={uiText.corporate.emailLabel}
                    type="email"
                    value={state.quote.email || ''}
                    onChange={(e) => dispatch(updateQuote({ key: 'email', value: e.target.value }))}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    autoComplete="email"
                    aria-label={uiText.corporate.emailLabel}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                  <TextField
                    variant="filled"
                    label={uiText.corporate.phoneLabel}
                    value={state.quote.phone || ''}
                    onChange={(e) => dispatch(updateQuote({ key: 'phone', value: e.target.value }))}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    fullWidth
                    autoComplete="tel"
                    aria-label={uiText.corporate.phoneLabel}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    variant="filled"
                    label={uiText.corporate.eventDate}
                    type="date"
                    value={state.quote.eventDate || ''}
                    onChange={(e) => dispatch(updateQuote({ key: 'eventDate', value: e.target.value }))}
                    error={!!errors.eventDate}
                    helperText={errors.eventDate}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                    aria-label={uiText.corporate.eventDate}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                  <TextField
                    variant="filled"
                    label={uiText.corporate.numberOfPeople}
                    type="number"
                    value={state.quote.numberOfPeople || ''}
                    onChange={(e) => dispatch(updateQuote({ key: 'numberOfPeople', value: Number(e.target.value) || 0 }))}
                    error={!!errors.numberOfPeople}
                    helperText={errors.numberOfPeople}
                    slotProps={{ htmlInput: { min: 10 } }}
                    fullWidth
                    aria-label={uiText.corporate.numberOfPeople}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                </Box>

                <TextField
                  variant="filled"
                  label={uiText.corporate.deliveryAddress}
                  value={state.quote.deliveryAddress || ''}
                  onChange={(e) => dispatch(updateQuote({ key: 'deliveryAddress', value: e.target.value }))}
                  error={!!errors.deliveryAddress}
                  helperText={errors.deliveryAddress}
                  fullWidth
                  multiline
                  rows={2}
                  autoComplete="street-address"
                  aria-label={uiText.corporate.deliveryAddress}
                  sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    variant="filled"
                    label={uiText.corporate.mealType}
                    value={state.quote.mealType || ''}
                    onChange={(e) => dispatch(updateQuote({ key: 'mealType', value: e.target.value }))}
                    error={!!errors.mealType}
                    helperText={errors.mealType}
                    fullWidth
                    aria-label={uiText.corporate.mealType}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                  <TextField
                    variant="filled"
                    label={uiText.corporate.budgetPerPerson}
                    type="number"
                    value={state.quote.budgetPerPerson || ''}
                    onChange={(e) => dispatch(updateQuote({ key: 'budgetPerPerson', value: Number(e.target.value) || 500 }))}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>,
                      },
                    }}
                    fullWidth
                    aria-label={uiText.corporate.budgetPerPerson}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                </Box>

                <TextField
                  variant="filled"
                  label={uiText.corporate.dietaryRequirements}
                  value={state.quote.dietaryRequirements || ''}
                  onChange={(e) => dispatch(updateQuote({ key: 'dietaryRequirements', value: e.target.value }))}
                  fullWidth
                  multiline
                  rows={2}
                  aria-label={uiText.corporate.dietaryRequirements}
                  sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 50,
                    py: 1.5,
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: 'none',
                    minHeight: 48,
                    '&:hover': {
                      boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  {getLabel('act_get_quote', uiText.corporate.submit)}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Sticky Summary & M3 Cards */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 4,
                boxShadow: 'none',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {uiText.corporate.costEstimate}
                </Typography>

                {/* M3 Tonal Highlight Card */}
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'action.hover',
                    p: 2.5,
                    borderRadius: 3,
                    mb: 3,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {state.quote.numberOfPeople || 0} {uiText.corporate.guestsPrefix} {state.quote.budgetPerPerson || 500}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    NRs {estimate.toLocaleString()}
                  </Typography>
                </Paper>

                <Divider sx={{ my: 2 }} />

                {/* Feature List */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {uiText.corporate.featureTitle}
                </Typography>

                <Stack spacing={1.5}>
                  {corporateFeatures.map((feature, idx) => (
                    <Stack key={idx} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <CheckCircleOutlinedIcon color="primary" fontSize="small" aria-hidden="true" />
                      <Typography variant="body2">{feature}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}