import React, { useState, useEffect } from "react";
import axios from "axios";
import { DeleteRounded, EditRounded, EventRounded, ExpandMoreRounded, ExpandLessRounded, SearchOffRounded, PersonRounded } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Collapse, Typography, Chip, Avatar, Alert, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, LinearProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" },
}));

export default function Users({ query }) {
  const [users, setUsers] = useState([]);
  const [expandedUserIds, setExpandedUserIds] = useState([]);
  const [userReservations, setUserReservations] = useState({});
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", surname: "" });
  const [loadingReservations, setLoadingReservations] = useState({});

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  useEffect(() => setPage(0), [query]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const url = query
          ? `http://localhost:3000/users/search?q=${query}&page=${page}&limit=${rowsPerPage}`
          : `http://localhost:3000/users?page=${page}&limit=${rowsPerPage}`;
        const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setUsers(data.users);
        setTotal(data.total);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, [query, page, rowsPerPage]);

  const handleDelete = async (user) => {
    if (!window.confirm(`"${user.name} ${user.surname}" kullanıcısını silmek istediğinize emin misiniz?`)) return;
    try {
      await axios.delete(`http://localhost:3000/users/delete/${user.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setTotal(prev => prev - 1);
    } catch (err) { alert("Kullanıcı silinirken hata oluştu."); }
  };

  const openEditDialog = (user) => { setSelectedUser(user); setEditForm({ name: user.name, surname: user.surname }); setEditDialogOpen(true); };
  const closeEditDialog = () => { setEditDialogOpen(false); setSelectedUser(null); setEditForm({ name: "", surname: "" }); };
  const handleUpdate = async () => {
    if (!selectedUser || !editForm.name.trim() || !editForm.surname.trim()) return;
    try {
      const newData = { name: editForm.name.trim(), surname: editForm.surname.trim() };
      await axios.put(`http://localhost:3000/users/update/${selectedUser.id}`, newData, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setUsers(prev => prev.map(u => (u.id === selectedUser.id ? { ...u, ...newData } : u)));
      closeEditDialog();
    } catch { alert("Kullanıcı güncellenirken hata oluştu."); }
  };

  const toggleReservations = async (userId) => {
    if (expandedUserIds.includes(userId)) setExpandedUserIds(prev => prev.filter(id => id !== userId));
    else {
      setLoadingReservations(prev => ({ ...prev, [userId]: true }));
      try {
        const { data } = await axios.get(`http://localhost:3000/reservation/user/${userId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setUserReservations(prev => ({ ...prev, [userId]: data }));
        setExpandedUserIds(prev => [...prev, userId]);
      } catch { console.error("Rezervasyonlar alınamadı"); }
      finally { setLoadingReservations(prev => ({ ...prev, [userId]: false })); }
    }
  };

  return (
    <Box sx={{ mt: 8, p: 2 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Kullanıcı</TableCell>
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? users.map(user => (
              <React.Fragment key={user.id}>
                <StyledTableRow hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ mr: 1 }}><PersonRounded fontSize="small" /></Avatar>
                      <Typography>{user.name} {user.surname}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <IconButton onClick={() => toggleReservations(user.id)} size="small">
                        {expandedUserIds.includes(user.id) ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                        <EventRounded sx={{ ml: 0.5 }} />
                      </IconButton>
                      <IconButton onClick={() => openEditDialog(user)} size="small"><EditRounded /></IconButton>
                      <IconButton onClick={() => handleDelete(user)} size="small"><DeleteRounded /></IconButton>
                    </Box>
                  </TableCell>
                </StyledTableRow>

                <TableRow>
                  <TableCell colSpan={3} sx={{ p: 0, border: 0 }}>
                    <Collapse in={expandedUserIds.includes(user.id)} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2 }}>
                        {loadingReservations[user.id] ? <LinearProgress /> :
                          userReservations[user.id]?.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Tarih</TableCell>
                                  <TableCell>Saat</TableCell>
                                  <TableCell>Not</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {userReservations[user.id].map(resv => (
                                  <TableRow key={resv._id || resv.id}>
                                    <TableCell>{new Date(resv.date).toLocaleDateString("tr-TR")}</TableCell>
                                    <TableCell>{resv.time}</TableCell>
                                    <TableCell>{resv.note || "-"}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : <Alert severity="info" icon={<SearchOffRounded />}>Rezervasyon bulunamadı.</Alert>
                        }
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            )) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <SearchOffRounded sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                  <Typography>{query ? "Arama sonucu bulunamadı" : "Henüz kullanıcı yok"}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Kullanıcıyı Düzenle</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="İsim" fullWidth variant="outlined" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Soyisim" fullWidth variant="outlined" value={editForm.surname} onChange={e => setEditForm({ ...editForm, surname: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>İptal</Button>
          <Button onClick={handleUpdate} variant="contained">Güncelle</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
