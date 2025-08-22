import { useState, useEffect } from "react";
import {
  Container, Box, Paper, Grid, TextField, Button, Typography,
  Card, CardContent, Stepper, Step, StepLabel, Alert, Fade,
} from "@mui/material";
import {
  Today as TodayIcon, Schedule as ScheduleIcon, Notes as NotesIcon,
  CheckCircle as CheckCircleIcon, ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon, EventAvailable as EventAvailableIcon
} from "@mui/icons-material";
import axios from "axios";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const AVAILABLE_TIMES = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export default function Reservation() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    if (date) fetchBookedTimes(date);
  }, [date]);

  const fetchBookedTimes = async (selectedDate) => {
    try {
      const token = localStorage.getItem("token");
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/reservation/all?date=${formattedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookedTimes(data);
    } catch (error) {
      console.error("Rezervasyon bilgileri alınamadı:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/reservation`,
        { date, time, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg("Rezervasyon başarıyla oluşturuldu!");
      setActiveStep(5); // Başarı adımı
      setDate("");
      setTime("");
      setNote("");
      setBookedTimes([]);
    } catch (error) {
      console.error(error);
      setErrorMsg("Rezervasyon oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleDateSelect = (day) => {
    setSelectedDate(day);
    const formatted = format(day, "yyyy-MM-dd");
    setDate(formatted);
    setTime("");
    fetchBookedTimes(formatted);
    handleNext();
  };

  const today = new Date();

  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 17; i++) days.push(addDays(today, i));
    return days;
  };

  const isTimeDisabled = (time) => bookedTimes.includes(time);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <EventAvailableIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>Rezervasyon Yap</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Randevu oluşturmak için başlat butonuna tıklayın.
            </Typography>
            <Button
              variant="contained" size="large"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Başlat
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <TodayIcon sx={{ mr: 1 }} /> Tarih Seçin
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {generateWeekDays().map((day, index) => (
                <Grid item xs={4} sm={3} key={index}>
                  <Card
                    onClick={() => handleDateSelect(day)}
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      py: 2,
                      backgroundColor: isSameDay(day, selectedDate) ? "primary.light" : "background.paper",
                      color: isSameDay(day, selectedDate) ? "primary.contrastText" : "text.primary",
                      "&:hover": { backgroundColor: isSameDay(day, selectedDate) ? "primary.light" : "action.hover" },
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                      <Typography variant="body2" fontWeight="bold">{format(day, "EEE", { locale: tr })}</Typography>
                      <Typography variant="h6">{format(day, "d")}</Typography>
                      <Typography variant="caption">{format(day, "MMM", { locale: tr })}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <ScheduleIcon sx={{ mr: 1 }} /> Saat Seçin
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Seçilen Tarih: {format(parseISO(date), "dd MMMM yyyy", { locale: tr })}
            </Typography>
            <Grid container spacing={1}>
              {AVAILABLE_TIMES.map((t) => (
                <Grid item xs={6} sm={4} key={t}>
                  <Card
                    onClick={() => !isTimeDisabled(t) && setTime(t)}
                    sx={{
                      cursor: isTimeDisabled(t) ? "default" : "pointer",
                      textAlign: "center",
                      py: 1,
                      backgroundColor: time === t ? "primary.main" : isTimeDisabled(t) ? "action.disabledBackground" : "background.paper",
                      color: time === t ? "primary.contrastText" : isTimeDisabled(t) ? "text.disabled" : "text.primary",
                      "&:hover": isTimeDisabled(t) ? {} : { backgroundColor: time === t ? "primary.main" : "action.hover" },
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                      <Typography variant="body1" fontWeight="bold">{t}</Typography>
                      {isTimeDisabled(t) && <Typography variant="caption" display="block">Dolu</Typography>}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <NotesIcon sx={{ mr: 1 }} /> Not Ekleyin (İsteğe Bağlı)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Rezervasyonunuzla ilgili eklemek istediğiniz notlar..."
              sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>
        );
      case 4:
        return (
          <Box sx={{ textAlign: "center" }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>Rezervasyon Özeti</Typography>
            <Box sx={{ p: 2, backgroundColor: "grey.50", borderRadius: 2, mb: 2 }}>
              <Typography><strong>Tarih:</strong> {format(parseISO(date), "dd MMMM yyyy", { locale: tr })}</Typography>
              <Typography><strong>Saat:</strong> {time}</Typography>
              {note && <Typography><strong>Not:</strong> {note}</Typography>}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Rezervasyonu tamamlamak için onaylayın.
            </Typography>
          </Box>
        );
      case 5:
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>Rezervasyon Başarıyla Oluşturuldu!</Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, borderRadius: 2 }}
              onClick={() => setActiveStep(0)}
            >
              Yeni Rezervasyon Yap
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 2, borderRadius: 2 }}
              onClick={() => navigate("/reservationed")}
            >
              Rezervasyonlarımı Görüntüle
            </Button>
          </Box>
        );
      default:
        return "Bilinmeyen adım";
    }
  };

  const steps = ["Hoşgeldiniz", "Tarih Seçimi", "Saat Seçimi", "Not Ekleme", "Onay", "Başarılı"];

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 8 }}>
      <Paper
        elevation={10}
        sx={{
          width: "100%", p: 4, borderRadius: 4,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          backgroundColor: "rgba(255,255,255,0.98)"
        }}
      >
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label} completed={activeStep > steps.indexOf(label)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Fade in timeout={500}>
          <Box>
            <form onSubmit={handleSubmit}>
              {getStepContent(activeStep)}

              <Box sx={{ display: "flex", flexDirection: "row", pt: 3, gap: 1 }}>
                {activeStep !== 5 && (
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Geri
                  </Button>
                )}

                <Box sx={{ flex: "1 1 auto" }} />

                {activeStep < 4 && (
                  <Button
                    onClick={handleNext}
                    disabled={(activeStep === 1 && !date) || (activeStep === 2 && !time)}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    İleri
                  </Button>
                )}

                {activeStep === 4 && (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    endIcon={<CheckCircleIcon />}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    {loading ? "İşleniyor..." : "Rezervasyon Yap"}
                  </Button>
                )}
              </Box>
            </form>
          </Box>
        </Fade>
        {successMsg && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{errorMsg}</Alert>}
      </Paper>
    </Container>
  );
}