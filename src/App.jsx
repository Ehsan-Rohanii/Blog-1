// App.jsx
import React, { useState, useMemo, createContext } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import router from './Routes';

// ✅ صادر کردن Context برای استفاده در سایر کامپوننت‌ها
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function App() {
  const [mode, setMode] = useState(() => {
    // خواندن وضعیت تم از localStorage (اختیاری)
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode); // ذخیره در localStorage
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: { main: '#667eea' },
                background: { default: '#f5f7fa', paper: '#ffffff' },
                text: { primary: '#1a1a2e', secondary: '#4a4a6a' },
              }
            : {
                primary: { main: '#667eea' },
                background: { default: '#121212', paper: '#1e1e1e' },
                text: { primary: '#ffffff', secondary: '#b0b0b0' },
              }),
        },
        direction: 'rtl',
        typography: {
          fontFamily: '"Vazir", "Roboto", "Arial", sans-serif',
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' 
                  ? 'rgba(255, 255, 255, 0.95)' 
                  : 'rgba(18, 18, 18, 0.95)',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
