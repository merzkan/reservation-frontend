import { Box, Drawer } from "@mui/material";
import SlideBar from "./slidebar";
import { Outlet } from "react-router-dom";

const drawerWidth = 240;

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#232629ff", 
            color: "white",
          },
        }}
      >
        <SlideBar />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#f9f9f9", 
          color: "black", 
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
