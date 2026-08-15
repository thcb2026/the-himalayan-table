import React from 'react';
import { Box, Typography, TextField, Button, Stack, Card, CardContent, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { contactInfo, uiText } from '../content/common-content';
import { getLabel } from '../utils/getLabel';

export function ContactPageMUI() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Box component="div">
      <Box component="header" sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
          {uiText.contact.eyebrow}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
          {uiText.contact.title}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Box component="section" aria-labelledby="contact-form-heading">
          <Card>
            <CardContent>
              <Typography id="contact-form-heading" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {uiText.contact.sendMessage}
              </Typography>
              <Stack spacing={2} component="form" noValidate onSubmit={handleSubmit} aria-label="Contact form">
                <TextField label={uiText.contact.yourName} fullWidth autoComplete="name" aria-label={uiText.contact.yourName} />
                <TextField label={uiText.contact.yourEmail} type="email" fullWidth autoComplete="email" aria-label={uiText.contact.yourEmail} />
                <TextField label={uiText.contact.subject} fullWidth autoComplete="off" aria-label={uiText.contact.subject} />
                <TextField label={uiText.contact.message} multiline rows={4} fullWidth autoComplete="off" aria-label={uiText.contact.message} />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ width: { xs: '100%', sm: 'auto' }, minHeight: 48 }}
                >
                  {getLabel('act_send_message', uiText.contact.sendButton)}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box component="aside" aria-label="Contact details">
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                  <PhoneIcon aria-hidden="true" sx={{ color: 'primary.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {uiText.contact.phoneLabel}
                    </Typography>
                    <Link href={`tel:${contactInfo.phone}`} underline="hover" aria-label={`Call ${contactInfo.phone}`}>
                      {contactInfo.phone}
                    </Link>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                  <EmailIcon aria-hidden="true" sx={{ color: 'primary.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {uiText.contact.emailLabel}
                    </Typography>
                    <Link href={`mailto:${contactInfo.email}`} underline="hover" aria-label={`Email ${contactInfo.email}`}>
                      {contactInfo.email}
                    </Link>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                  <LocationOnIcon aria-hidden="true" sx={{ color: 'primary.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {uiText.contact.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {contactInfo.location}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {uiText.contact.quickContact}
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">{uiText.contact.whatsapp}: {contactInfo.phone}</Typography>
                  <Typography variant="body2">{uiText.contact.viber}: {contactInfo.phone}</Typography>
                  <Typography variant="body2">{uiText.contact.instagram}: {contactInfo.instagram}</Typography>
                  <Typography variant="body2">{uiText.contact.facebook}: {contactInfo.facebook}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
