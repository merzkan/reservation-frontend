import { useState } from "react";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import { SearchRounded, CloseRounded, FilterListRounded } from "@mui/icons-material";

export default function SearchField({ value, onChange, onFilterClick }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => onChange({ target: { value: "" } });

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Kullanıcı ara..."
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        sx={{
          width: isFocused || value ? "280px" : "200px",
          transition: "all 0.3s ease",
          '& .MuiOutlinedInput-root': {
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 3,
            paddingRight: value ? 7 : 1,
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.6)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.9)' },
          },
          '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.7)', opacity: 1 },
          '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.8)' },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <CloseRounded fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {onFilterClick && (
        <IconButton
          onClick={onFilterClick}
          sx={{
            ml: 1,
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
          }}
        >
          <FilterListRounded />
        </IconButton>
      )}
    </Box>
  );
}
