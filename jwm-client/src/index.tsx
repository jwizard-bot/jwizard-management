import React from 'react';
import ReactDOM from 'react-dom/client';
import { SuspenseWrapper } from '@/component';
import { ReduxStoreWrapper } from '@/redux';
import { AppInitiator } from '@/router/app-initiator';
import { AppRouter } from '@/router/app-router';
import { MuiThemeSupplier } from '@/util/mui-theme-supplier';

const rootElement = document.getElementById('app-mount') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <MuiThemeSupplier>
      <SuspenseWrapper>
        <ReduxStoreWrapper>
          <AppInitiator />
          <AppRouter />
        </ReduxStoreWrapper>
      </SuspenseWrapper>
    </MuiThemeSupplier>
  </React.StrictMode>
);
