import React from 'react';
import ReactDOM from 'react-dom/client';
import { SuspenseWrapper } from '@/component';
import { ReduxStoreWrapper } from '@/redux';
import { AppRouter } from '@/router';
import { AppInitiator } from '@/router/app-initiator';
import { MuiThemeSupplier } from '@/util/mui-theme-supplier';
import { SnackbarWrapper } from '@/util/snackbar-wrapper.tsx';

const rootElement = document.getElementById('app-mount') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <MuiThemeSupplier>
      <SnackbarWrapper>
        <SuspenseWrapper>
          <ReduxStoreWrapper>
            <AppInitiator />
            <AppRouter />
          </ReduxStoreWrapper>
        </SuspenseWrapper>
      </SnackbarWrapper>
    </MuiThemeSupplier>
  </React.StrictMode>
);
