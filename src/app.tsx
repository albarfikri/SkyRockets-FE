/* eslint-disable react-hooks/exhaustive-deps */
import 'src/global.css';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Fab from '@mui/material/Fab';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';

import auth from './stores/auth';
import products from './stores/product';
import { authService } from './services/authService';
import { getLocalStorage } from './utils/local-storage';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  const navigate = useNavigate();
  const { setUserData } = auth();
  const { setSelectedCompany } = products();

  useEffect(() => {
    if (getLocalStorage() !== '') refetchUserData();
  }, [])

  const refetchUserData = () => {
    authService.getUser().then(res => {
      const response = res?.data as any;
      setUserData(response);
      setSelectedCompany(response?.config_account[0])
      navigate('/dashboard');
    });
  }

  const githubButton = (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/minimal-ui-kit/material-kit-react"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'common.white',
      }}
    >
      <Iconify width={24} icon="eva:github-fill" />
    </Fab>
  );

  return (
    <ThemeProvider>
      <Router />
      {githubButton}
      <ToastContainer />
    </ThemeProvider>
  );
}
