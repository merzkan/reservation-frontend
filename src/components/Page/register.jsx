import { useState } from "react";
import {Container,Paper,Typography,Box,TextField,Button,Alert,InputAdornment,IconButton,Fade,CircularProgress} from "@mui/material";
import {Visibility,VisibilityOff,EmailRounded,LockRounded,PersonRounded,HowToRegRounded} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    repassword: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors.backend) setErrors({});
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowRePassword = () => setShowRePassword(!showRePassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.repassword) {
      setErrors({ backend: "Şifreler eşleşmiyor!" });
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:3000/register", formData);
      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
      setFormData({ name: "", surname: "", email: "", password: "", repassword: "" });
      setErrors({});
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Kayıt başarısız";
      setErrors({ backend: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ minHeight: `calc(100vh - 64px)`, display: "flex", alignItems:"flex-start", justifyContent: "center", pt:10}}
    >
      <Fade in timeout={800}>
        <Paper
          elevation={10}
          sx={{
            p: 1,
            borderRadius: 10,
            width: "400px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255,255,255,0.95)"
          }}
        >
          {/* Başlık */}
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
                mb: 2
              }}
            >
              <HowToRegRounded sx={{ color: "white", fontSize: 30 }} />
            </Box>
            <Typography variant="h4" component="h1" align="center" gutterBottom color="#1976d2" fontWeight="bold">
              Yeni Hesap Oluşturun
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Bilgilerinizi girerek yeni bir hesap oluşturabilirsiniz
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* İsim ve Soyisim */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="İsim"
                name="name"
                variant="outlined"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Adınız"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded color="primary" />
                    </InputAdornment>
                  )
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, transition: "all 0.3s ease" } }}
              />
              <TextField
                label="Soyisim"
                name="surname"
                variant="outlined"
                fullWidth
                required
                value={formData.surname}
                onChange={handleChange}
                placeholder="Soyadınız"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded color="primary" />
                    </InputAdornment>
                  )
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, transition: "all 0.3s ease" } }}
              />
            </Box>

            {/* Email */}
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
                )
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, transition: "all 0.3s ease" } }}
            />

            {/* Şifre */}
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
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, transition: "all 0.3s ease" } }}
            />

            {/* Şifre Tekrar */}
            <TextField
              label="Şifre Tekrar"
              name="repassword"
              type={showRePassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={formData.repassword}
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
                    <IconButton onClick={handleClickShowRePassword} edge="end">
                      {showRePassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, transition: "all 0.3s ease" } }}
            />

            {errors.backend && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2, alignItems: "center" }}>
                {errors.backend}
              </Alert>
            )}

            {/* Buton */}
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
                "&:hover": {
                  boxShadow: "0 6px 12px rgba(25, 118, 210, 0.4)",
                  background: "linear-gradient(45deg, #1565c0 0%, #42a5f5 100%)"
                }
              }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <HowToRegRounded />}
            >
              {isLoading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Zaten hesabınız var mı?{" "}
                <Button color="primary" size="small" sx={{ fontWeight: "bold" }} onClick={() => navigate("/login")}>
                  Giriş Yap
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
}
