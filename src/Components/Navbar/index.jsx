// components/common/Navbar.jsx
'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Tooltip,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Fade,
  Stack,
  Chip,
  Paper,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Article,
  Category,
  Comment,
  Dashboard,
  Person,
  Logout,
  Login,
  AppRegistration,
  DarkMode,
  LightMode,
  Search,
  Notifications,
  Settings,
  AdminPanelSettings,
  KeyboardArrowDown,
  Close,
  AutoAwesome,
  Stars,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ColorModeContext } from '../../App';
import Users from '../../Pages/Users';

// استایل‌های سفارشی
const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  position: 'sticky',
  elevation: scrolled ? 4 : 0,
  backgroundColor: scrolled 
    ? theme.palette.mode === 'dark' 
      ? 'rgba(18, 18, 18, 0.92)' 
      : 'rgba(255, 255, 255, 0.92)'
    : theme.palette.mode === 'dark'
      ? 'rgba(18, 18, 18, 0.98)'
      : 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderBottom: scrolled 
    ? 'none' 
    : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(102, 126, 234, 0.08)'}`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: scrolled 
    ? `0 4px 30px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0, 0, 0, 0.08)'}` 
    : 'none',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.5rem',
  letterSpacing: '-0.5px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  backgroundSize: '200% 200%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'gradientShift 4s ease-in-out infinite',
  '@keyframes gradientShift': {
    '0%, 100%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
  },
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.3s ease',
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  color: active ? '#667eea' : theme.palette.text.secondary,
  fontWeight: active ? 600 : 500,
  position: 'relative',
  borderRadius: '12px',
  padding: '8px 20px',
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 4,
    left: '50%',
    transform: active ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
    width: '30%',
    height: 3,
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: 4,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '&:hover': {
    color: '#667eea',
    backgroundColor: alpha('#667eea', theme.palette.mode === 'dark' ? 0.15 : 0.06),
    transform: 'translateY(-1px)',
    '&::before': {
      transform: 'translateX(-50%) scaleX(1)',
    },
  },
  '& .MuiButton-startIcon': {
    marginRight: 8,
  },
}));

const AdminButton = styled(Button)(({ theme, active }) => ({
  color: '#ff9800',
  fontWeight: active ? 600 : 500,
  backgroundColor: active ? alpha('#ff9800', 0.12) : 'transparent',
  borderRadius: '12px',
  padding: '8px 20px',
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: alpha('#ff9800', 0.15),
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 15px rgba(255, 152, 0, 0.2)',
  },
  '& .MuiButton-startIcon': {
    marginRight: 8,
  },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: 8,
  borderRadius: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    color: '#667eea',
    backgroundColor: alpha('#667eea', theme.palette.mode === 'dark' ? 0.15 : 0.08),
    transform: 'scale(1.05)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 38,
  height: 38,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'scale(1.08)',
    borderColor: '#667eea',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: '12px',
  margin: '4px 8px',
  padding: '10px 16px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha('#667eea', theme.palette.mode === 'dark' ? 0.15 : 0.06),
    transform: 'translateX(4px)',
  },
}));

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const colorMode = useContext(ColorModeContext);
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setLoggedIn(true);
        setAdmin(parsedUser.role === 'admin');
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
    handleCloseUserMenu();
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser(null);
    setAdmin(false);
    handleCloseUserMenu();
    navigate('/');
  };

  const toggleDarkMode = () => {
    colorMode.toggleColorMode();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { text: 'کاربران', icon:<Category />, path: '/users' },
    { text: 'دسته‌بندی‌ها', icon: <Category />, path: '/categories' },
    { text: 'پست‌ها', icon: <Article />, path: '/posts' },
    { text: 'خانه', icon: <Home />, path: '/home' },
  ];

  const adminMenuItems = [
    { text: 'داشبورد', icon: <Dashboard />, path: '/admin' },
    { text: 'مدیریت پست‌ها', icon: <Article />, path: '/admin/posts' },
    { text: 'مدیریت دسته‌بندی‌ها', icon: <Category />, path: '/admin/categories' },
    { text: 'مدیریت کامنت‌ها', icon: <Comment />, path: '/admin/comments' },
    { text: 'مدیریت کاربران', icon: <Person />, path: '/admin/users' },
  ];

  const userMenuItems = [
    { text: 'پروفایل', icon: <Person />, path: '/profile' },
    { text: 'تنظیمات', icon: <Settings />, path: '/settings' },
  ];

  const isDark = theme.palette.mode === 'dark';

  const drawerList = () => (
    <Box sx={{ width: 300 }} role="presentation">
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            وبلاگ من
          </Typography>
          {loggedIn && user && (
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
              خوش آمدی، {user.username}
            </Typography>
          )}
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text}
            onClick={() => handleNavigate(item.path)}
            sx={{ 
              cursor: 'pointer',
              borderRadius: 2,
              mb: 0.5,
              bgcolor: isActivePath(item.path) ? alpha('#667eea', 0.08) : 'transparent',
              '&:hover': { 
                bgcolor: alpha('#667eea', 0.06),
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease',
              },
              '& .MuiListItemIcon-root': {
                color: isActivePath(item.path) ? '#667eea' : 'inherit',
                minWidth: 40,
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: isActivePath(item.path) ? 600 : 400,
                  color: isActivePath(item.path) ? '#667eea' : 'inherit',
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      
      {admin && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 1.5 }}>
            <Chip 
              label="بخش مدیریت" 
              size="medium"
              icon={<AdminPanelSettings />}
              sx={{ 
                bgcolor: alpha('#ff9800', 0.1),
                color: '#ff9800',
                fontWeight: 600,
                width: '100%',
                justifyContent: 'flex-start',
                borderRadius: 2,
                '& .MuiChip-icon': { color: '#ff9800' }
              }}
            />
          </Box>
          <List sx={{ px: 1 }}>
            {adminMenuItems.map((item) => (
              <ListItem 
                key={item.text}
                onClick={() => handleNavigate(item.path)}
                sx={{ 
                  pl: 4, 
                  cursor: 'pointer',
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: isActivePath(item.path) ? alpha('#667eea', 0.08) : 'transparent',
                  '&:hover': { 
                    bgcolor: alpha('#667eea', 0.06),
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActivePath(item.path) ? '#667eea' : 'inherit',
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isActivePath(item.path) ? 600 : 400,
                      color: isActivePath(item.path) ? '#667eea' : 'inherit',
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {loggedIn && (
        <>
          <Divider />
          <List sx={{ px: 1 }}>
            {userMenuItems.map((item) => (
              <ListItem 
                key={item.text}
                onClick={() => handleNavigate(item.path)}
                sx={{ 
                  cursor: 'pointer',
                  borderRadius: 2,
                  mb: 0.5,
                  '&:hover': { 
                    bgcolor: alpha('#667eea', 0.06),
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem 
              onClick={handleLogout} 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 2,
                '&:hover': { 
                  bgcolor: alpha('#f44336', 0.08),
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}><Logout sx={{ color: '#f44336' }} /></ListItemIcon>
              <ListItemText primary="خروج" sx={{ color: '#f44336' }} />
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <StyledAppBar position="sticky" scrolled={scrolled}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 72, display: 'flex', alignItems: 'center' , gap: 1}}>
          
          {/* ===== بخش چپ: دکمه همبرگری (فقط موبایل) ===== */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
            {isMobile && (
              <ActionIconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </ActionIconButton>
            )}
          </Box>
          {loggedIn ? (
              <>
                <Tooltip title="حساب کاربری" arrow>
                  <StyledAvatar onClick={handleOpenUserMenu}>
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </StyledAvatar>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  TransitionComponent={Fade}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: 3,
                      minWidth: 240,
                      boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                    }
                  }}
                >
                  <Box sx={{ 
                    p: 2.5, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {user?.username}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>
                      {user?.role === 'admin' ? 'مدیر سیستم' : 'کاربر'}
                    </Typography>
                    {user?.role === 'admin' && (
                      <Chip 
                        label="ادمین" 
                        size="small"
                        sx={{ 
                          mt: 1,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 600,
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </Box>
                  <Divider />
                  <StyledMenuItem onClick={() => handleNavigate('/profile')}>
                    <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                    پروفایل
                  </StyledMenuItem>
                  <StyledMenuItem onClick={() => handleNavigate('/settings')}>
                    <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                    تنظیمات
                  </StyledMenuItem>
                  {admin && (
                    <StyledMenuItem onClick={() => handleNavigate('/admin')}>
                      <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                      داشبورد
                    </StyledMenuItem>
                  )}
                  <Divider />
                  <StyledMenuItem onClick={handleLogout} sx={{ color: '#f44336' }}>
                    <ListItemIcon><Logout fontSize="small" sx={{ color: '#f44336' }} /></ListItemIcon>
                    خروج
                  </StyledMenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1} sx={{ ml: 1 }}>
                <Button 
                  onClick={() => handleNavigate('/login')} 
                  variant="outlined" 
                  size="small"
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    borderColor: '#667eea',
                    color: '#667eea',
                    px: 2.5,
                    py: 0.8,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#764ba2',
                      bgcolor: alpha('#667eea', 0.05),
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  ورود
                </Button>
                <Button 
                  onClick={() => handleNavigate('/register')} 
                  variant="contained" 
                  size="small"
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 2.5,
                    py: 0.8,
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  ثبت‌نام
                </Button>
              </Stack>
            )}
            <ActionIconButton onClick={handleOpenNotifications}>
              <Badge 
                badgeContent={3} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    minWidth: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f44336, #e91e63)',
                  }
                }}
              >
                <Notifications />
              </Badge>
            </ActionIconButton>
            
            <ActionIconButton onClick={toggleDarkMode}>
              {isDark ? <LightMode /> : <DarkMode />}
            </ActionIconButton>
            
            <ActionIconButton onClick={() => handleNavigate('/search')}>
              <Search />
            </ActionIconButton>

            {/*  */}


          {/* ===== بخش وسط: منو (فقط دسکتاپ) ===== */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              flex: 1, 
              justifyContent: 'center' 
            }}>
              {admin && (
                <AdminButton
                  onClick={() => handleNavigate('/admin')}
                  startIcon={<AdminPanelSettings />}
                  active={isActivePath('/admin') ? 1 : 0}
                >
                  مدیریت
                </AdminButton>
              )}
              {menuItems.map((item) => (
                <NavButton
                  key={item.text}
                  onClick={() => handleNavigate(item.path)}
                  startIcon={item.icon}
                  active={isActivePath(item.path) ? 1 : 0}
                >
                  {item.text}
                </NavButton>
              ))}
            </Box>
          )}

          {/* ===== بخش راست: لوگو + آیکون‌ها + پروفایل ===== */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
            

            

            
            <LogoText onClick={() => handleNavigate('/')}>
              <Article sx={{ 
                ml: 1, 
                color: '#667eea', 
                WebkitTextFillColor: '#667eea',
                fontSize: isMobile ? '1.3rem' : '1.8rem',
              }} />
              وبلاگ من
              {!isMobile && (
                <AutoAwesome sx={{ 
                  ml: 0.5, 
                  fontSize: '0.9rem',
                  color: '#764ba2',
                  WebkitTextFillColor: '#764ba2',
                  opacity: 0.6,
                }} />
              )}
            </LogoText>
          </Box>
        </Toolbar>
      </Container>

      {/* ===== دراور - از سمت چپ باز میشه ===== */}
      <Drawer 
        anchor="left"
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
            boxShadow: '4px 0 30px rgba(0,0,0,0.08)',
          }
        }}
      >
        {drawerList()}
      </Drawer>

      <Menu
        anchorEl={anchorElNotifications}
        open={Boolean(anchorElNotifications)}
        onClose={handleCloseNotifications}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 3,
            minWidth: 300,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{ 
          px: 2.5, 
          py: 2, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="subtitle1" fontWeight={700}>اعلان‌ها</Typography>
          <Chip 
            label="۳ جدید" 
            size="small"
            color="primary"
            sx={{ borderRadius: 1, fontWeight: 600 }}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            هیچ اعلان جدیدی وجود ندارد
          </Typography>
        </Box>
      </Menu>
    </StyledAppBar>
  );
}