import { AppBar, Toolbar, Button, Box, Typography, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeRounded, LoginRounded, HowToRegRounded, ExitToAppRounded, CalendarMonthRounded, ListAltRounded, AccountCircleRounded } from "@mui/icons-material";
import { useState } from "react";
import SearchField from "../Navbar/search";

export default function Navbar({ isLoggedIn, setIsLoggedIn, query, setQuery, isAdmin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    handleMenuClose();
    navigate("/login");
  };

  const menuId = "account-menu";
  const renderMenu = (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { mt: 4.5, minWidth: 200, borderRadius: 2 } }}>
      <MenuItem disabled>
        <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
          <AccountCircleRounded sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="body2" color="text.secondary">
            {localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).email : "Kullanıcı"}
          </Typography>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ExitToAppRounded sx={{ mr: 1 }} /> Çıkış Yap
      </MenuItem>
    </Menu>
  );

  const buttonStyle = (path) => ({
    sx: {
      color: location.pathname === path ? "primary.contrastText" : "white",
      backgroundColor: location.pathname === path ? "rgba(255,255,255,0.3)" : "transparent", // Seçiliyse açık arka plan
      fontWeight: location.pathname === path ? "bold" : "normal",
      borderRadius: 2,
      px: 2,
      py: 1,
      "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
      display: "flex",
      alignItems: "center",
      gap: 1,
    },
  });

  return (
    <AppBar position="fixed" sx={{ width: '100%', backgroundColor: "rgba(25, 118, 210, 0.98)", zIndex: 1200 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer", ml: 2 }} onClick={() => navigate("/home")}>
          REZERVASYON
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
          {!isLoggedIn && <>
            <Button {...buttonStyle("/home")} onClick={() => navigate("/home")} startIcon={<HomeRounded />}>Ana Sayfa</Button>
            <Button {...buttonStyle("/login")} onClick={() => navigate("/login")} startIcon={<LoginRounded />}>Giriş Yap</Button>
            <Button {...buttonStyle("/register")} onClick={() => navigate("/register")} startIcon={<HowToRegRounded />}>Kayıt Ol</Button>
          </>}
          {isAdmin && isLoggedIn && <>
            <SearchField value={query} onChange={(e) => setQuery(e.target.value)} />
            <IconButton onClick={handleMenuOpen} color="inherit"><AccountCircleRounded /></IconButton>
          </>}
          {!isAdmin && isLoggedIn && <>
            <Button {...buttonStyle("/home")} onClick={() => navigate("/home")} startIcon={<HomeRounded />}>Ana Sayfa</Button>
            <Button {...buttonStyle("/reservation")} onClick={() => navigate("/reservation")} startIcon={<CalendarMonthRounded />}>Rezervasyon</Button>
            <Button {...buttonStyle("/reservationed")} onClick={() => navigate("/reservationed")} startIcon={<ListAltRounded />}>Rezervasyonlarım</Button>
            <IconButton onClick={handleMenuOpen} color="inherit"><AccountCircleRounded /></IconButton>
          </>}
        </Box>
      </Toolbar>
      {renderMenu}
    </AppBar>
  );
}
