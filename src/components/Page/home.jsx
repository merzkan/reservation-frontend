import { Box, Button, Typography, Card, CardContent, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleClick = () => {
    if (token) navigate("/reservation");
    else navigate("/login");
  };

  const features = [
    { title: "Hızlı Rezervasyon", description: "Sadece birkaç tıklama ile uygun saatleri seçip rezervasyon yapabilirsiniz.", icon: "⏱️" },
    { title: "Kullanıcı Dostu Arayüz", description: "Modern ve sade bir arayüz ile tüm işlemleri kolayca yapabilirsiniz.", icon: "🎨" },
    { title: "Güvenli Sistem", description: "Tüm rezervasyon bilgileriniz güvenli bir şekilde saklanır ve korunur.", icon: "🔒" },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: "100vh",
          minHeight: "600px",
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Fade in={fadeIn} timeout={1000}>
          <Box sx={{ zIndex: 2, maxWidth: '800px' }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: "bold", textShadow: "2px 2px 6px rgba(0,0,0,0.3)", mb: 3 }}>
              Rezervasyon Sistemi
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mb: 4, fontSize: '1.25rem', maxWidth: '600px', mx: 'auto' }}>
              Kolay ve hızlı bir şekilde rezervasyon yapın, zamanınızı verimli kullanın
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                px: 6,
                py: 1.5,
                fontWeight: "bold",
                background: "linear-gradient(45deg, #ff4081, #f50057)",
                color: "white",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                borderRadius: '50px',
                fontSize: '1rem',
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0px 8px 25px rgba(245, 0, 87, 0.4)",
                  background: "linear-gradient(45deg, #f50057, #ff4081)",
                },
              }}
              onClick={handleClick}
            >
              Rezervasyon Yap
            </Button>
          </Box>
        </Fade>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, px: 2, backgroundColor: "#f8f9fa" }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: "bold",
            mb: 8,
            color: '#2c3e50',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              margin: '16px auto 0',
              borderRadius: '2px'
            }
          }}
        >
          Öne Çıkan Özellikler
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {features.map((feature, idx) => (
            <Fade key={idx} in={fadeIn} timeout={1000} style={{ transitionDelay: `${idx * 200}ms` }}>
              <Card
                sx={{
                  width: 300,
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 3,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  borderRadius: 3,
                  backgroundColor: "white",
                  border: '1px solid rgba(0,0,0,0.05)',
                  "&:hover": { transform: "translateY(-10px)", boxShadow: "0 15px 35px rgba(0,0,0,0.12)" },
                }}
              >
                <CardContent>
                  <Typography variant="h3" sx={{ mb: 2, fontSize: '3rem', opacity: 0.7 }}>{feature.icon}</Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2, color: '#2c3e50' }}>{feature.title}</Typography>
                  <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.6 }}>{feature.description}</Typography>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, px: 2, background: 'linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(66,165,245,0.05) 100%)', textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50' }}>Hemen Rezervasyon Yapın</Typography>
        <Typography variant="body1" sx={{ maxWidth: '600px', mx: 'auto', mb: 4, color: '#555', fontSize: '1.1rem' }}>
          Zaman kaybetmeden hemen rezervasyonunuzu yapın ve planlarınızı garanti altına alın.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            px: 6,
            py: 1.5,
            fontWeight: "bold",
            background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            color: "white",
            boxShadow: "0px 4px 15px rgba(25,118,210,0.3)",
            transition: "all 0.3s ease",
            borderRadius: '50px',
            "&:hover": { transform: "translateY(-3px)", boxShadow: "0px 8px 25px rgba(25,118,210,0.4)", background: "linear-gradient(45deg, #1565c0, #1976d2)" },
          }}
          onClick={handleClick}
        >
          Hemen Başla
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ background: "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)", color: "white", py: 4, textAlign: "center", boxShadow: "0 -4px 20px rgba(0,0,0,0.15)" }}>
        <Typography sx={{ fontWeight: 300 }}>© 2025 Rezervasyon Sistemi. Tüm hakları saklıdır.</Typography>
      </Box>
    </Box>
  );
}
