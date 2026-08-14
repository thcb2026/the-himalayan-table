import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Stack } from '@mui/material';

export function HomePageMUI() {
  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
          gap: 3,
          mb: 4,
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Welcome to
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              my: 1,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            The Himalayan Table
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ my: 2, lineHeight: 1.7, maxWidth: 600 }}>
            Discover authentic Nepali cuisine crafted with traditional recipes and the finest ingredients. From office catering to unforgettable events, we bring the flavors of the Himalayas to your table.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button variant="contained" size="large">
              Explore Menu
            </Button>
            <Button variant="outlined" size="large">
              Order Online
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Box>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                Free Delivery
              </Typography>
              <Typography variant="body2">Within 10 km radius</Typography>
            </Box>
            <Box>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                Expert Catering
              </Typography>
              <Typography variant="body2">For all occasions</Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.2fr 0.8fr' }, gap: 2 }}>
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

      <Box sx={{ my: 6 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
          Our Story
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 3 }}>
          Bringing Nepal to Your Table
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography color="textSecondary" sx={{ lineHeight: 1.8 }}>
              For over a decade, we've been dedicated to sharing authentic Nepali flavors with the Kathmandu Valley. Every dish is prepared fresh using traditional techniques and the highest quality ingredients sourced directly from local suppliers.
            </Typography>
          </Box>
          <Box>
            <Typography color="textSecondary" sx={{ lineHeight: 1.8 }}>
              Whether you're looking for a quick office lunch or planning a memorable celebration, we customize our offerings to suit your needs. Our team takes pride in delivering not just food, but an experience of Himalayan hospitality.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
