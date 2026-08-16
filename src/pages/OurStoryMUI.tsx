import { Box, Typography } from '@mui/material';
import { uiText } from '../content/common-content';

export const OurStoryMUI: React.FC = () => {
  const { ourStory, storyTitle, storyBodyOne, storyBodyTwo } = uiText.home;
  return (
    <Box component="section" sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 3 }, pb: 4 }}>
      <Box component="header" sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}>
          {ourStory}
        </Typography>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mt: 1, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
          {storyTitle}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Box component="article">
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {storyBodyOne}
          </Typography>
        </Box>
        <Box component="article">
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {storyBodyTwo}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};