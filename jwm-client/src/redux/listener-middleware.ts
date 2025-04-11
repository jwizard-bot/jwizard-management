import { createListenerMiddleware, isRejectedWithValue } from '@reduxjs/toolkit';

const listenerMiddleware = createListenerMiddleware();

const errorMessages: Record<number, string> = {
  400: 'Bad request.',
  401: 'Following request required authentication.',
  403: 'You don not have permission to perform this action.',
  404: 'Resource not found.',
  500: 'Unknown server error.',
};

listenerMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: async action => {
    const error = action.payload as {
      status: number;
    };
    if (!error || !('status' in error)) {
      return; // skip if no error
    }
    let errorMessage = errorMessages[500];
    if (error.status in errorMessages) {
      errorMessage = errorMessages[error.status];
    }
    console.log(errorMessage);
  },
});

export { listenerMiddleware };
