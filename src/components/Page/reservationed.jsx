import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  IconButton,
  Fade,
} from "@mui/material";
import { Refresh, Event, Schedule, Notes } from "@mui/icons-material";
import axios from "axios";

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:3000/reservation/user",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setReservations(sortedData);
    } catch (error) {
      console.error(error);
      setErrorMsg("Rezervasyonlar alınamadı. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
    
 const getStatusText = (resv) => {
  if (resv.status === "iptal") return "iptal";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const resDate = new Date(resv.date);
  resDate.setHours(0, 0, 0, 0);

  if (resDate < today) return "Tamamlandı";

  return "Aktif";
};


  const getStatusColor = (resv) => {
    const status = getStatusText(resv);
    switch (status) {
      case "Aktif":
        return "primary";
      case "iptal":
        return "error";
      case "Tamamlandı":
        return "default";
      default:
        return "default";
    }
  };


 
  return (
    <Box
      sx={{
        mt: 12,
        display: "flex",
        justifyContent: "center",
        mb: 5,
        minHeight: "60vh",
        px: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          sx={{
            width: "100%",
            maxWidth: "1200px",
            p: 4,
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
            border: "1px solid rgba(25, 118, 210, 0.1)",
          }}
        >
          {/* Başlık */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="#1976d2">
              Rezervasyonlarım
            </Typography>
            <IconButton
              onClick={fetchReservations}
              disabled={loading}
              sx={{
                backgroundColor: "rgba(25,118,210,0.1)",
                "&:hover": { backgroundColor: "rgba(25,118,210,0.2)" },
              }}
            >
              <Refresh sx={{ color: "#1976d2" }} />
            </IconButton>
          </Box>

          {/* Yükleniyor */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                py: 8,
                gap: 2,
              }}
            >
              <CircularProgress size={60} thickness={4} />
              <Typography color="text.secondary">
                Rezervasyonlar yükleniyor...
              </Typography>
            </Box>
          ) : errorMsg ? (
            /* Hata mesajı */
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                py: 6,
                gap: 2,
              }}
            >
              <Typography variant="h6" color="error" textAlign="center">
                {errorMsg}
              </Typography>
              <Chip
                icon={<Refresh />}
                label="Tekrar Dene"
                onClick={fetchReservations}
                variant="outlined"
                color="primary"
                clickable
              />
            </Box>
          ) : reservations.length === 0 ? (
            /* Boş liste */
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                py: 8,
                gap: 2,
              }}
            >
              <Event
                sx={{ fontSize: 60, color: "text.secondary", opacity: 0.5 }}
              />
              <Typography
                variant="h6"
                textAlign="center"
                color="text.secondary"
              >
                Henüz bir rezervasyonunuz bulunmuyor.
              </Typography>
              <Typography textAlign="center" color="text.secondary">
                Yeni rezervasyon yapmak için ana sayfaya dönebilirsiniz.
              </Typography>
            </Box>
          ) : (
            /* Tablo */
            <TableContainer
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
                mt: 2,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "rgba(25,118,210,0.08)",
                      "& th": {
                        fontWeight: "bold",
                        py: 2,
                        fontSize: "1rem",
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Event fontSize="small" />
                        Tarih
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Schedule fontSize="small" />
                        Saat
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Notes fontSize="small" />
                        Not
                      </Box>
                    </TableCell>
                    <TableCell align="center">Durum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservations.map((resv) => (
                    <TableRow
                      key={resv._id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(25,118,210,0.03)",
                        },
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      {/* Tarih */}
                      <TableCell sx={{ fontWeight: "500", py: 2 }}>
                        {formatDate(resv.date)}
                      </TableCell>

                      {/* Saat */}
                      <TableCell sx={{ py: 2 }}>{resv.time || "-"}</TableCell>

                      {/* Not */}
                      <TableCell sx={{ py: 2, maxWidth: 300 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {resv.note || "-"}
                        </Typography>
                      </TableCell>

                      {/* Durum */}
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Chip
                          label={getStatusText(resv)}
                          color={getStatusColor(resv)}
                          variant="filled"
                          size="medium"
                        />

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Fade>
    </Box>
  );
}
