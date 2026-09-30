// Pages/Categories.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Stack,
  Chip,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Navbar from '../../../Components/Navbar';

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
  
  '& input': {
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
  
  '& .helper-text': {
    marginTop: '4px',
    fontSize: '0.75rem',
    color: error ? '#f44336' : theme.palette.text.secondary,
    textAlign: 'right',
    paddingRight: '4px',
    transition: 'all 0.2s ease',
  },
}));

// استایل برای آیتم دسته‌بندی
const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    borderColor: '#667eea',
  },
}));

export default function Categories() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State های دیالوگ
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState(false);
  
  // دیالوگ تایید حذف
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  // اسنک‌بار
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // دریافت لیست دسته‌بندی‌ها
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetch("http://localhost:5000/api/categories");
      
      if (!result.ok) {
        throw new Error("خطا در دریافت دسته‌بندی‌ها");
      }
      
      const data = await result.json();
      console.log("Categories response:", data);
      
      if (data.success && data.data) {
        setCategories(Array.isArray(data.data) ? data.data : []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message || "خطا در دریافت دسته‌بندی‌ها");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // باز کردن دیالوگ ایجاد
  const handleOpenCreateDialog = () => {
    setDialogMode('create');
    setSelectedCategory(null);
    setCategoryTitle("");
    setCategoryIcon("");
    setFieldError(false);
    setDialogOpen(true);
  };

  // باز کردن دیالوگ ویرایش
  const handleOpenEditDialog = (category) => {
    setDialogMode('edit');
    setSelectedCategory(category);
    setCategoryTitle(category.title || "");
    setCategoryIcon(category.icon || "");
    setFieldError(false);
    setDialogOpen(true);
  };

  // بستن دیالوگ
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCategoryTitle("");
    setCategoryIcon("");
    setSelectedCategory(null);
    setFieldError(false);
  };

  // ارسال فرم (ایجاد یا ویرایش)
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    
    if (!categoryTitle.trim()) {
      setFieldError(true);
      setSnackbar({
        open: true,
        message: "لطفاً عنوان دسته‌بندی را وارد کنید",
        severity: "warning"
      });
      return;
    }

    if (categoryTitle.trim().length < 3) {
      setFieldError(true);
      setSnackbar({
        open: true,
        message: "عنوان دسته‌بندی باید حداقل ۳ کاراکتر باشد",
        severity: "warning"
      });
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("لطفاً وارد حساب کاربری خود شوید");
      }

      const url = dialogMode === 'create' 
        ? "http://localhost:5000/api/categories"
        : `http://localhost:5000/api/categories/${selectedCategory._id}`;
      
      const method = dialogMode === 'create' ? "POST" : "PATCH";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: categoryTitle.trim(),
          icon: categoryIcon.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در ذخیره دسته‌بندی");
      }

      setSnackbar({
        open: true,
        message: dialogMode === 'create' 
          ? "دسته‌بندی با موفقیت ایجاد شد" 
          : "دسته‌بندی با موفقیت ویرایش شد",
        severity: "success"
      });

      handleCloseDialog();
      fetchCategories(); // بارگذاری مجدد لیست

    } catch (err) {
      console.error("Error submitting category:", err);
      setSnackbar({
        open: true,
        message: err.message || "خطا در ذخیره دسته‌بندی",
        severity: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // باز کردن دیالوگ تایید حذف
  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // بستن دیالوگ تایید حذف
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // حذف دسته‌بندی
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("لطفاً وارد حساب کاربری خود شوید");
      }

      const response = await fetch(`http://localhost:5000/api/categories/${categoryToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در حذف دسته‌بندی");
      }

      setSnackbar({
        open: true,
        message: "دسته‌بندی با موفقیت حذف شد",
        severity: "success"
      });

      handleCloseDeleteDialog();
      fetchCategories(); // بارگذاری مجدد لیست

    } catch (err) {
      console.error("Error deleting category:", err);
      setSnackbar({
        open: true,
        message: err.message || "خطا در حذف دسته‌بندی",
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
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    
    <Container maxWidth="md" sx={{ py: 4, direction: 'rtl' }}>
        
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
          <CategoryIcon sx={{ fontSize: 32, color: '#667eea' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            دسته‌بندی‌ها
          </Typography>
          <Chip 
            label={`${categories.length} دسته‌بندی`}
            color="primary"
            variant="filled"
            size="small"
          />
        </Box>
        
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{
            gap:1,
            borderRadius: 3,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            px: 3,
            py: 1,
            fontWeight: 600,
            '&:hover': {
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            },
          }}
        >
          ایجاد دسته‌بندی جدید
        </Button>
      </Box>

      {/* خطا */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* لیست دسته‌بندی‌ها */}
      {categories.length === 0 ? (
        <Paper 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            borderRadius: 3,
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa',
          }}
        >
          <CategoryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            هیچ دسته‌بندی وجود ندارد
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            اولین دسته‌بندی را ایجاد کنید
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {categories.map((category) => (
            <CategoryCard key={category._id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {category.icon ? (
                  <Box 
                    component="span" 
                    sx={{ fontSize: '1.5rem' }}
                  >
                    {category.icon}
                  </Box>
                ) : (
                  <CategoryIcon sx={{ color: '#667eea' }} />
                )}
                <Typography variant="body1" fontWeight="500">
                  {category.title}
                </Typography>
                <Chip 
                  label={`ID: ${category._id.substring(0, 8)}...`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.6rem', opacity: 0.6 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleOpenEditDialog(category)}
                  sx={{ color: '#ff9800' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDeleteDialog(category)}
                  sx={{ color: '#f44336' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </CategoryCard>
          ))}
        </Stack>
      )}

      {/* ===== دیالوگ ایجاد/ویرایش ===== */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            direction: 'rtl',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {dialogMode === 'create' ? 'ایجاد دسته‌بندی جدید' : 'ویرایش دسته‌بندی'}
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <form onSubmit={handleSubmitCategory}>
          <DialogContent>
            <StyledInputWrapper error={fieldError}>
              <label className="label-text">عنوان دسته‌بندی</label>
              <div className="input-container">
                <input
                  type="text"
                  value={categoryTitle}
                  onChange={(e) => {
                    setCategoryTitle(e.target.value);
                    setFieldError(false);
                  }}
                  placeholder="مثال: برنامه‌نویسی"
                  required
                  disabled={submitting}
                  minLength={3}
                />
              </div>
              {fieldError && (
                <div className="helper-text">لطفاً عنوان را وارد کنید (حداقل ۳ کاراکتر)</div>
              )}
            </StyledInputWrapper>

            <StyledInputWrapper>
              <label className="label-text">آیکون (اختیاری)</label>
              <div className="input-container">
                <input
                  type="text"
                  value={categoryIcon}
                  onChange={(e) => setCategoryIcon(e.target.value)}
                  placeholder="مثال: 🚀 یا 💻"
                  disabled={submitting}
                />
              </div>
              <div className="helper-text">می‌توانید از ایموجی یا متن استفاده کنید</div>
            </StyledInputWrapper>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button onClick={handleCloseDialog} disabled={submitting}>
              انصراف
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                dialogMode === 'create' ? 'ایجاد' : 'ویرایش'
              )}
            </Button>
          </DialogActions>
        </form>
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
          حذف دسته‌بندی
        </DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف دسته‌بندی <strong>"{categoryToDelete?.title}"</strong> مطمئن هستید؟
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            این عمل قابل بازگشت نیست.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleCloseDeleteDialog}>انصراف</Button>
          <Button 
            onClick={handleDeleteCategory} 
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
