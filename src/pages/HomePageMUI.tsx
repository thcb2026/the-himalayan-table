import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Stack } from '@mui/material';
import { uiText } from '../content/common-content';
import { getLabel } from '../utils/getLabel';

export function HomePageMUI() {
  return (
    <Box component="div">
      <Box
        component="section"
        aria-labelledby="home-hero-title"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
          gap: 3,
          mb: 4,
          alignItems: 'center',
        }}
      >
        <Box component="article">
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {uiText.home.welcome}
          </Typography>
          <Typography
            id="home-hero-title"
            variant="h3"
            sx={{
              fontWeight: 700,
              my: 1,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            {uiText.home.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ my: 2, lineHeight: 1.7, maxWidth: 600 }}>
            {uiText.home.description}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3, alignItems: { xs: 'stretch', sm: 'center' } }}>
            <Button variant="contained" size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {getLabel('act_menu', uiText.home.exploreMenu)}
            </Button>
            <Button variant="outlined" size="large" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {getLabel('act_order_now', uiText.home.orderOnline)}
            </Button>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Box component="div">
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {uiText.home.freeDelivery}
              </Typography>
              <Typography variant="body2">{uiText.home.freeDeliveryDetail}</Typography>
            </Box>
            <Box component="div">
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {uiText.home.expertCatering}
              </Typography>
              <Typography variant="body2">{uiText.home.expertCateringDetail}</Typography>
            </Box>
          </Stack>
        </Box>

        <Box component="figure" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.2fr 0.8fr' }, gap: 2, m: 0 }}>
          <Card sx={{ gridRow: { sm: '1 / 3' }, minHeight: { xs: 400, sm: 500 } }}>
            <CardMedia
              component="img"
              height="100%"
              image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=500&fit=crop"
              alt="Nepali Food"
              sx={{ objectFit: 'cover', height: '100%' }}
            />
          </Card>
          <Card sx={{ minHeight: 240 }}>
            <CardMedia
              component="img"
              height="100%"
              image="https://images.unsplash.com/photo-1626082927389-6cd097cda687?w=300&h=240&fit=crop"
              alt="Spices"
              sx={{ objectFit: 'cover', height: '100%' }}
            />
          </Card>
          <Card sx={{ minHeight: 240 }}>
            <CardMedia
              component="img"
              height="100%"
              image="https://images.unsplash.com/photo-1505521585350-d7984bc03750?w=300&h=240&fit=crop"
              alt="Event Catering"
              sx={{ objectFit: 'cover', height: '100%' }}
            />
          </Card>
        </Box>
      </Box>

      <Box component="section" aria-labelledby="story-heading" sx={{ my: 6 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
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
