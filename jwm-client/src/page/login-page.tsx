import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import logo from '@/assets/logo.svg';
import { config } from '@/config';
import { useLoginMutation } from '@/redux/api/slice/auth-api-slice';
import { LoginReqDto } from '@/redux/api/type/auth-api';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

const LoginPage: React.FC = (): React.ReactElement => {
  const [login, { data }] = useLoginMutation();
  const captchaRef = useRef<TurnstileInstance | undefined>(undefined);
  const {
    control,
    register,
    setValue,
    setError,
    clearErrors,
    resetField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginReqDto>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<LoginReqDto> = async data => {
    await login(data);
  };

  const handleCaptchaVerify = (token: string): void => {
    setValue('cfToken', token);
    clearErrors('cfToken');
  };

  useEffect(() => {
    if (data && !data.authenticated) {
      resetField('password');
    }
  }, [data]);

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 400,
        p: 1,
      }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <img src={logo} alt="" width={70} />
          <Typography variant="h5" component="h1" fontWeight="medium" align="center" mb={3}>
            JWizard Management Panel
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          gap={2}
          display="flex"
          flexDirection="column">
          <Controller
            name="login"
            control={control}
            rules={{ required: 'Login is required' }}
            render={({ field: { value, onChange }, fieldState: { error }, formState }) => (
              <TextField
                {...formState}
                fullWidth
                size="small"
                label="Login"
                variant="outlined"
                error={!!error}
                value={value || ''}
                onChange={onChange}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field: { value, onChange }, fieldState: { error }, formState }) => (
              <TextField
                {...formState}
                fullWidth
                type={showPassword ? 'text' : 'password'}
                size="small"
                label="Password"
                variant="outlined"
                error={!!error}
                value={value || ''}
                onChange={onChange}
                helperText={error?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(prevState => !prevState)}
                          onMouseDown={e => e.preventDefault()}
                          onMouseUp={e => e.preventDefault()}
                          edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
          <Box display="flex" flexDirection="column" gap={1}>
            <Turnstile
              ref={captchaRef}
              siteKey={config.cfCaptchaSiteKey}
              options={{
                theme: 'dark',
                size: 'flexible',
              }}
              onSuccess={handleCaptchaVerify}
              onError={() => setError('cfToken', { message: 'Unable to verify Captcha.' })}
            />
            {errors.cfToken && (
              <Typography color="error" variant="caption" sx={{ pl: 2 }}>
                {errors.cfToken.message}
              </Typography>
            )}
            <input
              type="hidden"
              {...register('cfToken', { required: 'Verification is required' })}
            />
          </Box>
          <Button variant="contained" fullWidth type="submit" loading={isSubmitting}>
            Log in
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
