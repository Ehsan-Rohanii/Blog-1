import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  FormControlLabel,
  Switch,
  Stack,
  useTheme,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Article as ArticleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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
  
  '& input, & textarea': {
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
  
  '& textarea': {
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit',
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

// استایل برای بخش تصاویر
const ImageCard = styled(Paper)(({ theme }) => ({
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  width: '100%',
}));

// استایل برای Select سفارشی
const StyledSelect = styled(Select)(({ theme, error }) => ({
  width: '100%',
  borderRadius: '8px',
  textAlign: 'right',
  '& .MuiSelect-select': {
    padding: '14px 14px',
    textAlign: 'right',
    color: theme.palette.text.primary,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? '#f44336' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'),
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? '#f44336' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : '#667eea'),
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#667eea',
  },
  '& .MuiSelect-icon': {
    right: 'auto',
    left: '14px',
  },
}));

// استایل برای MenuItem
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  textAlign: 'right',
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.08)',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.1)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(102,126,234,0.25)' : 'rgba(102,126,234,0.15)',
    },
  },
}));

export default function CreatePost() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    categoryId: "",
    isPublished: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    description: false,
  });

  // لیست دسته‌بندی‌ها
  const categories = [
    { id: "6a49fb9b828f9c04c93f8a83", name: "برنامه‌نویسی وب" },
    { id: "6a49fb9b828f9c04c93f8a84", name: "طراحی گرافیک" },
    { id: "6a49fb9b828f9c04c93f8a85", name: "هوش مصنوعی" },
    { id: "6a49fb9b828f9c04c93f8a86", name: "امنیت سایبری" },
    { id: "6a49fb9b828f9c04c93f8a87", name: "داده‌کاوی" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: false,
      });
    }
  };

  const handleCategoryChange = (event) => {
    setFormData({
      ...formData,
      categoryId: event.target.value,
    });
  };

  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      isPublished: e.target.checked,
    });
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      try {
        new URL(imageInput.trim());
        setFormData({
          ...formData,
          images: [...formData.images, imageInput.trim()],
        });
        setImageInput("");
        setError("");
      } catch {
        setError("آدرس تصویر نامعتبر است");
      }
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { title: false, description: false };

    if (!formData.title.trim()) {
      errors.title = true;
      isValid = false;
    }

    if (!formData.description.trim() || formData.description.trim().length < 20) {
      errors.description = true;
      isValid = false;
      setError("توضیحات باید حداقل 20 کاراکتر باشد");
      return false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("لطفاً وارد حساب کاربری خود شوید");
      }

      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          images: formData.images,
          categoryId: formData.categoryId || undefined,
          isPublished: formData.isPublished,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در ایجاد پست");
      }

      setSuccess("پست با موفقیت ایجاد شد");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      setError(err.message);
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, direction: 'rtl' }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link 
          color="inherit" 
          onClick={() => navigate("/home")}
          sx={{ cursor: "pointer" }}
        >
          خانه
        </Link>
        <Link 
          color="inherit" 
          onClick={() => navigate("/home")}
          sx={{ cursor: "pointer" }}
        >
          پست‌ها
        </Link>
        <Typography color="text.primary">ایجاد پست جدید</Typography>
      </Breadcrumbs>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <ArticleIcon sx={{ fontSize: 32, color: "#667eea" }} />
          <Typography variant="h5" component="h1" fontWeight="bold">
            ایجاد پست جدید
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* عنوان */}
          <StyledInputWrapper error={fieldErrors.title}>
            <label className="label-text">عنوان</label>
            <div className="input-container">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="عنوان پست را وارد کنید"
                required
                disabled={loading}
                minLength={3}
              />
            </div>
            {fieldErrors.title && (
              <div className="helper-text">لطفاً عنوان را وارد کنید</div>
            )}
          </StyledInputWrapper>

          {/* توضیحات */}
          <StyledInputWrapper error={fieldErrors.description}>
            <label className="label-text">توضیحات</label>
            <div className="input-container">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="توضیحات پست را وارد کنید (حداقل 20 کاراکتر)"
                required
                disabled={loading}
                minLength={20}
              />
            </div>
            <div className="helper-text">
              {formData.description.length || 0} / 20 کاراکتر
              {fieldErrors.description && " - حداقل 20  کاراکتر"}
            </div>
          </StyledInputWrapper>

          {/* دسته‌بندی - کشویی */}
          <Box sx={{ mb: 2 }}>
            <label className="label-text" style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: 500, 
              color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary',
              marginBottom: '6px',
              textAlign: 'right',
              paddingRight: '4px',
            }}>
              دسته‌بندی
            </label>
            <FormControl fullWidth>
              <StyledSelect
                value={formData.categoryId}
                onChange={handleCategoryChange}
                displayEmpty
                disabled={loading}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>انتخاب دسته‌بندی</span>;
                  }
                  const category = categories.find(c => c.id === selected);
                  return category ? category.name : selected;
                }}
              >
                <StyledMenuItem value="">
                  <em>بدون دسته‌بندی</em>
                </StyledMenuItem>
                {categories.map((category) => (
                  <StyledMenuItem key={category.id} value={category.id}>
                    {category.name}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </Box>

          {/* بخش تصاویر - فقط ورودی آدرس */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              تصاویر
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <StyledInputWrapper sx={{ mb: 0, flex: 1 }}>
                <div className="input-container">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="آدرس تصویر را وارد کنید (مثال: https://example.com/image.jpg)"
                    disabled={loading}
                  />
                </div>
              </StyledInputWrapper>
              <Button
                variant="contained"
                onClick={handleAddImage}
                disabled={loading || !imageInput.trim()}
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  minWidth: '100px',
                  m: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  },
                }}
              >
                افزودن
              </Button>
            </Stack>
            
            {/* نمایش تصاویر اضافه شده */}
            {formData.images.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {formData.images.map((img, index) => (
                  <ImageCard key={index}>
                    <img
                      src={img}
                      alt={`تصویر ${index + 1}`}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        flex: 1, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: isDark ? 'rgba(255,255,255,0.7)' : 'inherit',
                        fontSize: '0.75rem',
                      }}
                    >
                      {img.length > 50 ? img.substring(0, 50) + '...' : img}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveImage(index)}
                      disabled={loading}
                      startIcon={<DeleteIcon />}
                    >
                      حذف
                    </Button>
                  </ImageCard>
                ))}
              </Box>
            )}
          </Box>

          {/* وضعیت انتشار */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublished}
                onChange={handleSwitchChange}
                color="primary"
                disabled={loading}
              />
            }
            label={formData.isPublished ? "منتشر شده" : "پیش‌نویس"}
            sx={{ mb: 2, display: 'block' }}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{
                gap: 1,
                py: 1.2,
                // px: 4,
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                },
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {loading ? "در حال ایجاد..." : "ایجاد پست"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/home")}
              disabled={loading}
              endIcon={<ArrowBackIcon />}
              sx={{
                gap: 2,
                py: 1.2,
                px: 2,
                borderRadius: 3,
                borderColor: "#667eea",
                color: "#667eea",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#764ba2",
                  backgroundColor: "rgba(102, 126, 234, 0.05)",
                },
              }}
            >
              انصراف
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}