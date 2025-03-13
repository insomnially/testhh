import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import PortfolioOverview from "./components/PortfolioOverview";
import "./styles.scss";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="container">
        <PortfolioOverview />
      </div>
    </Provider>
  );
};

export default App;
