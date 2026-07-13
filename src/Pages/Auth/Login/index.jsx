import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";

// استایل برای Input با label بالایی
const StyledInputWrapper = styled(Box)(({ theme, error }) => ({
  marginBottom: '16px',
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
    paddingRight: '48px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: `1px solid ${error ? '#f44336' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)')}`,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    color: theme.palette.text.primary,
    textAlign: 'right',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    
    '&::placeholder': {
      color: 'transparent',
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
  
  '& .icon-wrapper': {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: error ? '#f44336' : '#667eea',
    pointerEvents: 'none',
    transition: 'all 0.2s ease',
  },
  
  '& .end-icon-wrapper': {
    position: 'absolute',
    left: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await result.json();
      console.log(data);
      if (!result.ok) {
        throw new Error(data.message || "Error throw");
      }
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      console.log(data);
      navigate("/home");
    } catch (err) {
      setError(err.message);
      console.log("Error : ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // اعتبارسنجی ساده برای خطاهای فیلد
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false,
  });

  const validateForm = () => {
    let isValid = true;
    const errors = { username: false, password: false };

    if (!username.trim()) {
      errors.username = true;
      isValid = false;
    }

    if (!password) {
      errors.password = true;
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmitWithValidation = (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      setError("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    handleSubmit(e);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark 
          ? "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 2,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            background: isDark
              ? "rgba(30, 30, 60, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "none",
          }}
        >
          {/* دکوریشن بالا */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            }}
          />

          {/* لوگو یا آیکون */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
              mt: 0.5,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
              }}
            >
              <LoginIcon sx={{ fontSize: 30, color: "white" }} />
            </Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.8rem",
              }}
            >
              خوش آمدید
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                fontSize: "0.85rem",
                color: isDark ? "rgba(255,255,255,0.7)" : "text.secondary",
              }}
            >
              برای ادامه وارد حساب کاربری خود شوید
            </Typography>
          </Box>

          {/* فرم */}
          <form onSubmit={handleSubmitWithValidation}>
            {/* نام کاربری */}
            <StyledInputWrapper error={fieldErrors.username}>
              <label className="label-text">نام کاربری</label>
              <div className="input-container">
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) {
                      setFieldErrors({ ...fieldErrors, username: false });
                    }
                  }}
                  placeholder=" "
                  required
                  disabled={loading}
                />
                <div className="icon-wrapper">
                  <PersonIcon sx={{ fontSize: 20 }} />
                </div>
              </div>
              {fieldErrors.username && (
                <div className="helper-text">لطفاً نام کاربری را وارد کنید</div>
              )}
            </StyledInputWrapper>

            {/* رمز عبور */}
            <StyledInputWrapper error={fieldErrors.password}>
              <label className="label-text">رمز عبور</label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors({ ...fieldErrors, password: false });
                    }
                  }}
                  placeholder=" "
                  required
                  disabled={loading}
                />
                <div className="icon-wrapper">
                  <LockIcon sx={{ fontSize: 20 }} />
                </div>
                <div className="end-icon-wrapper">
                  <IconButton
                    onClick={handleTogglePassword}
                    size="small"
                    sx={{
                      color: isDark ? "rgba(255,255,255,0.7)" : "inherit",
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </div>
              </div>
              {fieldErrors.password && (
                <div className="helper-text">لطفاً رمز عبور را وارد کنید</div>
              )}
            </StyledInputWrapper>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#667eea",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                  fontSize: "0.75rem",
                }}
              >
                رمز عبور را فراموش کرده‌اید؟
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{ 
                  mb: 2, 
                  borderRadius: 2, 
                  fontSize: "0.85rem", 
                  py: 0.5,
                  bgcolor: isDark ? "rgba(244, 67, 54, 0.15)" : undefined,
                  color: isDark ? "#ff6b6b" : undefined,
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.2,
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd6 0%, #6a3f8f 100%)",
                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                },
                "&:disabled": {
                  background: "#b0b0b0",
                },
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "white" }} />
              ) : (
                "ورود به حساب"
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  color: isDark ? "rgba(255,255,255,0.5)" : "text.secondary",
                }}
              >
                یا
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/register")}
              disabled={loading}
              startIcon={<RegisterIcon />}
              sx={{
                py: 1.2,
                borderRadius: 3,
                borderColor: "#667eea",
                color: "#667eea",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#764ba2",
                  backgroundColor: "rgba(102, 126, 234, 0.05)",
                },
              }}
            >
              ثبت‌نام
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{
                mt: 1.5,
                fontSize: "0.85rem",
                color: isDark ? "rgba(255,255,255,0.7)" : "text.secondary",
              }}
            >
              حساب کاربری ندارید؟{" "}
              <Typography
                component="span"
                sx={{
                  color: "#667eea",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/register")}
              >
                ثبت‌نام کنید
              </Typography>
            </Typography>
          </form>

          {/* فوتر */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.7rem",
                color: isDark ? "rgba(255,255,255,0.4)" : "text.secondary",
              }}
            >
              © {new Date().getFullYear()} وبلاگ من. تمامی حقوق محفوظ است.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}