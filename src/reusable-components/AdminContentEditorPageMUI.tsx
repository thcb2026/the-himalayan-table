import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Container,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AdminContentEditorPageMUIProps, ContentEditorSaveMode, TabPanelProps } from '../types';
import { resolveAuthHeaders } from '../utils/common-helpers';
import { hydrateFrontendContent, pageGroups } from '../content/common-content';
import { initializeMenuData } from '../content/data';


export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-editor-tabpanel-${index}`}
      aria-labelledby={`content-editor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export const ContentEditorPageMUI = ({
  title = 'Content Editor',
  subtitle = 'Edit frontend UI text, labels, and metadata. Changes are saved to the database and deployed to the application.',
  contentEndpoint = '/api/pms_tms/v1/content/frontend-common-content',
  menuEndpoint = '/api/pms_tms/v1/content/frontend-menu-data',
  saveMode = 'callback',
  onContentSaved,
  onMenuSaved,
  onError,
  showHeader = true,
}: AdminContentEditorPageMUIProps = {}) => {
  const [contentData, setContentData] = useState<any>(null);
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(6);
  const [editedData, setEditedData] = useState<any>(null);
  const [editedMenuData, setEditedMenuData] = useState<any>(null);

  const triggerAfterSave = (mode: ContentEditorSaveMode, callback?: () => void) => {
    if (mode === 'reload' && typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.reload();
      }, 1200);
      return;
    }

    if (mode === 'callback') {
      callback?.();
    }
  };

  useEffect(() => {
    fetchContent();
    fetchMenuData();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(contentEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }

      const result = await response.json();
      setContentData(result.data);
      setEditedData(JSON.parse(JSON.stringify(result.data)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load content';
      setError(message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuData = async () => {
    try {
      const response = await fetch(menuEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch menu data: ${response.statusText}`);
        return;
      }

      const result = await response.json();
      setMenuData(result.data);
      setEditedMenuData(JSON.parse(JSON.stringify(result.data)));
    } catch (err) {
      console.error('Menu data fetch error:', err);
    }
  };

 

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updates: any = {};
      const findDifferences = (original: any, edited: any, path = '') => {
        for (const key in edited) {
          if (edited.hasOwnProperty(key)) {
            const currentPath = path ? `${path}.${key}` : key;
            if (typeof edited[key] === 'object' && edited[key] !== null && !Array.isArray(edited[key])) {
              findDifferences(original?.[key] || {}, edited[key], currentPath);
            } else if (JSON.stringify(original?.[key]) !== JSON.stringify(edited[key])) {
              updates[currentPath] = edited[key];
            }
          }
        }
      };

      findDifferences(contentData, editedData);

      if (Object.keys(updates).length === 0) {
        setSuccess('No changes to save');
        return;
      }

      const response = await fetch(contentEndpoint, {
        method: 'PATCH',
        headers: resolveAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Update failed: ${response.statusText}`);
      }

      const result = await response.json();
      setContentData(JSON.parse(JSON.stringify(editedData)));
      setSuccess('Content updated successfully');
      console.info('Update result:', result);

      if (typeof window !== 'undefined') {
        await hydrateFrontendContent();
        await initializeMenuData();
        window.dispatchEvent(new CustomEvent('frontend-content-updated', { detail: { updates } }));
        window.dispatchEvent(new CustomEvent('content-editor-updated', { detail: { updates } }));
      }

      triggerAfterSave(saveMode, () => onContentSaved?.({ updates, result }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save content';
      setError(message);
      onError?.(message);
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMenuData = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(menuEndpoint, {
        method: 'PUT',
        headers: resolveAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ data: editedMenuData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Update failed: ${response.statusText}`);
      }

      setMenuData(JSON.parse(JSON.stringify(editedMenuData)));
      setSuccess('Menu data updated successfully');

      if (typeof window !== 'undefined') {
        await initializeMenuData();
        window.dispatchEvent(new CustomEvent('menu-data-updated', { detail: { data: editedMenuData } }));
      }

      triggerAfterSave(saveMode, () => onMenuSaved?.({ data: editedMenuData, result: { success: true } }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save menu data';
      setError(message);
      onError?.(message);
      console.error('Save menu data error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setEditedData(JSON.parse(JSON.stringify(contentData)));
    setEditedMenuData(JSON.parse(JSON.stringify(menuData)));
    setError(null);
    setSuccess(null);
  };

  const addMenuItemCard = () => {
    const updated = JSON.parse(JSON.stringify(editedMenuData || menuData));
    updated.menuItems.push({
      id: `menu-item-${Date.now()}`,
      name: 'New Menu Item',
      category: 'Everyday Favorites',
      description: 'Add a description',
      price: 0,
      portion: '1 serving',
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutAllergyFriendly: false,
      spiceLevel: 'Mild',
      allergens: [],
      image: '',
    });
    setEditedMenuData(updated);
  };

  const deleteMenuItemCard = (index: number) => {
    const updated = JSON.parse(JSON.stringify(editedMenuData || menuData));
    updated.menuItems.splice(index, 1);
    setEditedMenuData(updated);
  };

  const addPackageCard = () => {
    const updated = JSON.parse(JSON.stringify(editedMenuData || menuData));
    updated.cateringPackages.push({
      id: `package-${Date.now()}`,
      name: 'New Package',
      description: 'Add a package description',
      startingAt: 0,
      badge: 'New',
    });
    setEditedMenuData(updated);
  };

  const deletePackageCard = (index: number) => {
    const updated = JSON.parse(JSON.stringify(editedMenuData || menuData));
    updated.cateringPackages.splice(index, 1);
    setEditedMenuData(updated);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const setNestedValue = (source: any, path: string, value: any) => {
    const nextData = JSON.parse(JSON.stringify(source));
    const parts = path.split('.');
    let target = nextData;

    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (!(part in target)) {
        target[part] = {};
      }
      target = target[part];
    }

    target[parts[parts.length - 1]] = value;
    return nextData;
  };

  const getNestedValue = (source: any, path: string): any => {
    if (!path) {
      return source;
    }

    return path.split('.').reduce((current, segment) => {
      if (current == null) {
        return undefined;
      }
      return current[segment];
    }, source);
  };

  const handleTextChange = (path: string, value: string | number) => {
    setEditedData(setNestedValue(editedData, path, value));
  };

  const renderPageContentFields = () => {
    if (!editedData || typeof editedData !== 'object') {
      return null;
    }


    return (
      <Stack spacing={3}>
        {pageGroups.map((group) => (
          <Card key={group.title} variant="outlined">
            <CardHeader title={group.title} sx={{ pb: 1 }} />
            <CardContent>
              <Stack spacing={2}>
                {group.fields.map(({ path, label, multiline }) => {
                  const value = getNestedValue(editedData, path);
                  if (value === undefined || value === null) {
                    return null;
                  }

                  return (
                    <TextField
                      key={path}
                      label={label}
                      value={String(value)}
                      onChange={(event) => handleTextChange(path, event.target.value)}
                      fullWidth
                      multiline={Boolean(multiline)}
                      minRows={multiline ? 3 : 1}
                    />
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box component="section" sx={{ mb: 4 }}>
        {showHeader && (
          <Box component="header" sx={{ mb: 3 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Administration
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {title}
            </Typography>
            <Typography color="textSecondary">
              {subtitle}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Frontend Content"
            titleTypographyProps={{ sx: { fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700 } }}
            action={
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={fetchContent}
                  disabled={loading || saving}
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Reload
                </Button>
                <Button
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={loading || saving}
                  variant="contained"
                  size="small"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </Stack>
            }
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: { xs: 1, md: 2 },
              pb: { xs: 1.5, md: 1 },
            }}
          />
          <Divider />

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Content sections"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                px: 2,
                '& .MuiTabs-flexContainer': {
                  flexWrap: 'wrap',
                  gap: 0.5,
                },
                '& .MuiTab-root': {
                  minHeight: 42,
                  textTransform: 'none',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.72rem', sm: '0.8rem' },
                  px: { xs: 1, sm: 1.5 },
                },
              }}
            >
              <Tab label="Brand & Nav" id="content-editor-tab-0" />
              <Tab label="Home" id="content-editor-tab-1" />
              <Tab label="Menu & Order" id="content-editor-tab-2" />
              <Tab label="Checkout" id="content-editor-tab-3" />
              <Tab label="Contact & Corp" id="content-editor-tab-4" />
              <Tab label="Metadata" id="content-editor-tab-5" />
              <Tab label="Lists" id="content-editor-tab-6" />
              <Tab label="Menu Items" id="content-editor-tab-7" />
              <Tab label="Packages" id="content-editor-tab-8" />
              <Tab label="All Content" id="content-editor-tab-9" />
            </Tabs>
          </Box>

          <CardContent
            sx={{
              pt: 3,
              '& .MuiCard-root': {
                borderRadius: 3,
                borderColor: '#e4c4a3',
                backgroundColor: '#fffaf7',
                boxShadow: '0 2px 12px rgba(122, 81, 54, 0.08)',
              },
              '& .MuiButton-root': {
                fontWeight: 700,
                letterSpacing: '0.01em',
                textTransform: 'none',
                borderRadius: 2,
                minHeight: 42,
              },
              '& .MuiButton-contained': {
                color: '#fffaf6',
                backgroundColor: '#8a4d26',
                '&:hover': {
                  backgroundColor: '#713d1e',
                },
              },
              '& .MuiButton-outlined': {
                color: '#4b2d1f',
                backgroundColor: '#fffaf7',
                borderColor: '#b76f3d',
                '&:hover': {
                  borderColor: '#8a4d26',
                  backgroundColor: '#f8efe7',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#4b2d1f',
                fontWeight: 600,
              },
              '& .MuiInputBase-input': {
                color: '#2f241e',
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f9f3ee',
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#c28a5d',
                },
                '&:hover fieldset': {
                  borderColor: '#a66336',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8a4d26',
                  boxShadow: '0 0 0 1px rgba(138,77,38,0.12)',
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#5a3c2d',
              },
              '& .MuiFormControlLabel-label': {
                color: '#3e2c24',
                fontWeight: 500,
              },
            }}
          >
            {/* Tab 0: App Brand & Navigation */}
            <TabPanel value={tabValue} index={0}>
              <Stack spacing={2}>
                <TextField
                  label="App Brand Name"
                  value={editedData?.appBrand?.name || ''}
                  onChange={(e) => handleTextChange('appBrand.name', e.target.value)}
                  fullWidth
                  multiline
                />
                <TextField
                  label="App Brand Tagline"
                  value={editedData?.appBrand?.tagline || ''}
                  onChange={(e) => handleTextChange('appBrand.tagline', e.target.value)}
                  fullWidth
                  multiline
                />
                <TextField
                  label="Short Description"
                  value={editedData?.appBrand?.shortDescription || ''}
                  onChange={(e) => handleTextChange('appBrand.shortDescription', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
                <TextField
                  label="Footer Text"
                  value={editedData?.appBrand?.footerText || ''}
                  onChange={(e) => handleTextChange('appBrand.footerText', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Stack>
            </TabPanel>

            {/* Tab 1: UI Text - Home */}
            <TabPanel value={tabValue} index={1}>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                  Home Page Text
                </Typography>
                <TextField
                  label="Home Welcome Text"
                  value={editedData?.uiText?.home?.welcome || ''}
                  onChange={(e) => handleTextChange('uiText.home.welcome', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Home Title"
                  value={editedData?.uiText?.home?.title || ''}
                  onChange={(e) => handleTextChange('uiText.home.title', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Home Description"
                  value={editedData?.uiText?.home?.description || ''}
                  onChange={(e) => handleTextChange('uiText.home.description', e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />
                <TextField
                  label="Story Title"
                  value={editedData?.uiText?.home?.storyTitle || ''}
                  onChange={(e) => handleTextChange('uiText.home.storyTitle', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Story Body (Paragraph 1)"
                  value={editedData?.uiText?.home?.storyBodyOne || ''}
                  onChange={(e) => handleTextChange('uiText.home.storyBodyOne', e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />
                <TextField
                  label="Story Body (Paragraph 2)"
                  value={editedData?.uiText?.home?.storyBodyTwo || ''}
                  onChange={(e) => handleTextChange('uiText.home.storyBodyTwo', e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Stack>
            </TabPanel>

            {/* Tab 2: UI Text - Menu & Order */}
            <TabPanel value={tabValue} index={2}>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                  Menu Page Text
                </Typography>
                <TextField
                  label="Menu Title"
                  value={editedData?.uiText?.menu?.title || ''}
                  onChange={(e) => handleTextChange('uiText.menu.title', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Menu Category Label"
                  value={editedData?.uiText?.menu?.categoryLabel || ''}
                  onChange={(e) => handleTextChange('uiText.menu.categoryLabel', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Menu Dietary Label"
                  value={editedData?.uiText?.menu?.dietaryLabel || ''}
                  onChange={(e) => handleTextChange('uiText.menu.dietaryLabel', e.target.value)}
                  fullWidth
                />

                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                  Order Flow Text
                </Typography>
                <TextField
                  label="Order Flow Title"
                  value={editedData?.uiText?.orderFlow?.title || ''}
                  onChange={(e) => handleTextChange('uiText.orderFlow.title', e.target.value)}
                  fullWidth
                />
              </Stack>
            </TabPanel>

            {/* Tab 3: UI Text - Checkout & Cart */}
            <TabPanel value={tabValue} index={3}>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                  Checkout Page Text
                </Typography>
                <TextField
                  label="Checkout Title"
                  value={editedData?.uiText?.checkout?.title || ''}
                  onChange={(e) => handleTextChange('uiText.checkout.title', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Checkout Eyebrow"
                  value={editedData?.uiText?.checkout?.eyebrow || ''}
                  onChange={(e) => handleTextChange('uiText.checkout.eyebrow', e.target.value)}
                  fullWidth
                />

                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                  Cart Text
                </Typography>
                <TextField
                  label="Cart Title"
                  value={editedData?.uiText?.cart?.title || ''}
                  onChange={(e) => handleTextChange('uiText.cart.title', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Cart Empty Message"
                  value={editedData?.uiText?.cart?.empty || ''}
                  onChange={(e) => handleTextChange('uiText.cart.empty', e.target.value)}
                  fullWidth
                />
              </Stack>
            </TabPanel>

            {/* Tab 4: UI Text - Contact & Corporate */}
            <TabPanel value={tabValue} index={4}>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                  Contact Page Text
                </Typography>
                <TextField
                  label="Contact Title"
                  value={editedData?.uiText?.contact?.title || ''}
                  onChange={(e) => handleTextChange('uiText.contact.title', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Contact Eyebrow"
                  value={editedData?.uiText?.contact?.eyebrow || ''}
                  onChange={(e) => handleTextChange('uiText.contact.eyebrow', e.target.value)}
                  fullWidth
                />

                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                  Corporate Catering Text
                </Typography>
                <TextField
                  label="Corporate Title"
                  value={editedData?.uiText?.corporate?.title || ''}
                  onChange={(e) => handleTextChange('uiText.corporate.title', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Corporate Eyebrow"
                  value={editedData?.uiText?.corporate?.eyebrow || ''}
                  onChange={(e) => handleTextChange('uiText.corporate.eyebrow', e.target.value)}
                  fullWidth
                />
              </Stack>
            </TabPanel>

            {/* Tab 5: Metadata & Categories */}
            <TabPanel value={tabValue} index={5}>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                  Currency
                </Typography>
                <TextField
                  label="Currency Symbol"
                  value={editedData?.currency?.symbol || ''}
                  onChange={(e) => handleTextChange('currency.symbol', e.target.value)}
                  fullWidth
                />

                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                  Contact Information
                </Typography>
                <TextField
                  label="Phone Number"
                  value={editedData?.contactInfo?.phone || ''}
                  onChange={(e) => handleTextChange('contactInfo.phone', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Email Address"
                  value={editedData?.contactInfo?.email || ''}
                  onChange={(e) => handleTextChange('contactInfo.email', e.target.value)}
                  fullWidth
                  type="email"
                />
                <TextField
                  label="Location"
                  value={editedData?.contactInfo?.location || ''}
                  onChange={(e) => handleTextChange('contactInfo.location', e.target.value)}
                  fullWidth
                />
              </Stack>
            </TabPanel>

            {/* Tab 6: Dropdowns & Lists */}
            <TabPanel value={tabValue} index={6}>
              <Stack spacing={3}>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1, color: 'primary.main' }}>
                  Menu Categories
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Edit the categories available in the menu filter dropdown. Each item on a new line.
                </Typography>
                <TextField
                  label="Menu Categories"
                  value={editedData?.menuCategories?.join('\n') || ''}
                  onChange={(e) => {
                    const categories = e.target.value.split('\n').filter((c: string) => c.trim());
                    setEditedData(setNestedValue(editedData, 'menuCategories', categories));
                  }}
                  fullWidth
                  multiline
                  minRows={6}
                  placeholder="All&#10;Everyday Favorites&#10;Nepali Traditional&#10;Appetizers & Snacks&#10;Desserts"
                />

                <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1, color: 'primary.main' }}>
                  Dietary Options
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Edit the dietary filter options. Each item on a new line.
                </Typography>
                <TextField
                  label="Dietary Options"
                  value={editedData?.dietaryOptions?.join('\n') || ''}
                  onChange={(e) => {
                    const options = e.target.value.split('\n').filter((o: string) => o.trim());
                    setEditedData(setNestedValue(editedData, 'dietaryOptions', options));
                  }}
                  fullWidth
                  multiline
                  minRows={6}
                  placeholder="All&#10;Vegetarian&#10;Vegan&#10;Gluten-Free&#10;Dairy-Free&#10;Nut Allergies"
                />

                <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1, color: 'primary.main' }}>
                  Order Flow Steps
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Edit the steps shown in the order flow stepper. Each item on a new line.
                </Typography>
                <TextField
                  label="Order Flow Steps"
                  value={editedData?.steps?.join('\n') || ''}
                  onChange={(e) => {
                    const stepsArray = e.target.value.split('\n').filter((s: string) => s.trim());
                    setEditedData(setNestedValue(editedData, 'steps', stepsArray));
                  }}
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder="Choose food&#10;Pickup or Delivery&#10;Date & Time&#10;Confirm order"
                />
              </Stack>
            </TabPanel>

            {/* Tab 7: Menu Items */}
            <TabPanel value={tabValue} index={7}>
              {editedMenuData && editedMenuData.menuItems ? (
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mt: 1 }}>
                      Menu Items ({editedMenuData.menuItems.length} total)
                    </Typography>
                    <Button variant="contained" onClick={addMenuItemCard}>
                      + Add Menu Item
                    </Button>
                  </Box>
                  {editedMenuData.menuItems.map((item: any, idx: number) => (
                    <Card key={item.id || idx} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                      <CardHeader
                        title={`${item.name} (ID: ${item.id})`}
                        titleTypographyProps={{ sx: { fontWeight: 700, color: '#3e2c24' } }}
                        action={
                          <Button
                            color="error"
                            variant="outlined"
                            size="small"
                            onClick={() => deleteMenuItemCard(idx)}
                            sx={{ ml: 1 }}
                          >
                            Delete
                          </Button>
                        }
                        sx={{ pb: 1 }}
                      />
                      <CardContent sx={{ pt: 1 }}>
                        <Stack spacing={2}>
                          <TextField
                            label="Name"
                            value={item.name || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.menuItems[idx].name = e.target.value;
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                          />
                          <TextField
                            label="Category"
                            value={item.category || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.menuItems[idx].category = e.target.value;
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                          />
                          <TextField
                            label="Description"
                            value={item.description || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.menuItems[idx].description = e.target.value;
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                            multiline
                            rows={2}
                          />
                          <TextField
                            label="Price"
                            type="number"
                            value={item.price || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.menuItems[idx].price = Number(e.target.value);
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                          />
                          <TextField
                            label="Portion"
                            value={item.portion || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.menuItems[idx].portion = e.target.value;
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                          />
                          <TextField
                            label="Spice Level"
                            value={item.spiceLevel || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.menuItems[idx].spiceLevel = e.target.value;
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                          />
                          <TextField
                            label="Image URL"
                            value={item.image || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.menuItems[idx].image = e.target.value;
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                          />
                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={item.vegetarian || false}
                                  onChange={(e) => {
                                    const updated = JSON.parse(JSON.stringify(editedMenuData));
                                    updated.menuItems[idx].vegetarian = e.target.checked;
                                    setEditedMenuData(updated);
                                  }}
                                />
                              }
                              label="Vegetarian"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={item.vegan || false}
                                  onChange={(e) => {
                                    const updated = JSON.parse(JSON.stringify(editedMenuData));
                                    updated.menuItems[idx].vegan = e.target.checked;
                                    setEditedMenuData(updated);
                                  }}
                                />
                              }
                              label="Vegan"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={item.glutenFree || false}
                                  onChange={(e) => {
                                    const updated = JSON.parse(JSON.stringify(editedMenuData));
                                    updated.menuItems[idx].glutenFree = e.target.checked;
                                    setEditedMenuData(updated);
                                  }}
                                />
                              }
                              label="Gluten-Free"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={item.dairyFree || false}
                                  onChange={(e) => {
                                    const updated = JSON.parse(JSON.stringify(editedMenuData));
                                    updated.menuItems[idx].dairyFree = e.target.checked;
                                    setEditedMenuData(updated);
                                  }}
                                />
                              }
                              label="Dairy-Free"
                            />
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography color="textSecondary">No menu items loaded</Typography>
              )}
            </TabPanel>

            {/* Tab 8: Catering Packages */}
            <TabPanel value={tabValue} index={8}>
              {editedMenuData && editedMenuData.cateringPackages ? (
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mt: 1 }}>
                      Catering Packages ({editedMenuData.cateringPackages.length} total)
                    </Typography>
                    <Button variant="contained" onClick={addPackageCard}>
                      + Add Package
                    </Button>
                  </Box>
                  {editedMenuData.cateringPackages.map((pkg: any, idx: number) => (
                    <Card key={pkg.id || idx} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                      <CardHeader
                        title={`${pkg.name} (ID: ${pkg.id})`}
                        titleTypographyProps={{ sx: { fontWeight: 700, color: '#3e2c24' } }}
                        action={
                          <Button
                            color="error"
                            variant="outlined"
                            size="small"
                            onClick={() => deletePackageCard(idx)}
                            sx={{ ml: 1 }}
                          >
                            Delete
                          </Button>
                        }
                        sx={{ pb: 1 }}
                      />
                      <CardContent sx={{ pt: 1 }}>
                        <Stack spacing={2}>
                          <TextField
                            label="Name"
                            value={pkg.name || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.cateringPackages[idx].name = e.target.value;
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                          />
                          <TextField
                            label="Description"
                            value={pkg.description || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.cateringPackages[idx].description = e.target.value;
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                            multiline
                            rows={2}
                          />
                          <TextField
                            label="Starting At (Price)"
                            type="number"
                            value={pkg.startingAt || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.cateringPackages[idx].startingAt = Number(e.target.value);
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                          />
                          <TextField
                            label="Badge"
                            value={pkg.badge || ''}
                            onChange={(e) => {
                              const updated = JSON.parse(JSON.stringify(editedMenuData));
                              updated.cateringPackages[idx].badge = e.target.value;
                              setEditedMenuData(updated);
                            }}
                            fullWidth
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography color="textSecondary">No catering packages loaded</Typography>
              )}
            </TabPanel>

            {/* Tab 9: All Editable Content */}
            <TabPanel value={tabValue} index={9}>
              {renderPageContentFields()}
            </TabPanel>
          </CardContent>

          <Divider />
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleReset} disabled={saving} variant="outlined">
              Reset
            </Button>
            <Button
              onClick={() => {
                if (tabValue === 6) {
                  // Dropdowns & Lists - save common content with arrays
                  handleSave();
                } else if (tabValue === 7 || tabValue === 8) {
                  // Menu Items or Catering Packages - save menu data
                  handleSaveMenuData();
                } else {
                  // All other tabs - save common content
                  handleSave();
                }
              }}
              disabled={saving || loading}
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export const AdminContentEditorPageMUI = (props: AdminContentEditorPageMUIProps) => (
  <ContentEditorPageMUI
    {...props}
    saveMode={props.saveMode ?? 'reload'}
    showHeader={props.showHeader ?? true}
  />
);

export default AdminContentEditorPageMUI;
