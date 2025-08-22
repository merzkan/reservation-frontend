import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box, Avatar, Divider } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { styled } from '@mui/material/styles';

const SidebarContainer = styled(Box)({
  height: '100vh',
  width: '280px',
  position: 'fixed',
  background: 'linear-gradient(180deg, #2c3e50 0%, #3498db 100%)',
  display: 'flex',
  flexDirection: 'column',
});

const UserInfo = styled(Box)({
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
});

const CustomListItemButton = styled(ListItemButton)(({ isactive }) => ({
  borderRadius: '0 24px 24px 0',
  margin: '0 16px',
  padding: '12px 16px',
  backgroundColor: isactive === 'true' ? 'rgba(255,255,255,0.2)' : 'transparent',
  borderLeft: isactive === 'true' ? '4px solid #fff' : '4px solid transparent',
}));

export default function SlideBar() {
  const { pathname } = useLocation();
  const isActive = (to) => pathname.startsWith(to);

  const links = [
    { to: "/dashboard/users", icon: <PeopleIcon />, label: "Kullanıcılar" },
    { to: "/dashboard/reservation", icon: <CalendarMonthIcon />, label: "Rezervasyonlar" },
    { to: "/dashboard/setting", icon: <SettingsIcon />, label: "Ayarlar" },
  ];

  return (
    <SidebarContainer>
      <Toolbar sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: '#fff', width: 40, height: 40 }}><DashboardIcon sx={{ color: '#3498db' }} /></Avatar>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>Admin Panel</Typography>
        </Box>
      </Toolbar>

      <UserInfo>
        <Avatar sx={{ width: 48, height: 48, mr: 2 }} src="/static/images/avatar/1.jpg" />
        <Box>
          <Typography sx={{ fontWeight: 500 }}>ADMİN</Typography>
          <Typography sx={{ fontSize: 12, opacity: 0.8 }}>Administrator</Typography>
        </Box>
      </UserInfo>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />

      <List sx={{ mt: 2, flexGrow: 1 }}>
        {links.map(link => (
          <ListItem key={link.to} disablePadding sx={{ mb: 1 }}>
            <NavLink to={link.to} style={{ textDecoration: 'none', width: '100%' }}>
              <CustomListItemButton isactive={isActive(link.to).toString()}>
                <ListItemIcon sx={{ color: 'white' }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} sx={{ color: 'white' }} />
              </CustomListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
    </SidebarContainer>
  );
}
