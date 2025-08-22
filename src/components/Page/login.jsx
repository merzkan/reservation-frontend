import { useState } from "react";
import axios from "axios";
import {Container,Paper,Typography,Box,TextField,Button,Alert,InputAdornment,IconButton,Fade,CircularProgress} from "@mui/material";
import {Visibility,VisibilityOff,EmailRounded,LockRounded,LoginRounded} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn, setIsAdmin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors.backend) setErrors({});
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}login`, formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", data.isAdmin);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggedIn(true);
      setIsAdmin(data.isAdmin);
      setFormData({ email: "", password: "" });
      setErrors({});
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Giriş başarısız. Lütfen bilgilerinizi kontrol edip tekrar deneyin.";
      setErrors({ backend: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ minHeight: `calc(100vh - 64px)`, display: "flex", alignItems:"flex-start", justifyContent: "center", pt:10}}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={10}
          sx={{
            p: 3,
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Box
              sx={{
                backgroundColor: "#1976d2",
                height: 60,
                width: 60,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <LoginRounded sx={{ color: "white", fontSize: 30 }} />
            </Box>
            <Typography variant="h4" component="h1" align="center" gutterBottom color="#1976d2" fontWeight="bold">
              Hesabınıza Giriş Yapın
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
              Devam etmek için lütfen e-posta ve şifrenizi girin
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="E-posta Adresi"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              placeholder="ornek@email.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRounded color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, transition: "all 0.3s ease" } }}
            />
            <TextField
              label="Şifre"
              name="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRounded color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, transition: "all 0.3s ease" } }}
            />

            {errors.backend && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2, alignItems: "center" }}>
                {errors.backend}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #1976d2 0%, #42a5f5 100%)",
                boxShadow: "0 4px 8px rgba(25, 118, 210, 0.3)",
                "&:hover": { boxShadow: "0 6px 12px rgba(25, 118, 210, 0.4)", background: "linear-gradient(45deg, #1565c0 0%, #42a5f5 100%)" },
              }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginRounded />}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Hesabınız yok mu?{" "}
                <Button color="primary" size="small" sx={{ fontWeight: "bold" }} onClick={() => navigate("/register")}>
                  Kayıt Ol
                </Button>
              </Typography>
              <Button color="primary" size="small" sx={{ mt: 1, fontWeight: "medium" }}>
                Şifremi Unuttum
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
}
