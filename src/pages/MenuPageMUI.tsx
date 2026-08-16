import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { menuItems } from '../content/data';
import { dietaryOptions, menuCategories, uiText } from '../content/common-content';
import { MenuCategory, DietaryTag } from '../types';
import { useAppDispatch, useAppSelector, setSelectedCategory, setSelectedDietary, addToCart, selectAppState, setActiveNav } from '../store';
import { getLabel } from '../utils/getLabel';

export function MenuPageMUI() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectAppState);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categories = menuCategories as (MenuCategory | 'All')[];
  const dietaryChoices = dietaryOptions as (DietaryTag | 'All')[];

  const deduplicatedMenuItems = useMemo(() => {
    const seen = new Set<string>();

    return menuItems.filter((item) => {
      const key = String(item.id || `${item.name}-${item.category}-${item.price}`);
      if (!key || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }, []);

  const filtered = useMemo(() => {
    return deduplicatedMenuItems.filter((item) => {
      const categoryMatch = state.selectedCategory === 'All' || item.category === state.selectedCategory;
      let dietaryMatch = true;

      if (state.selectedDietary !== 'All') {
        if (state.selectedDietary === 'Vegetarian') dietaryMatch = item.vegetarian;
        else if (state.selectedDietary === 'Vegan') dietaryMatch = item.vegan;
        else if (state.selectedDietary === 'Gluten-Free') dietaryMatch = item.glutenFree;
        else if (state.selectedDietary === 'Dairy-Free') dietaryMatch = item.dairyFree;
        else if (state.selectedDietary === 'Nut Allergies') dietaryMatch = item.nutAllergyFriendly;
      }

      return categoryMatch && dietaryMatch;
    });
  }, [state.selectedCategory, state.selectedDietary, deduplicatedMenuItems]);

  const handleAddToCart = (itemId: string) => {
    const quantity = quantities[itemId] || 1;
    dispatch(addToCart({ itemId, quantity }));
    setQuantities((current) => ({ ...current, [itemId]: 1 }));
  };

  return (
    <Box component="div" sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2, md: 3 }, pb: 4 }}>
      <Box component="header" sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}>
          {uiText.app.menu}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
          {uiText.menu.title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            dispatch(setActiveNav('Admin'));
            if (typeof window !== 'undefined') {
              const nextHash = '#admin';
              if (window.location.hash !== nextHash) {
                window.location.hash = nextHash;
              }
            }
          }}
          sx={{ minWidth: 140, width: { xs: '100%', sm: 'auto' } }}
        >
          Edit Menu
        </Button>
      </Box>

      <Box
        component="section"
        aria-label={uiText.accessibility.menuFilters}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          mb: 4,
        }}
      >
        <FormControl fullWidth>
          <InputLabel>{uiText.menu.categoryLabel}</InputLabel>
          <Select value={state.selectedCategory} label={uiText.menu.categoryLabel} onChange={(e) => dispatch(setSelectedCategory(e.target.value as MenuCategory | 'All'))}>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>{uiText.menu.dietaryLabel}</InputLabel>
          <Select value={state.selectedDietary} label={uiText.menu.dietaryLabel} onChange={(e) => dispatch(setSelectedDietary(e.target.value as DietaryTag | 'All'))}>
            {dietaryChoices.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        component="section"
        aria-label={uiText.accessibility.menuItems}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
          gap: { xs: 2.5, md: 3 },
        }}
      >
        {filtered.length === 0 ? (
          <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 6, border: '1px dashed', borderColor: 'divider', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No menu items found
            </Typography>
            <Typography color="textSecondary">
              Try a different category or dietary filter.
            </Typography>
          </Box>
        ) : (
          filtered.map((item) => (
            <Box component="article" key={item.id} sx={{ height: '100%' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
                <CardMedia component="img" image={item.image} alt={item.name} sx={{ height: { xs: 180, sm: 200 }, objectFit: 'cover' }} />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
                    <Box component="div" sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.portion}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', ml: 1 }}>
                      NRs {item.price}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 42 }}>
                    {item.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {item.vegetarian && (
                      <Typography variant="caption" sx={{ bgcolor: 'success.main', color: 'success.contrastText', px: 1, py: 0.5, borderRadius: 1 }}>
                        {uiText.menu.vegetarian}
                      </Typography>
                    )}
                    {item.vegan && (
                      <Typography variant="caption" sx={{ bgcolor: 'info.main', color: 'info.contrastText', px: 1, py: 0.5, borderRadius: 1 }}>
                        {uiText.menu.vegan}
                      </Typography>
                    )}
                    {item.glutenFree && (
                      <Typography variant="caption" sx={{ bgcolor: 'warning.main', color: 'warning.contrastText', px: 1, py: 0.5, borderRadius: 1 }}>
                        {uiText.menu.glutenFree}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mt: 'auto' }}>
                    <Button
                      size="small"
                      onClick={() => setQuantities((c) => ({ ...c, [item.id]: Math.max(1, (c[item.id] || 1) - 1) }))}
                      variant="outlined"
                      aria-label={uiText.accessibility.decreaseQuantity(item.name)}
                      sx={{ minWidth: 42, minHeight: 42, flexShrink: 0, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
                    >
                      <RemoveIcon fontSize="small" />
                    </Button>
                    <Typography sx={{ minWidth: 40, textAlign: 'center', fontWeight: 700 }}>{quantities[item.id] || 1}</Typography>
                    <Button
                      size="small"
                      onClick={() => setQuantities((c) => ({ ...c, [item.id]: (c[item.id] || 1) + 1 }))}
                      variant="outlined"
                      aria-label={uiText.accessibility.increaseQuantity(item.name)}
                      sx={{ minWidth: 42, minHeight: 42, flexShrink: 0, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
                    >
                      <AddIcon fontSize="small" />
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleAddToCart(item.id)}
                      sx={{ flex: 1, minWidth: 96, minHeight: 42, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
                    >
                      {getLabel('act_add_to_cart', uiText.menu.add)}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
