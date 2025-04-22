import { enqueueSnackbar } from 'notistack';
import { createListenerMiddleware, isRejectedWithValue } from '@reduxjs/toolkit';

const listenerMiddleware = createListenerMiddleware();

const errorMessages: Record<string, string> = {
  // typical
  BAD_REQUEST: 'Bad request.',
  UNAUTHORIZED: 'Following request required authentication.',
  FORBIDDEN: 'You don not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  INTERNAL_SERVER_ERROR: 'Unknown server error.',
  // custom
  INCORRECT_USERNAME_AND_OR_PASSWORD: 'Incorrect username and/or password.',
  UNABLE_TO_VERIFY_CF_TOKEN: 'Unable to verify Captcha challenge.',
  INCORRECT_OR_EXPIRED_MFA_TOKEN: 'Incorrect or expired MFA token.',
  INCORRECT_OR_EXPIRED_OTA_TOKEN: 'Incorrect or expired OTA token.',
  INCORRECT_RECOVERY_CODE: 'Incorrect recovery code.',
  UNABLE_TO_CHANGE_DEFAULT_PASSWORD: 'Unable to change default password.',
  UNABLE_TO_UPDATE_ACCOUNT_PASSWORD: 'Unable to update account password.',
  UNABLE_TO_UPDATE_FORGOT_PASSWORD: 'Unable to update forgot password.',
  SESSION_BASED_ID_NOT_FOUND: 'Session based passed ID not found.',
} as const;

listenerMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: async action => {
    const error = action.payload as {
      data: {
        key: string;
      };
    };
    if (!error) {
      return; // skip if no error
    }
    let keyMessage = 'INTERNAL_SERVER_ERROR';
    if ('data' in error && 'key' in error.data) {
      // if error is defined by backend
      if (Object.keys(errorMessages).includes(error.data.key)) {
        keyMessage = error.data.key;
      }
    }
    enqueueSnackbar({ message: errorMessages[keyMessage], variant: 'error' });
  },
});

export { listenerMiddleware };
