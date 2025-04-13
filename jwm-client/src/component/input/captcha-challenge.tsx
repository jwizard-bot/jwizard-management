import * as React from 'react';
import { useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { config } from '@/config';
import { CfTokenProtected } from '@/redux/api/auth/type';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { Box, Typography } from '@mui/material';

const CaptchaChallenge: React.FC = (): React.ReactElement => {
  const { control, setError, setValue, clearErrors } = useFormContext<CfTokenProtected>();
  const captchaRef = useRef<TurnstileInstance | undefined>(undefined);
  const {
    fieldState: { error },
  } = useController({ name: 'cfToken', control });

  const handleCaptchaVerify = (token: string): void => {
    setValue('cfToken', token);
    clearErrors('cfToken');
  };

  return (
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
      {error && (
        <Typography color="error" variant="caption" sx={{ pl: 2 }}>
          {error.message}
        </Typography>
      )}
    </Box>
  );
};

export { CaptchaChallenge };
