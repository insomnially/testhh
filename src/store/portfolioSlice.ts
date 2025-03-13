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

const initialState: PortfolioState = {
  assets: [],
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Asset>) => {
      const existingAsset = state.assets.find(asset => asset.name === action.payload.name);
      if (existingAsset) {
        existingAsset.quantity += action.payload.quantity;
      } else {
        state.assets.push(action.payload);
      }
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter(asset => asset.name !== action.payload);
    },
    updatePrice: (state, action: PayloadAction<{ name: string; price: number; change24h: number }>) => {
      const asset = state.assets.find(asset => asset.name === action.payload.name);
      if (asset) {
        asset.price = action.payload.price;
        asset.change24h = action.payload.change24h;
      }
    },
    setAssets: (state, action: PayloadAction<Asset[]>) => {
      state.assets = action.payload;
    },
  },
});

export const { addAsset, removeAsset, updatePrice, setAssets } = portfolioSlice.actions;
export default portfolioSlice.reducer;
