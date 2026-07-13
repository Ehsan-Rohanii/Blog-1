// Pages/Home/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Stack,
  Avatar,
  TextField,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ArrowBack as ArrowBackIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  Reply as ReplyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [user, setUser] = useState(null);
  
  // State های کامنت
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // دریافت اطلاعات کاربر
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  // تابع بررسی وضعیت لایک کاربر
  const checkUserLikeStatus = async (postId, userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like-status`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        return data.isLiked || false;
      }
      return false;
    } catch (error) {
      console.error("Error checking like status:", error);
      return false;
    }
  };

  // دریافت اطلاعات پست
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`http://localhost:5000/api/posts/${id}`);
        
        if (!res.ok) {
          throw new Error("پست مورد نظر یافت نشد");
        }
        
        const data = await res.json();
        console.log("Full response:", data);
        
        if (data.success && data.data && data.data.length > 0) {
          const postData = data.data[0];
          setPost(postData);
          setLikeCount(postData.likeCount || 0);
          
          // بررسی لایک کاربر از likeUserIds
          if (user && postData.likeUserIds) {
            const hasLiked = postData.likeUserIds.includes(user._id);
            setIsLiked(hasLiked);
          } else if (user) {
            // اگر likeUserIds در پاسخ نیست، از API جداگانه استفاده کنید
            const hasLiked = await checkUserLikeStatus(id, user._id);
            setIsLiked(hasLiked);
          } else {
            setIsLiked(false);
          }
        } else {
          setPost(null);
          setError("پست مورد نظر یافت نشد");
        }
        
      } catch (error) {
        console.log("Error fetching product:", error.message);
        setError(error.message || "خطا در دریافت اطلاعات");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, user]);

  // دریافت کامنت‌های پست
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      
      try {
        setCommentsLoading(true);
        const res = await fetch(`http://localhost:5000/api/comments/${id}`);
        
        if (!res.ok) {
          throw new Error("خطا در دریافت کامنت‌ها");
        }
        
        const data = await res.json();
        console.log("Comments response:", data);
        
        if (data.success && data.data) {
          setComments(data.data);
        } else {
          setComments([]);
        }
        
      } catch (error) {
        console.log("Error fetching comments:", error.message);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  // ارسال کامنت جدید
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setSnackbar({
        open: true,
        message: "لطفاً متن کامنت را وارد کنید",
        severity: "warning"
      });
      return;
    }

    if (newComment.trim().length < 5) {
      setSnackbar({
        open: true,
        message: "متن کامنت باید حداقل ۵ کاراکتر باشد",
        severity: "warning"
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`http://localhost:5000/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
          postId: id,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setComments([data.data, ...comments]);
        setNewComment("");
        setSnackbar({
          open: true,
          message: "کامنت با موفقیت ارسال شد و در انتظار تایید است",
          severity: "success"
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || "خطا در ارسال کامنت",
          severity: "error"
        });
      }
      
    } catch (error) {
      console.log("Error submitting comment:", error);
      setSnackbar({
        open: true,
        message: "خطا در ارسال کامنت",
        severity: "error"
      });
    }
  };

  // ارسال پاسخ به کامنت
  const handleSubmitReply = async (commentId) => {
    if (!replyContent.trim()) {
      setSnackbar({
        open: true,
        message: "لطفاً متن پاسخ را وارد کنید",
        severity: "warning"
      });
      return;
    }

    if (replyContent.trim().length < 3) {
      setSnackbar({
        open: true,
        message: "متن پاسخ باید حداقل ۳ کاراکتر باشد",
        severity: "warning"
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`http://localhost:5000/api/comments/reply/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: replyContent,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        // به‌روزرسانی لیست کامنت‌ها با پاسخ جدید
        const updatedComments = comments.map(comment => {
          if (comment._id === commentId) {
            return data.data; // پاسخ جدید در replyIds قرار می‌گیرد
          }
          return comment;
        });
        setComments(updatedComments);
        setReplyContent("");
        setReplyTo(null);
        setSnackbar({
          open: true,
          message: "پاسخ با موفقیت ارسال شد و در انتظار تایید است",
          severity: "success"
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || "خطا در ارسال پاسخ",
          severity: "error"
        });
      }
      
    } catch (error) {
      console.log("Error submitting reply:", error);
      setSnackbar({
        open: true,
        message: "خطا در ارسال پاسخ",
        severity: "error"
      });
    }
  };

  // تابع لایک
  const handleLikePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbar({
          open: true,
          message: "لطفاً وارد حساب کاربری خود شوید",
          severity: "warning"
        });
        return;
      }
      
      const res = await fetch(`http://localhost:5000/api/posts/like/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.success) {
        // به‌روزرسانی تعداد لایک‌ها و وضعیت لایک
        setLikeCount(data.data);
        setIsLiked(!isLiked); // تغییر وضعیت لایک
        
        // همچنین پست رو هم به‌روزرسانی کنید
        setPost(prev => ({
          ...prev,
          likeCount: data.data
        }));
        
        setSnackbar({
          open: true,
          message: isLiked ? "لایک برداشته شد" : "لایک شد",
          severity: "success"
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || "خطا در انجام عملیات",
          severity: "error"
        });
      }
      
    } catch (error) {
      console.log("Error submitting like:", error);
      setSnackbar({
        open: true,
        message: "خطا در انجام عملیات",
        severity: "error"
      });
    }
  };

  // toggle نمایش پاسخ‌ها
  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error"
          action={
            <Button color="error" size="small" onClick={() => window.location.reload()}>
              تلاش مجدد
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          پست مورد نظر یافت نشد
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, direction: 'rtl' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/home')}
        sx={{ mb: 3 }}
      >
        بازگشت به پست‌ها
      </Button>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, mb: 4 }}>
        {/* عنوان و وضعیت */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            {post.title}
          </Typography>
          <Chip 
            label={post.isPublished ? "منتشر شده" : "پیش‌نویس"} 
            color={post.isPublished ? "success" : "warning"} 
            size="small"
          />
        </Box>

        {/* متا اطلاعات */}
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}
        >
          <Chip
            icon={<VisibilityIcon fontSize="small" />}
            label={`${post.views || 0} بازدید`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={isLiked ? <FavoriteIcon fontSize="small" sx={{ color: 'error.main' }} /> : <FavoriteBorderIcon fontSize="small" />}
            label={`${likeCount} لایک`}
            size="small"
            variant="outlined"
            sx={{ 
              '& .MuiChip-icon': { 
                color: isLiked ? 'error.main' : 'inherit' 
              },
              ...(isLiked && {
                borderColor: 'error.main',
                color: 'error.main',
              })
            }}
          />
          <Chip
            icon={<CommentIcon fontSize="small" />}
            label={`${comments.filter(c => c.isPublished).length} کامنت`}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* توضیحات */}
        {post.description && (
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              lineHeight: 1.8,
              textAlign: 'right',
            }}
          >
            {post.description}
          </Typography>
        )}

        {/* محتوا */}
        {post.content && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              lineHeight: 1.8,
              textAlign: 'right',
              mt: 2,
            }}
          >
            {post.content}
          </Typography>
        )}

        {/* دکمه‌های پایین */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            onClick={handleLikePost}
            variant="contained"
            endIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            sx={{
              gap: 1,
              pr: '30px',
              borderRadius: 2,
              background: isLiked 
                ? 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              }
            }}
          >
            {isLiked ? 'لایک شد' : 'لایک کنید'}
          </Button>
          <Button
            variant="outlined"
            endIcon={<ArrowBackIcon />}
            onClick={() => navigate('/home')}
            sx={{ borderRadius: 1, gap: 1, pr: '30px' }}
          >
            بازگشت
          </Button>
        </Box>
      </Paper>

      {/* ==================== بخش کامنت‌ها ==================== */}
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          کامنت‌ها ({comments.filter(c => c.isPublished).length})
        </Typography>

        {/* فرم ارسال کامنت */}
        <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="نظر خود را بنویسید (حداقل ۵ کاراکتر)..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              }
            }}
          >
            ارسال کامنت
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* لیست کامنت‌ها */}
        {commentsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : comments.filter(c => c.isPublished).length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              هنوز کامنتی برای این پست ثبت نشده است.
            </Typography>
            <Typography color="text.secondary" variant="body2">
              اولین نفری باشید که نظر می‌دهید!
            </Typography>
          </Box>
        ) : (
          comments.filter(c => c.isPublished).map((comment) => (
            <Card key={comment._id} sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardContent>
                {/* اطلاعات کاربر */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32 }}>
                    {comment.userId?.username?.[0] || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.userId?.username || 'کاربر ناشناس'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                    </Typography>
                  </Box>
                  {comment.role === 'admin' && (
                    <Chip 
                      label="مدیر" 
                      size="small" 
                      color="primary"
                      sx={{ mr: 'auto', fontSize: '0.6rem' }}
                    />
                  )}
                </Box>

                {/* متن کامنت */}
                <Typography variant="body2" sx={{ pr: 5, mb: 1.5 }}>
                  {comment.content}
                </Typography>

                {/* دکمه‌های کامنت */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<ReplyIcon />}
                    onClick={() => {
                      setReplyTo(replyTo === comment._id ? null : comment._id);
                      setReplyContent("");
                    }}
                  >
                    {replyTo === comment._id ? 'بستن' : 'پاسخ'}
                  </Button>
                  
                  {comment.replyIds && comment.replyIds.filter(r => r.isPublished).length > 0 && (
                    <Button
                      size="small"
                      startIcon={expandedReplies[comment._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      onClick={() => toggleReplies(comment._id)}
                    >
                      {expandedReplies[comment._id] 
                        ? 'بستن پاسخ‌ها' 
                        : `مشاهده ${comment.replyIds.filter(r => r.isPublished).length} پاسخ`
                      }
                    </Button>
                  )}
                </Box>

                {/* فرم پاسخ */}
                <Collapse in={replyTo === comment._id}>
                  <Box sx={{ mt: 2, pr: 4 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="پاسخ خود را بنویسید (حداقل ۳ کاراکتر)..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<SendIcon />}
                      onClick={() => handleSubmitReply(comment._id)}
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      ارسال پاسخ
                    </Button>
                  </Box>
                </Collapse>

                {/* لیست پاسخ‌ها */}
                <Collapse in={expandedReplies[comment._id]}>
                  <Box sx={{ mt: 2, pr: 4 }}>
                    <Divider sx={{ mb: 2 }} />
                    {comment.replyIds?.filter(r => r.isPublished).map((reply) => (
                      <Box key={reply._id} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <Avatar sx={{ bgcolor: '#764ba2', width: 28, height: 28 }}>
                            {reply.userId?.username?.[0] || 'R'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" fontSize="0.85rem">
                              {reply.userId?.username || 'کاربر ناشناس'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                              {new Date(reply.createdAt).toLocaleDateString('fa-IR')}
                            </Typography>
                          </Box>
                          {reply.role === 'admin' && (
                            <Chip 
                              label="مدیر" 
                              size="small" 
                              color="primary"
                              sx={{ mr: 'auto', fontSize: '0.5rem' }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ pr: 6, fontSize: '0.9rem' }}>
                          {reply.content}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))
        )}
      </Paper>

      {/* Snackbar برای پیام‌ها */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}