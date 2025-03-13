import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePrice, removeAsset } from "../store/portfolioSlice";
import { RootState } from "../store/store";
import AssetFormModal from "./AssetFormModal";

const PortfolioOverview: React.FC = () => {
  const dispatch = useDispatch();
  const assets = useSelector((state: RootState) => state.portfolio.assets);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);

  useEffect(() => {
    const savedAssets = localStorage.getItem("assets");
    if (savedAssets) {
      JSON.parse(savedAssets).forEach((asset: any) => {
        dispatch(updatePrice({
          name: asset.name,
          price: asset.price,
          change24h: asset.change24h
        }));
      });
    }
  }, [dispatch]);

  useEffect(() => {
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      data.forEach((coin: any) => {
        dispatch(updatePrice({
          name: coin.s,
          price: parseFloat(coin.c),
          change24h: parseFloat(coin.P)
        }));
      });
    };

    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    const total = assets.reduce((acc, asset) => acc + asset.quantity * asset.price, 0);
    setTotalPortfolioValue(total);
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  const handleRemoveAsset = (name: string) => {
    const updatedAssets = assets.filter(asset => asset.name !== name);
    localStorage.setItem("assets", JSON.stringify(updatedAssets));
    dispatch(removeAsset(name));
  };

  return (
    <div className="container">
      <h1>PORTFOLIO OVERVIEW</h1>
      <table>
        <thead>
          <tr>
            <th>Актив</th>
            <th>Количество</th>
            <th>Цена</th>
            <th>Общая стоимость</th>
            <th>Изм. за 24ч</th>
            <th>Процент портфеля</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr onClick={() => handleRemoveAsset(asset.name)} key={asset.id}>
              <td>{asset.name}</td>
              <td>{asset.quantity.toFixed(5)}</td>
              <td>${asset.price.toLocaleString()}</td>
              <td>${(asset.quantity * asset.price).toLocaleString()}</td>
              <td style={{ color: asset.change24h >= 0 ? "green" : "red" }}>
                {asset.change24h.toFixed(2)}%
              </td>
              <td>{totalPortfolioValue > 0 ? ((asset.quantity * asset.price) / totalPortfolioValue * 100).toFixed(2) + "%" : "0%"}</td>
              <td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AssetFormModal />
    </div>
  );
};

export default PortfolioOverview;
