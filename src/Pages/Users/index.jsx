import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Snackbar,
  Stack,
  useTheme,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// استایل برای سلول‌های جدول
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'right',
  padding: '12px 16px',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(102,126,234,0.05)' : 'rgba(102,126,234,0.04)',
  },
}));

// استایل برای Input با label بالایی
const StyledInputWrapper = styled(Box)(({ theme, error }) => ({
  marginBottom: '20px',
  width: '100%',
  
  '& .label-text': {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: error ? '#f44336' : theme.palette.text.secondary,
    marginBottom: '6px',
    textAlign: 'right',
    paddingRight: '4px',
    transition: 'all 0.2s ease',
  },
  
  '& .input-container': {
    position: 'relative',
    width: '100%',
  },
  
  '& input, & select': {
    width: '100%',
    padding: '14px 14px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: `1px solid ${error ? '#f44336' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)')}`,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    color: theme.palette.text.primary,
    textAlign: 'right',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    appearance: 'none',
    
    '&::placeholder': {
      color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
      textAlign: 'right',
      fontSize: '0.9rem',
    },
    
    '&:hover': {
      borderColor: error ? '#f44336' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : '#667eea'),
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
    },
    
    '&:focus': {
      borderColor: error ? '#f44336' : '#667eea',
      boxShadow: error 
        ? '0 0 0 2px rgba(244, 67, 54, 0.2)' 
        : '0 0 0 2px rgba(102, 126, 234, 0.2)',
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.02)',
    },
    
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  
  '& select': {
    paddingLeft: '40px',
    cursor: 'pointer',
    '& option': {
      textAlign: 'right',
    },
  },
  
  '& .select-arrow': {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.text.secondary,
    pointerEvents: 'none',
    fontSize: '1.2rem',
  },
  
  '& .helper-text': {
    marginTop: '4px',
    fontSize: '0.75rem',
    color: error ? '#f44336' : theme.palette.text.secondary,
    textAlign: 'right',
    paddingRight: '4px',
    transition: 'all 0.2s ease',
  },
}));

export default function Users() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  
  // دیالوگ ویرایش
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
  });
  
  // دیالوگ تایید حذف
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // اسنک‌بار
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // دریافت لیست کاربران
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`خطا: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Users response:", data);
      
      if (data.success && data.data) {
        setUsers(Array.isArray(data.data) ? data.data : []);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "خطا در دریافت کاربران");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // بررسی نقش کاربر فعلی
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsAdmin(user?.role === "admin");
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  // باز کردن دیالوگ ویرایش
  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setEditUsername(user.username || "");
    setEditRole(user.role || "user");
    setFieldErrors({ username: false });
    setEditDialogOpen(true);
  };

  // بستن دیالوگ ویرایش
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
    setEditUsername("");
    setEditRole("");
    setFieldErrors({ username: false });
  };

  // ویرایش کاربر
  const handleEditUser = async () => {
    if (!editUsername.trim()) {
      setFieldErrors({ username: true });
      setSnackbar({
        open: true,
        message: "لطفاً نام کاربری را وارد کنید",
        severity: "warning"
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editUsername.trim(),
          role: editRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در ویرایش کاربر");
      }

      setSnackbar({
        open: true,
        message: "کاربر با موفقیت ویرایش شد",
        severity: "success"
      });

      handleCloseEditDialog();
      fetchUsers();
    } catch (err) {
      console.error("Error editing user:", err);
      setSnackbar({
        open: true,
        message: err.message || "خطا در ویرایش کاربر",
        severity: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // باز کردن دیالوگ تایید حذف
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // بستن دیالوگ تایید حذف
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // حذف کاربر
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${userToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در حذف کاربر");
      }

      setSnackbar({
        open: true,
        message: "کاربر با موفقیت حذف شد",
        severity: "success"
      });

      handleCloseDeleteDialog();
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setSnackbar({
        open: true,
        message: err.message || "خطا در حذف کاربر",
        severity: "error"
      });
    }
  };

  // تغییر وضعیت بلاک/آنبلاک کاربر
  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${userId}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isBlocked: !currentStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در تغییر وضعیت کاربر");
      }

      setSnackbar({
        open: true,
        message: currentStatus ? "کاربر آنبلاک شد" : "کاربر بلاک شد",
        severity: "success"
      });

      fetchUsers();
    } catch (err) {
      console.error("Error toggling block:", err);
      setSnackbar({
        open: true,
        message: err.message || "خطا در تغییر وضعیت کاربر",
        severity: "error"
      });
    }
  };

  // بستن اسنک‌بار
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // فقط ادمین‌ها دسترسی دارند
  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <BlockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" color="error.main" gutterBottom>
            دسترسی غیرمجاز
          </Typography>
          <Typography variant="body2" color="text.secondary">
            شما دسترسی به این صفحه را ندارید.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/home')}
            sx={{ mt: 2 }}
          >
            بازگشت به خانه
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, direction: 'rtl' }}>
      {/* هدر */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PersonIcon sx={{ fontSize: 32, color: '#667eea' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            مدیریت کاربران
          </Typography>
          <Chip 
            label={`${users.length} کاربر`}
            color="primary"
            variant="filled"
            size="small"
          />
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchUsers}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          بروزرسانی
        </Button>
      </Box>

      {/* خطا */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* جدول کاربران */}
      {users.length === 0 ? (
        <Paper 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            borderRadius: 3,
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa',
          }}
        >
          <PersonIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            هیچ کاربری وجود ندارد
          </Typography>
        </Paper>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(102,126,234,0.1)' : '#f0f2f5' }}>
                <StyledTableCell sx={{ fontWeight: 600, pr:4 }}>کاربر</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 600, pr:4 }}>نقش</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 600, pr:4 }}>وضعیت</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 600, pr:2.5 }}>تاریخ ثبت</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 600, pr:5 }}>عملیات</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <StyledTableRow key={user._id}>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#667eea', width: 36, height: 36 }}>
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="500">
                          {user.username || 'بدون نام'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email || user._id}
                        </Typography>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  
                  <StyledTableCell>
                    <Chip
                      label={user.role === 'admin' ? 'مدیر' : 'کاربر'}
                      size="small"
                      color={user.role === 'admin' ? 'secondary' : 'primary'}
                      icon={user.role === 'admin' ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                      sx={{ fontWeight: 500, padding:1 }}
                    />
                  </StyledTableCell>
                  
                  <StyledTableCell>
                    <Chip
                      label={user.isBlocked ? 'بلاک شده' : 'فعال'}
                      size="small"
                      color={user.isBlocked ? 'error' : 'success'}
                      icon={user.isBlocked ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                      sx={{padding:1}}
                    />
                  </StyledTableCell>
                  
                  <StyledTableCell>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '-'}
                  </StyledTableCell>
                  
                  <StyledTableCell sx={{ textAlign: 'center', padding: '8px 16px' }}>
                    <Stack 
                      direction="row" 
                      spacing={0.5} 
                      justifyContent="center" 
                      alignItems="center"
                      sx={{ minHeight: '40px' }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                        sx={{ 
                          color: user.isBlocked ? 'success.main' : 'warning.main',
                          '&:hover': {
                            backgroundColor: user.isBlocked ? 'rgba(76,175,80,0.1)' : 'rgba(255,152,0,0.1)',
                          }
                        }}
                      >
                        {user.isBlocked ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(user)}
                        sx={{ 
                          color: '#ff9800',
                          '&:hover': { backgroundColor: 'rgba(255,152,0,0.1)' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog(user)}
                        sx={{ 
                          color: '#f44336',
                          '&:hover': { backgroundColor: 'rgba(244,67,54,0.1)' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ===== دیالوگ ویرایش کاربر با input معمولی ===== */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            direction: 'rtl',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'right' }}>
          ویرایش کاربر
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            {/* نام کاربری - input معمولی */}
            <StyledInputWrapper error={fieldErrors.username}>
              <label className="label-text">نام کاربری</label>
              <div className="input-container">
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => {
                    setEditUsername(e.target.value);
                    if (fieldErrors.username) {
                      setFieldErrors({ username: false });
                    }
                  }}
                  placeholder="نام کاربری را وارد کنید"
                  disabled={submitting}
                />
              </div>
              {fieldErrors.username && (
                <div className="helper-text">لطفاً نام کاربری را وارد کنید</div>
              )}
            </StyledInputWrapper>

            {/* نقش کاربر - select معمولی */}
            <StyledInputWrapper>
              <label className="label-text">نقش کاربر</label>
              <div className="input-container">
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  disabled={submitting}
                >
                  <option value="user">کاربر</option>
                  <option value="admin">مدیر</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </StyledInputWrapper>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleCloseEditDialog} disabled={submitting}>
            انصراف
          </Button>
          <Button
            onClick={handleEditUser}
            variant="contained"
            disabled={submitting}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'ویرایش'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== دیالوگ تایید حذف ===== */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        sx={{
          '& .MuiDialog-paper': {
            direction: 'rtl',
            textAlign: 'right',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          حذف کاربر
        </DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف کاربر <strong>"{userToDelete?.username}"</strong> مطمئن هستید؟
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            این عمل قابل بازگشت نیست.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleCloseDeleteDialog}>انصراف</Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error" 
            variant="contained"
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== اسنک‌بار ===== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', direction: 'rtl' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}