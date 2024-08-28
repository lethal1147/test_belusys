import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Router } from "./routes";
import { ConfigProvider } from "antd";
import { INPUT_PLACEHOLDER_COLOR, PRIMARY_COLOR, PRIMARY_TEXT } from "./config";
import { ApolloAppProvider } from "./contexts";

function App() {
  return (
    <ApolloAppProvider>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorBorderBg: PRIMARY_COLOR,
              colorPrimary: PRIMARY_COLOR,
              colorBgBase: PRIMARY_COLOR,
              defaultBg: PRIMARY_COLOR,
            },
            Input: {
              colorTextPlaceholder: INPUT_PLACEHOLDER_COLOR,
              hoverBorderColor: PRIMARY_COLOR,
              colorPrimary: PRIMARY_COLOR,
              colorText: PRIMARY_TEXT,
            },
            Select: {
              colorPrimary: PRIMARY_COLOR,
              colorBorderBg: PRIMARY_COLOR,
            },
          },
        }}
      >
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ConfigProvider>
    </ApolloAppProvider>
  );
}

export default App;
