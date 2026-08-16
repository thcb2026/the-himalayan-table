import React from 'react';
import { Box, Typography, Button, Card, CardMedia, Stack } from '@mui/material';
import { uiText, galleryItems } from '../content/common-content';
import { useAppDispatch, setActiveNav } from '../store';
import { getLabel } from '../utils/getLabel';

export const HomePageMUI: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Box component="section" sx={{ pb: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
          gap: { xs: 3, md: 4 },
          mb: 5,
          alignItems: 'center',
          px: { xs: 0, sm: 0.5 },
        }}
      >
        <Box component="article" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}>
            {uiText.home.welcome}
          </Typography>
          <Typography
            id="home-hero-title"
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              my: 0,
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3.4rem' },
              lineHeight: 1.1,
            }}
          >
            {uiText.home.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.7, maxWidth: 620, fontSize: { xs: '1rem', md: '1.05rem' } }}
          >
            {uiText.home.description}
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 1, alignItems: { xs: 'stretch', sm: 'center' }, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => dispatch(setActiveNav('Order Online'))}
              sx={{ width: { xs: '100%', sm: 'auto' }, minHeight: 48, whiteSpace: 'nowrap' }}
            >
              {getLabel('act_order_now', uiText.home.orderOnline)}
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {uiText.home.freeDelivery}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {uiText.home.freeDeliveryDetail}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {uiText.home.expertCatering}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {uiText.home.expertCateringDetail}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box
          component="figure"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1.2fr 0.8fr' },
            gap: 2,
            m: 0,
          }}
        >
          {galleryItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                ...(item.gridRow && { gridRow: item.gridRow }),
                minHeight: item.minHeight,
                overflow: 'hidden',
                borderRadius: 3,
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={uiText.media[item.altKey as keyof typeof uiText.media]}
                sx={{ objectFit: 'cover', height: '100%' }}
              />
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};