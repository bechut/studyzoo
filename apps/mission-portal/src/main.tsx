import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Routers from './app/routers';
import { store } from "@react-helpers";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";

console.log(store.getState())

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#3b4366",
          },
          components: {
            Layout: {
              colorBgHeader: "#292f4c", // colorBgBase -3% lightness, i've pre-calculated these values manually, but it'd be smart to use color.js or something like that to manage these manipulations
            },
            Menu: {
              // if you use "dark" theme on menu
              colorItemBg: "#292f4c", // colorBgBase -3% lightness
              colorSubItemBg: "#00b96b", // colorBgBase -6% lightness
            },
          },
        }}
      >
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
