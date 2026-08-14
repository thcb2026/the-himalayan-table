import React from 'react';
import { Box, Typography, TextField, Button, Stack, Card, CardContent, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export function ContactPageMUI() {
  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
          Contact Us
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
          Get in touch with The Himalayan Table
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Send us a message
              </Typography>
              <Stack spacing={2}>
                <TextField label="Your Name" fullWidth />
                <TextField label="Email" type="email" fullWidth />
                <TextField label="Subject" fullWidth />
                <TextField label="Message" multiline rows={4} fullWidth />
                <Button variant="contained" size="large">
                  Send Message
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                  <PhoneIcon sx={{ color: 'primary.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Phone
                    </Typography>
                    <Link href="tel:+977-9800000000" underline="hover">
                      +977-9800000000
                    </Link>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                  <EmailIcon sx={{ color: 'primary.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Email
                    </Typography>
                    <Link href="mailto:hello@thehimalayantable.com" underline="hover">
                      hello@thehimalayantable.com
                    </Link>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                  <LocationOnIcon sx={{ color: 'primary.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Location
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Kathmandu Valley, Nepal
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Quick contact
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">WhatsApp: +977-9800000000</Typography>
                  <Typography variant="body2">Viber: +977-9800000000</Typography>
                  <Typography variant="body2">Instagram: @thehimalayantable</Typography>
                  <Typography variant="body2">Facebook: The Himalayan Table</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
