import { useState, useEffect } from "react";
import axios from "axios";
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Typography,Box,CircularProgress,TablePagination,Chip,Avatar,Alert,Menu,MenuItem,} from "@mui/material";
import {EventAvailableRounded,PersonRounded,CalendarMonthRounded,AccessTimeRounded,SearchOffRounded,} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
}));

export default function ReservationsByDatePaginated() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [stats, setStats] = useState({ totalReservations: 0, totalDates: 0 });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedResvId, setSelectedResvId] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:3000/reservation/all-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(data);
        const totalReservations = data.length;
        const totalDates = new Set(
          data.map((r) => new Date(r.date).toLocaleDateString("tr-TR"))
        ).size;
        setStats({ totalReservations, totalDates });
      } catch (error) {
        setErrorMsg("Rezervasyonlar alınamadı. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const getStatusText = (resv) => {
    if (!resv.status) return "Aktif";

    const status = resv.status.toLowerCase();
    if (status === "iptal" || status === "cancelled" || status === "canceled") return "iptal";
    if (status === "tamamlandı") return "Tamamlandı";

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

  const handleMenuOpen = (event, resvId) => {
    setAnchorEl(event.currentTarget);
    setSelectedResvId(resvId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedResvId(null);
  };

  const handleChangeStatus = async (newStatus) => {
    if (!selectedResvId) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        
        `http://localhost:3000/reservation/${selectedResvId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations((prev) =>
        prev.map((r) => (r._id === selectedResvId ? data : r))
      );
    } catch (err) {
      console.error(err);
    } finally {
      handleMenuClose();
    }
  };

  const groupedReservations = reservations.reduce((acc, r) => {
    const dateKey = new Date(r.date).toLocaleDateString("tr-TR");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(r);
    return acc;
  }, {});

  const dates = Object.keys(groupedReservations).sort(
    (a, b) =>
      new Date(b.split(".").reverse().join("-")) - new Date(a.split(".").reverse().join("-"))
  );

  const paginatedDates = dates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 10 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Rezervasyonlar yükleniyor...</Typography>
      </Box>
    );

  if (errorMsg)
    return <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>{errorMsg}</Alert>;

  return (
    <Box sx={{ mt: 8, p: 3 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Tüm Rezervasyonlar
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
          <Box sx={{ p: 2, minWidth: 120, border: "1px solid #ddd", borderRadius: 3 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">{stats.totalReservations}</Typography>
            <Typography variant="body2">Toplam Rezervasyon</Typography>
          </Box>
          <Box sx={{ p: 2, minWidth: 120, border: "1px solid #ddd", borderRadius: 3 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">{stats.totalDates}</Typography>
            <Typography variant="body2">Toplam Gün</Typography>
          </Box>
        </Box>
      </Box>

      {dates.length > 0 ? paginatedDates.map(date => (
        <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }} key={date}>
          <Box sx={{ p: 2, backgroundColor: alpha("#1976d2", 0.1), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold"><CalendarMonthRounded sx={{ mr: 1 }} />{date}</Typography>
            <Chip label={`${groupedReservations[date].length} rezervasyon`} />
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kullanıcı</TableCell>
                <TableCell>Saat</TableCell>
                <TableCell>Not</TableCell>
                <TableCell>Durum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedReservations[date].map(resv => (
                <StyledTableRow key={resv._id || resv.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ mr: 1 }}><PersonRounded fontSize="small" /></Avatar>
                      <Box>
                        <Typography variant="subtitle2">{resv.userId ? `${resv.userId.name} ${resv.userId.surname}` : "Bilinmeyen Kullanıcı"}</Typography>
                        <Typography variant="body2" color="text.secondary">{resv.userId?.email || ""}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Chip icon={<AccessTimeRounded />} label={resv.time || "-"} size="small" /></TableCell>
                  <TableCell>{resv.note || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(resv)}
                      color={getStatusColor(resv)}
                      size="small"
                      onClick={(e) => handleMenuOpen(e, resv._id)}
                      clickable
                    />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )) : (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <SearchOffRounded sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Henüz rezervasyon bulunmuyor</Typography>
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleChangeStatus("Aktif")}>Aktif</MenuItem>
        <MenuItem onClick={() => handleChangeStatus("iptal")}>İptal</MenuItem>
        <MenuItem onClick={() => handleChangeStatus("Tamamlandı")}>Tamamlandı</MenuItem>
      </Menu>

      {dates.length > 0 && (
        <TablePagination
          component="div"
          count={dates.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[1,7,14,31]}
          labelRowsPerPage="Sayfa başına gün:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count} gün`}
        />
      )}
    </Box>
  );
}
