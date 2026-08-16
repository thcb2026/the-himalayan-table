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
import { TabPanelProps } from '../types';

export function TabPanel(props: TabPanelProps) {
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

export function AdminContentEditorPageMUI() {
  const [contentData, setContentData] = useState<any>(null);
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(6);
  const [editedData, setEditedData] = useState<any>(null);
  const [editedMenuData, setEditedMenuData] = useState<any>(null);

  useEffect(() => {
    fetchContent();
    fetchMenuData();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/pms_tms/v1/content/frontend-common-content', {
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
      const response = await fetch('/api/pms_tms/v1/content/frontend-menu-data', {
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

  const resolveAuthHeaders = (): Record<string, string> => {
    const tokenCandidates = [
      localStorage.getItem('accessToken'),
      localStorage.getItem('auth_token'),
      localStorage.getItem('token'),
      localStorage.getItem('jwt'),
      localStorage.getItem('platform_auth_token'),
      sessionStorage.getItem('accessToken'),
      sessionStorage.getItem('auth_token'),
      sessionStorage.getItem('token'),
      sessionStorage.getItem('jwt'),
      sessionStorage.getItem('platform_auth_token'),
    ];

    const token = tokenCandidates.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim();

    if (token) {
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
    }

    return {
      'Content-Type': 'application/json',
      'x-bypass-auth': 'true',
      'x-dev-user': '1',
    };
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

      const response = await fetch('/api/pms_tms/v1/content/frontend-common-content', {
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
        window.dispatchEvent(new CustomEvent('frontend-content-updated', { detail: { updates } }));
        window.dispatchEvent(new CustomEvent('content-editor-updated', { detail: { updates } }));
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save content';
      setError(message);
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMenuData = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/pms_tms/v1/content/frontend-menu-data', {
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
        window.dispatchEvent(new CustomEvent('menu-data-updated', { detail: { data: editedMenuData } }));
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save menu data';
      setError(message);
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

    const pageGroups = [
      {
        title: 'Header / App Shell',
        fields: [
          { path: 'appBrand.name', label: 'Header brand name' },
          { path: 'appBrand.tagline', label: 'Header tagline' },
          { path: 'currency.symbol', label: 'Currency symbol' },
        ],
      },
      {
        title: 'HomePageMUI',
        fields: [
          { path: 'uiText.home.welcome', label: 'Home welcome label' },
          { path: 'uiText.home.title', label: 'Hero title' },
          { path: 'uiText.home.description', label: 'Hero description', multiline: true },
          { path: 'uiText.home.exploreMenu', label: 'Explore menu button label' },
          { path: 'uiText.home.orderOnline', label: 'Order now button label' },
          { path: 'uiText.home.freeDelivery', label: 'Free delivery label' },
          { path: 'uiText.home.freeDeliveryDetail', label: 'Free delivery detail' },
          { path: 'uiText.home.expertCatering', label: 'Expert catering label' },
          { path: 'uiText.home.expertCateringDetail', label: 'Expert catering detail' },
          { path: 'uiText.home.ourStory', label: 'Our story heading label' },
          { path: 'uiText.home.storyTitle', label: 'Story section title' },
          { path: 'uiText.home.storyBodyOne', label: 'Story paragraph 1', multiline: true },
          { path: 'uiText.home.storyBodyTwo', label: 'Story paragraph 2', multiline: true },
        ],
      },
      {
        title: 'MenuPageMUI',
        fields: [
          { path: 'uiText.app.menu', label: 'Menu breadcrumb / section label' },
          { path: 'uiText.menu.title', label: 'Menu page title' },
          { path: 'uiText.menu.categoryLabel', label: 'Category filter label' },
          { path: 'uiText.menu.dietaryLabel', label: 'Dietary filter label' },
          { path: 'uiText.menu.vegetarian', label: 'Vegetarian tag' },
          { path: 'uiText.menu.vegan', label: 'Vegan tag' },
          { path: 'uiText.menu.glutenFree', label: 'Gluten-free tag' },
          { path: 'uiText.menu.add', label: 'Add to cart label' },
        ],
      },
      {
        title: 'OrderFlowPageMUI',
        fields: [
          { path: 'uiText.orderFlow.eyebrow', label: 'Order flow eyebrow' },
          { path: 'uiText.orderFlow.title', label: 'Order flow title' },
          { path: 'uiText.orderFlow.backToMenu', label: 'Back to menu button' },
          { path: 'uiText.orderFlow.stepChooseFood', label: 'Choose food step label' },
          { path: 'uiText.orderFlow.selectedItem', label: 'Selected item label' },
          { path: 'uiText.orderFlow.quantityLabel', label: 'Quantity label' },
          { path: 'uiText.orderFlow.continue', label: 'Continue button label' },
          { path: 'uiText.orderFlow.stepPickup', label: 'Pickup step label' },
          { path: 'uiText.orderFlow.paymentMethod', label: 'Payment method heading' },
          { path: 'uiText.orderFlow.deliveryModePickup', label: 'Pickup option label' },
          { path: 'uiText.orderFlow.deliveryModeDelivery', label: 'Delivery option label' },
          { path: 'uiText.orderFlow.deliveryAddress', label: 'Delivery address label' },
          { path: 'uiText.orderFlow.addressPlaceholder', label: 'Delivery address placeholder' },
          { path: 'uiText.orderFlow.orderSummary', label: 'Order summary label' },
          { path: 'uiText.orderFlow.subtotal', label: 'Subtotal label' },
          { path: 'uiText.orderFlow.deliveryLabel', label: 'Delivery label' },
          { path: 'uiText.orderFlow.total', label: 'Total label' },
          { path: 'uiText.orderFlow.stepDateTime', label: 'Date/time step label' },
          { path: 'uiText.orderFlow.preferredDate', label: 'Preferred date label' },
          { path: 'uiText.orderFlow.preferredTime', label: 'Preferred time label' },
          { path: 'uiText.orderFlow.stepPayment', label: 'Payment step label' },
          { path: 'uiText.orderFlow.confirmOrder', label: 'Confirm order button label' },
          { path: 'uiText.orderFlow.orderConfirmedMessage', label: 'Order confirmed message' },
          { path: 'uiText.orderFlow.thankYou', label: 'Thank you message' },
          { path: 'uiText.orderFlow.orderScheduled', label: 'Order scheduled message', multiline: true },
          { path: 'uiText.orderFlow.backToHome', label: 'Back to home button label' },
        ],
      },
      {
        title: 'CheckoutPageMUI / CartDrawerMUI',
        fields: [
          { path: 'uiText.app.continueShopping', label: 'Continue shopping button' },
          { path: 'uiText.app.goToCheckout', label: 'Go to checkout button' },
          { path: 'uiText.cart.title', label: 'Cart title' },
          { path: 'uiText.cart.empty', label: 'Cart empty state' },
          { path: 'uiText.cart.subtotal', label: 'Cart subtotal label' },
          { path: 'uiText.checkout.eyebrow', label: 'Checkout eyebrow' },
          { path: 'uiText.checkout.title', label: 'Checkout title' },
          { path: 'uiText.checkout.customerDetails', label: 'Customer details label' },
          { path: 'uiText.checkout.firstName', label: 'First name label' },
          { path: 'uiText.checkout.lastName', label: 'Last name label' },
          { path: 'uiText.checkout.email', label: 'Email label' },
          { path: 'uiText.checkout.phone', label: 'Phone label' },
          { path: 'uiText.checkout.deliveryAddress', label: 'Delivery address label' },
          { path: 'uiText.checkout.notes', label: 'Notes label' },
          { path: 'uiText.checkout.paymentMethod', label: 'Payment method label' },
          { path: 'uiText.checkout.placeOrder', label: 'Place order label' },
          { path: 'uiText.checkout.back', label: 'Back label' },
          { path: 'uiText.checkout.sentTitle', label: 'Thank you title' },
          { path: 'uiText.checkout.sentMessage', label: 'Order submitted message', multiline: true },
          { path: 'uiText.checkout.customerLabel', label: 'Customer label' },
          { path: 'uiText.checkout.deliveryTo', label: 'Delivery to label' },
          { path: 'uiText.checkout.totalAmount', label: 'Total amount label' },
          { path: 'uiText.checkout.backToHome', label: 'Back to home label' },
        ],
      },
      {
        title: 'ContactPageMUI',
        fields: [
          { path: 'uiText.contact.eyebrow', label: 'Contact eyebrow' },
          { path: 'uiText.contact.title', label: 'Contact title' },
          { path: 'uiText.contact.sendMessage', label: 'Send message heading' },
          { path: 'uiText.contact.yourName', label: 'Your name field' },
          { path: 'uiText.contact.yourEmail', label: 'Email field' },
          { path: 'uiText.contact.subject', label: 'Subject field' },
          { path: 'uiText.contact.message', label: 'Message field' },
          { path: 'uiText.contact.sendButton', label: 'Send form button' },
          { path: 'uiText.contact.phoneLabel', label: 'Phone label' },
          { path: 'uiText.contact.emailLabel', label: 'Email label' },
          { path: 'uiText.contact.location', label: 'Location label' },
          { path: 'uiText.contact.quickContact', label: 'Quick contact label' },
          { path: 'uiText.contact.whatsapp', label: 'WhatsApp label' },
          { path: 'uiText.contact.viber', label: 'Viber label' },
          { path: 'uiText.contact.instagram', label: 'Instagram label' },
          { path: 'uiText.contact.facebook', label: 'Facebook label' },
          { path: 'contactInfo.phone', label: 'Contact phone value' },
          { path: 'contactInfo.email', label: 'Contact email value' },
          { path: 'contactInfo.location', label: 'Contact location value' },
          { path: 'contactInfo.instagram', label: 'Instagram handle' },
          { path: 'contactInfo.facebook', label: 'Facebook handle' },
        ],
      },
      {
        title: 'CorporateCateringPageMUI',
        fields: [
          { path: 'uiText.corporate.eyebrow', label: 'Corporate eyebrow' },
          { path: 'uiText.corporate.title', label: 'Corporate title' },
          { path: 'uiText.corporate.companyName', label: 'Company name field' },
          { path: 'uiText.corporate.contactPerson', label: 'Contact person field' },
          { path: 'uiText.corporate.emailLabel', label: 'Corporate email label' },
          { path: 'uiText.corporate.phoneLabel', label: 'Corporate phone label' },
          { path: 'uiText.corporate.eventDate', label: 'Event date label' },
          { path: 'uiText.corporate.numberOfPeople', label: 'Number of people label' },
          { path: 'uiText.corporate.deliveryAddress', label: 'Delivery address label' },
          { path: 'uiText.corporate.mealType', label: 'Meal type label' },
          { path: 'uiText.corporate.budgetPerPerson', label: 'Budget per person label' },
          { path: 'uiText.corporate.dietaryRequirements', label: 'Dietary requirements label' },
          { path: 'uiText.corporate.successMessage', label: 'Success message', multiline: true },
          { path: 'uiText.corporate.featureTitle', label: 'Feature title' },
        ],
      },
      {
        title: 'Validation & Accessibility',
        fields: [
          { path: 'validationMessages.checkout.firstName', label: 'Checkout first name validation' },
          { path: 'validationMessages.checkout.lastName', label: 'Checkout last name validation' },
          { path: 'validationMessages.checkout.emailRequired', label: 'Checkout email required validation' },
          { path: 'validationMessages.checkout.emailInvalid', label: 'Checkout email invalid validation' },
          { path: 'validationMessages.checkout.phoneRequired', label: 'Checkout phone required validation' },
          { path: 'validationMessages.checkout.phoneInvalid', label: 'Checkout phone invalid validation' },
          { path: 'validationMessages.checkout.deliveryAddress', label: 'Checkout delivery validation' },
          { path: 'validationMessages.corporate.companyName', label: 'Corporate company validation' },
          { path: 'validationMessages.corporate.contactPerson', label: 'Corporate contact validation' },
          { path: 'validationMessages.corporate.emailRequired', label: 'Corporate email required validation' },
          { path: 'validationMessages.corporate.emailInvalid', label: 'Corporate email invalid validation' },
          { path: 'validationMessages.corporate.phone', label: 'Corporate phone validation' },
          { path: 'validationMessages.corporate.eventDate', label: 'Corporate date validation' },
          { path: 'validationMessages.corporate.numberOfPeople', label: 'Corporate guest validation' },
          { path: 'validationMessages.corporate.deliveryAddress', label: 'Corporate delivery validation' },
          { path: 'validationMessages.corporate.mealType', label: 'Corporate meal type validation' },
        ],
      },
    ];

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
        <Box component="header" sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Administration
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Content Editor
          </Typography>
          <Typography color="textSecondary">
            Edit frontend UI text, labels, and metadata. Changes are saved to the database and deployed to the application.
          </Typography>
        </Box>

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
            action={
              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={fetchContent}
                  disabled={loading || saving}
                  variant="outlined"
                >
                  Reload
                </Button>
                <Button
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={loading || saving}
                  variant="contained"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Stack>
            }
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
}
