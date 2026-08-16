import React from 'react';
import { Box, Typography, Button, Card, CardMedia, Stack } from '@mui/material';
import { uiText } from '../content/common-content';
import { useAppDispatch } from '../store';
import { setActiveNav } from '../store';
import { getLabel } from '../utils/getLabel';

export function HomePageMUI() {
  const dispatch = useAppDispatch();

  return (
    <Box component="div" sx={{ pb: 2 }}>
      <Box
        component="section"
        aria-labelledby="home-hero-title"
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
            sx={{
              fontWeight: 800,
              my: 0,
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3.4rem' },
              lineHeight: 1.1,
            }}
          >
            {uiText.home.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ lineHeight: 1.7, maxWidth: 620, fontSize: { xs: '1rem', md: '1.05rem' } }}>
            {uiText.home.description}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1, alignItems: { xs: 'stretch', sm: 'center' }, width: { xs: '100%', sm: 'auto' } }}>
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
            <Box component="div" sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {uiText.home.freeDelivery}
              </Typography>
              <Typography variant="body2" color="textSecondary">{uiText.home.freeDeliveryDetail}</Typography>
            </Box>
            <Box component="div" sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {uiText.home.expertCatering}
              </Typography>
              <Typography variant="body2" color="textSecondary">{uiText.home.expertCateringDetail}</Typography>
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
          <Card sx={{ gridRow: { sm: '1 / 3' }, minHeight: { xs: 360, sm: 500 }, overflow: 'hidden', borderRadius: 3 }}>
            <CardMedia
              component="img"
              height="100%"
              image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=500&fit=crop"
              alt={uiText.media.nepaliFood}
              sx={{ objectFit: 'cover', height: '100%' }}
            />
          </Card>
          <Card sx={{ minHeight: 220, overflow: 'hidden', borderRadius: 3 }}>
            <CardMedia
              component="img"
              height="100%"
              image="https://images.unsplash.com/photo-1626082927389-6cd097cda687?w=300&h=240&fit=crop"
              alt={uiText.media.spices}
              sx={{ objectFit: 'cover', height: '100%' }}
            />
          </Card>
          <Card sx={{ minHeight: 220, overflow: 'hidden', borderRadius: 3 }}>
            <CardMedia
              component="img"
              height="100%"
              image="https://images.unsplash.com/photo-1505521585350-d7984bc03750?w=300&h=240&fit=crop"
              alt={uiText.media.eventCatering}
              sx={{ objectFit: 'cover', height: '100%' }}
            />
          </Card>
        </Box>
      </Box>

      <Box component="section" aria-labelledby="story-heading" sx={{ my: 6 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}>
          {uiText.home.ourStory}
        </Typography>
        <Typography id="story-heading" variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 3 }}>
          {uiText.home.storyTitle}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box component="article">
            <Typography color="textSecondary" sx={{ lineHeight: 1.8 }}>
              {uiText.home.storyBodyOne}
            </Typography>
          </Box>
          <Box component="article">
            <Typography color="textSecondary" sx={{ lineHeight: 1.8 }}>
              {uiText.home.storyBodyTwo}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
