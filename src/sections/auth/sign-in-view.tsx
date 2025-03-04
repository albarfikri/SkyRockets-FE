/* eslint-disable import/no-extraneous-dependencies */
import type { LoginPayload } from 'src/services/agent/types';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState, useTransition } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { setLocalStorage } from 'src/utils/local-storage';

import auth from 'src/stores/auth';
import products from 'src/stores/product';
import { configuration } from 'src/constants';
import { authPage as strings } from 'src/strings';
import { authService } from 'src/services/authService';

import { Iconify } from 'src/components/iconify';


export function SignInView() {
  const navigate = useNavigate();

  const { setUserData } = auth();
  const { setSelectedCompany } = products();

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const [isPending, startTransition] = useTransition();

  const { email, password } = data;

  const handleLogin = () => {
    if (!email || !password) {
      toast.info(`Field ${!email ? 'Email' : ''} ${!password ? 'Password' : ''} cannot be blank`);
    } else {
      startTransition(() => {
        hitLoginApi();
      })
    }
  };

  const hitLoginApi = async () => {
    const payload: LoginPayload = { email, password };

    authService.login(payload).then(res =>  {
      const { data: { accessToken } } = res;
      // Save token
      toast.success(strings.successLogin);
      setLocalStorage(configuration.localStorage, accessToken);
    }).then(() => {
      authService.getUser().then(res => {
        const response = res?.data as any;
        setUserData(response);
        setSelectedCompany(response?.config_account[0])
        navigate('/dashboard');
      });
    }).catch((err) => {
        // if failed remove token to prevent double login
        authService.logout();
        toast.error(strings.failedLogin);
        console.log(err);
    });
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="email"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        value={email}
        onChange={handleChange}
      />

      {/* <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link> */}

      <TextField
        fullWidth
        name="password"
        label="Password"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        value={password}
        sx={{ mb: 3 }}
        onChange={handleChange}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleLogin}
        disabled={isPending}
      >
        Sign in
      </LoadingButton>

      <Typography variant="body2" color="text.secondary" style={{ marginTop: '2%' }}>
        Don’t have an account??
        <Link variant="subtitle2" sx={{ ml: 0.5 }}>
          Sign Up
        </Link>
      </Typography>
    </Box>
  );

  return (
    <>
     <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
      </Box>

      {renderForm}


      {/* <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box> */}
    </>
  );
}
