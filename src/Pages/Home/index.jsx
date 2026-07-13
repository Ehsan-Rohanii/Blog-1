import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Skeleton,
  Alert,
  AlertTitle,
  Stack,
  IconButton,
  Paper,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  useTheme,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  ArrowForward as ArrowForwardIcon,
  Image as ImageIcon,
  TrendingUp as TrendingIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    }
  },
  direction: 'rtl',
  textAlign: 'right',
}));

const MediaWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  height: 220,
  backgroundColor: theme.palette.mode === 'dark' ? '#2a2a3a' : theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  direction: 'rtl',
}));

const StyledCardMedia = styled(CardMedia)({
  transition: 'transform 0.5s ease-in-out',
  height: '100%',
  width: '100%',
  objectFit: 'cover'
});

const StatusChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  fontWeight: 'bold',
  boxShadow: theme.shadows[2],
  color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
}));

const PlaceholderIcon = styled(ImageIcon)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.mode === 'dark' ? '#888' : theme.palette.grey[400],
}));

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [numPage, setNumPage] = useState(1);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // منوی هر پست
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // دیالوگ حذف
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // اسنک‌بار
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // دریافت اطلاعات کاربر از localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAdmin(parsedUser?.role === "admin");
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await fetch(`http://localhost:5000/api/posts?page=${numPage}`);
        
        if (!result.ok) {
          throw new Error(`خطا: ${result.status}`);
        }
        
        const data = await result.json();
        setPosts(data.data || []);
        console.log("Posts loaded:", data.data);
        
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "خطا در دریافت اطلاعات");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [numPage]);

  const handlePostClick = (Id) => {
    navigate(`/post/${Id}`);
  };

  const goToPrevPage = () => {
    if (numPage > 1) {
      setNumPage(numPage - 1);
    }
  };

  const goToNextPage = () => {
    setNumPage(numPage + 1);
  };

  // ===== منوی هر پست =====
  const handleMenuOpen = (event, postId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  // ===== ویرایش پست =====
  const handleEditPost = (postId) => {
    handleMenuClose();
    navigate(`/update-post/${postId}`);
  };

  // ===== حذف پست =====
  const handleDeleteClick = (postId) => {
    handleMenuClose();
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/posts/${postToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در حذف پست");
      }

      setPosts(posts.filter((post) => post._id !== postToDelete));
      setSnackbar({
        open: true,
        message: "پست با موفقیت حذف شد",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "خطا در حذف پست",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, direction: 'rtl' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="text" width={200} height={50} />
          <Skeleton variant="rounded" width={80} height={40} />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Box key={item} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' } }}>
              <Card>
                <Skeleton variant="rectangular" height={220} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" width="60%" height={20} />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, direction: 'rtl' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 500, width: '100%' }}>
          <Alert 
            severity="error"
            action={
              <Button 
                color="error" 
                size="small" 
                onClick={() => window.location.reload()}
                variant="contained"
              >
                تلاش مجدد
              </Button>
            }
          >
            <AlertTitle>خطا در دریافت اطلاعات</AlertTitle>
            {error}
          </Alert>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, direction: 'rtl', textAlign: 'right' }}>
      {/* هدر */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2,
        direction: 'rtl',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            آخرین پست‌ها
          </Typography>
        </Box>
        
        {/* بخش راست هدر - تعداد پست‌ها و دکمه ایجاد */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={`${posts.length} پست`}
            color="primary"
            variant="filled"
            sx={{ fontWeight: 'bold' }}
          />
          
          {/* دکمه ایجاد پست جدید - فقط برای ادمین */}
          {isAdmin && (
            <Button
              variant="contained"
              endIcon={<EditIcon sx={{mr:1}}/>}
              onClick={() => navigate('/create-post')}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                pr: 4,
                py: 1,
                fontWeight: 600,
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              پست جدید
            </Button>
          )}
        </Box>
      </Box>

      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 12, bgcolor: 'grey.50', borderRadius: 4 }}>
          <ImageIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            هیچ پستی وجود ندارد
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              onClick={() => navigate('/admin/posts/create')}
              sx={{ mt: 2 }}
            >
              ایجاد پست جدید
            </Button>
          )}
        </Box>
      ) : (
        <>
          {/* لیست پست‌ها */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
              justifyContent: 'flex-start',
              mb: 4,
              direction: 'rtl',
            }}
          >
            {posts.map((post) => (
              <Box 
                key={post._id} 
                sx={{ 
                  width: { 
                    xs: '100%',
                    sm: 'calc(50% - 12px)',
                    md: 'calc(33.33% - 16px)'
                  },
                  flexShrink: 0,
                  position: 'relative',
                  direction: 'rtl',
                }}
              >
                <StyledCard onClick={() => handlePostClick(post._id)}>
                  <MediaWrapper>
                    {post.image ? (
                      <StyledCardMedia
                        component="img"
                        image={post.image}
                        alt={post.title}
                      />
                    ) : (
                      <Stack alignItems="center" spacing={1}>
                        <PlaceholderIcon />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: isDark ? '#ccc' : 'text.secondary',
                            opacity: 1,
                          }}
                        >
                          بدون تصویر
                        </Typography>
                      </Stack>
                    )}
                    <StatusChip label="جدید" size="small" color="primary" />
                    
                    {/* دکمه منوی مدیریت - فقط برای ادمین */}
                    {isAdmin && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, post._id)}
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
                          color: isDark ? '#fff' : '#000',
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,1)',
                          },
                          zIndex: 1,
                          '& .MuiSvgIcon-root': {
                            color: isDark ? '#fff' : '#000',
                          }
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    )}
                  </MediaWrapper>

                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3,
                        textAlign: 'right',
                      }}
                    >
                      {post.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2,
                        textAlign: 'right',
                      }}
                    >
                      {post.description || "توضیحی برای این پست وجود ندارد"}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2.5, pb: 2.5, pt: 0 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{gap:1}}>
                      <Chip
                        icon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                        label={post.views || 0}
                        size="small"
                        variant="outlined"
                        sx={{ pr:'10px'}}
                      />
                      <Chip
                        icon={<FavoriteIcon sx={{ fontSize: 16, color: 'error.main'}} />}
                        label={post.likeCount || 0}
                        size="small"
                        variant="outlined"
                        sx={{ '& .MuiChip-icon': { color: 'error.main'} , p:1}}
                      />
                    </Stack>
                    <IconButton size="small" color="primary">
                      {/* <ArrowIcon /> */}
                    </IconButton>
                  </CardActions>
                </StyledCard>
              </Box>
            ))}
          </Box>

          {/* دکمه‌های قبلی و بعدی */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 3,
            pt: 3,
            borderTop: '1px solid #e0e0e0',
            direction: 'rtl',
          }}>
            <Button 
              variant="contained" 
              onClick={goToNextPage}
            >
              بعدی
            </Button>
            <Typography variant="body1">
              صفحه {numPage}
            </Typography>
            <Button 
              variant="contained" 
              onClick={goToPrevPage}
              disabled={numPage === 1}
            >
              قبلی
            </Button>
          </Box>
        </>
      )}

      {/* منوی هر پست */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleEditPost(selectedPostId)}>
          <EditIcon fontSize="small" sx={{ ml: 1 }} />
          ویرایش
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedPostId)} sx={{ color: '#f44336' }}>
          <DeleteIcon fontSize="small" sx={{ ml: 1 }} />
          حذف
        </MenuItem>
      </Menu>

      {/* دیالوگ تأیید حذف */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            direction: 'rtl',
            textAlign: 'right',
          }
        }}
      >
        <DialogTitle id="delete-dialog-title">
          حذف پست
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            آیا از حذف این پست مطمئن هستید؟ این عمل قابل بازگشت نیست.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>انصراف</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* اسنک‌بار */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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
    </Box>
  );
}