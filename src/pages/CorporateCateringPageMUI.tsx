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
import { CorporateCateringPageProps } from '../types';

export function CorporateCateringPageMUI({ state, onChange }: CorporateCateringPageProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!state.quote.companyName?.trim()) newErrors.companyName = 'Company name is required';
    if (!state.quote.contactPerson?.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!state.quote.email?.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.quote.email)) newErrors.email = 'Invalid email';
    if (!state.quote.phone?.trim()) newErrors.phone = 'Phone is required';
    if (!state.quote.eventDate?.trim()) newErrors.eventDate = 'Event date is required';
    if (!state.quote.numberOfPeople || state.quote.numberOfPeople < 10)
      newErrors.numberOfPeople = 'Minimum 10 people required';
    if (!state.quote.deliveryAddress?.trim()) newErrors.deliveryAddress = 'Delivery address is required';
    if (!state.quote.mealType?.trim()) newErrors.mealType = 'Meal type is required';
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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
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
          Corporate Catering
        </Typography>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          Get a customized quote for your event
        </Typography>
      </Box>

      {submitted && (
        <Alert
          severity="success"
          sx={{
            mb: 4,
            borderRadius: 3,
            bgcolor: 'primaryContainer.main',
            color: 'onPrimaryContainer.main',
          }}
        >
          Thank you for your interest! We'll contact you within 24 hours.
        </Alert>
      )}

      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        {/* Left Column: Form Controls */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 4, // M3 Large Corner Token (16px)
              boxShadow: 'none',
              borderColor: 'divider',
              p: { xs: 1, sm: 2 },
            }}
          >
            <CardContent>
              <Stack spacing={2.5}>
                {/* 2-Column Responsive Form Row */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    variant="filled"
                    label="Company Name"
                    value={state.quote.companyName || ''}
                    onChange={(e) => onChange('companyName', e.target.value)}
                    error={!!errors.companyName}
                    helperText={errors.companyName}
                    fullWidth
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                  <TextField
                    variant="filled"
                    label="Contact Person"
                    value={state.quote.contactPerson || ''}
                    onChange={(e) => onChange('contactPerson', e.target.value)}
                    error={!!errors.contactPerson}
                    helperText={errors.contactPerson}
                    fullWidth
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                  <TextField
                    variant="filled"
                    label="Email"
                    type="email"
                    value={state.quote.email || ''}
                    onChange={(e) => onChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                  <TextField
                    variant="filled"
                    label="Phone"
                    value={state.quote.phone || ''}
                    onChange={(e) => onChange('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    fullWidth
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    variant="filled"
                    label="Event Date"
                    type="date"
                    value={state.quote.eventDate || ''}
                    onChange={(e) => onChange('eventDate', e.target.value)}
                    error={!!errors.eventDate}
                    helperText={errors.eventDate}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                  <TextField
                    variant="filled"
                    label="Number of People"
                    type="number"
                    value={state.quote.numberOfPeople || ''}
                    onChange={(e) => onChange('numberOfPeople', Number(e.target.value) || 0)}
                    error={!!errors.numberOfPeople}
                    helperText={errors.numberOfPeople}
                    slotProps={{ htmlInput: { min: 10 } }}
                    fullWidth
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                </Box>

                <TextField
                  variant="filled"
                  label="Delivery Address"
                  value={state.quote.deliveryAddress || ''}
                  onChange={(e) => onChange('deliveryAddress', e.target.value)}
                  error={!!errors.deliveryAddress}
                  helperText={errors.deliveryAddress}
                  fullWidth
                  multiline
                  rows={2}
                  sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    variant="filled"
                    label="Meal Type"
                    value={state.quote.mealType || ''}
                    onChange={(e) => onChange('mealType', e.target.value)}
                    error={!!errors.mealType}
                    helperText={errors.mealType}
                    fullWidth
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                  <TextField
                    variant="filled"
                    label="Budget per Person"
                    type="number"
                    value={state.quote.budgetPerPerson || ''}
                    onChange={(e) => onChange('budgetPerPerson', Number(e.target.value) || 500)}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">NRs</InputAdornment>,
                      },
                    }}
                    fullWidth
                    sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                  />
                </Box>

                <TextField
                  variant="filled"
                  label="Dietary Requirements & Special Notes"
                  value={state.quote.dietaryRequirements || ''}
                  onChange={(e) => onChange('dietaryRequirements', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  sx={{ '& .MuiFilledInput-root': { borderRadius: '8px 8px 0 0' } }}
                />

                {/* M3 Pill CTA Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  sx={{
                    borderRadius: 50, // M3 Full Pill Token
                    py: 1.5,
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  Get a Quote
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
                  Cost Estimate
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
                    {state.quote.numberOfPeople || 0} guests × NRs {state.quote.budgetPerPerson || 500}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    NRs {estimate.toLocaleString()}
                  </Typography>
                </Paper>

                <Divider sx={{ my: 2 }} />

                {/* Feature List */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Why Choose The Himalayan Table?
                </Typography>

                <Stack spacing={1.5}>
                  {[
                    'Authentic mountain spices & recipes',
                    'Freshly sourced organic ingredients',
                    'Customizable corporate menu options',
                    'Punctual delivery & professional setup',
                  ].map((feature, idx) => (
                    <Stack key={idx} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <CheckCircleOutlinedIcon color="primary" fontSize="small" />
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