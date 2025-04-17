import React from 'react';
import ReactDOM from 'react-dom/client';
import { SnackbarWrapper } from '@/component';
import { SuspenseWrapper } from '@/component/suspense';
import { ReduxStoreWrapper } from '@/redux';
import { AppInitiator, AppRouter } from '@/router';
import { MuiThemeSupplier } from '@/util/mui-theme-supplier';

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
