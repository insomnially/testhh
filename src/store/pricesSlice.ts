import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Asset {
  id: string;
  name: string;
  quantity: number;
  price: number;
  change24h: number;
}

interface PortfolioState {
  assets: Asset[];
}

const loadAssetsFromStorage = () => {
  const data = localStorage.getItem("cryptoAssets");
  return data ? JSON.parse(data) : [];
};

const initialState: PortfolioState = {
  assets: loadAssetsFromStorage(),
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Asset>) => {
      state.assets.push(action.payload);
      localStorage.setItem("cryptoAssets", JSON.stringify(state.assets));
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter(asset => asset.id !== action.payload);
      localStorage.setItem("cryptoAssets", JSON.stringify(state.assets));
    }
  }
});

export const { addAsset, removeAsset } = portfolioSlice.actions;
export default portfolioSlice.reducer;
