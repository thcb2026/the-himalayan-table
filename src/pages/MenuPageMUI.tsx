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
import { MenuCategory, DietaryTag, MenuPageProps } from '../types';

const categories: (MenuCategory | 'All')[] = ['All', 'Everyday Favorites', 'Nepali Traditional', 'Appetizers & Snacks', 'Desserts'];
const dietaryOptions: (DietaryTag | 'All')[] = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut Allergies'];

export function MenuPageMUI({ state, onCategoryChange, onDietaryChange, onAddToCart }: MenuPageProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
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
  }, [state.selectedCategory, state.selectedDietary]);

  const handleAddToCart = (itemId: string) => {
    const quantity = quantities[itemId] || 1;
    onAddToCart(itemId, quantity);
    setQuantities((current) => ({ ...current, [itemId]: 1 }));
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
          Menu
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
          Explore our authentic Nepali flavors
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={state.selectedCategory} label="Category" onChange={(e) => onCategoryChange(e.target.value as MenuCategory | 'All')}>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Dietary</InputLabel>
          <Select value={state.selectedDietary} label="Dietary" onChange={(e) => onDietaryChange(e.target.value as DietaryTag | 'All')}>
            {dietaryOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
        {filtered.map((item) => (
          <Box key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" height="200" image={item.image} alt={item.name} sx={{ objectFit: 'cover' }} />
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {item.portion}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    NRs {item.price}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40 }}>
                  {item.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {item.vegetarian && <Typography variant="caption" sx={{ bgcolor: 'success.light', px: 1, py: 0.5, borderRadius: 1 }}>Vegetarian</Typography>}
                  {item.vegan && <Typography variant="caption" sx={{ bgcolor: 'info.light', px: 1, py: 0.5, borderRadius: 1 }}>Vegan</Typography>}
                  {item.glutenFree && <Typography variant="caption" sx={{ bgcolor: 'warning.light', px: 1, py: 0.5, borderRadius: 1 }}>GF</Typography>}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button size="small" onClick={() => setQuantities((c) => ({ ...c, [item.id]: Math.max(1, (c[item.id] || 1) - 1) }))} variant="outlined">
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <Typography sx={{ minWidth: 40, textAlign: 'center' }}>{quantities[item.id] || 1}</Typography>
                  <Button size="small" onClick={() => setQuantities((c) => ({ ...c, [item.id]: (c[item.id] || 1) + 1 }))} variant="outlined">
                    <AddIcon fontSize="small" />
                  </Button>
                  <Button size="small" variant="contained" onClick={() => handleAddToCart(item.id)} sx={{ flex: 1 }}>
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
