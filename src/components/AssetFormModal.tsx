import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { addAsset } from "../store/portfolioSlice";
import { RootState } from "../store/store";
import { v4 as uuidv4 } from "uuid";
import { setAssets } from "../store/portfolioSlice";

const availableCryptos = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "XRPUSDT", "SOLUSDT", "DOGEUSDT", "DOTUSDT", "LTCUSDT"];

const AssetFormModal: React.FC = () => {
  const dispatch = useDispatch();
  const assets = useSelector((state: RootState) => state.portfolio.assets);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("BTCUSDT");
  const [quantity, setQuantity] = useState(0);
  const [cryptoData, setCryptoData] = useState<{ [key: string]: { price: number; change24h: number } }>({});

  useEffect(() => {
    const savedAssets = localStorage.getItem("assets");
    if (savedAssets) {
      JSON.parse(savedAssets).forEach((asset: any) => dispatch(addAsset(asset)));
    }
  }, [dispatch]);

  useEffect(() => {
    const socket = new WebSocket("wss://stream.binance.com:9443/ws");
    const streams = availableCryptos.map(symbol => symbol.toLowerCase() + "@ticker").join("/");

    socket.onopen = () => {
      socket.send(JSON.stringify({ method: "SUBSCRIBE", params: streams.split("/"), id: 1 }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.s && data.c && data.P) {
        setCryptoData((prev) => ({
          ...prev,
          [data.s]: {
            price: parseFloat(data.c),
            change24h: parseFloat(data.P),
          },
        }));
      }
    };

    return () => socket.close();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
  
    const existingAsset = assets.find((asset) => asset.name === selectedCrypto);
    let updatedAssets;
  
    if (existingAsset) {
      updatedAssets = assets.map((asset) =>
        asset.name === selectedCrypto ? { ...asset, quantity: asset.quantity + quantity } : asset
      );
    } else {
      const newAsset = {
        id: uuidv4(),
        name: selectedCrypto,
        quantity,
        price: cryptoData[selectedCrypto]?.price || 0,
        change24h: cryptoData[selectedCrypto]?.change24h || 0,
      };
      updatedAssets = [...assets, newAsset];
    }
  
    localStorage.setItem("assets", JSON.stringify(updatedAssets));
    dispatch(setAssets(updatedAssets));
  
    setModalIsOpen(false);
    setQuantity(0);
  };


  return (
    <>
      <button onClick={() => setModalIsOpen(true)} className="add-button">
        Добавить
      </button>
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)} 
        className="modal"
        ariaHideApp={false} 
      >
        <h2>Добавить криптовалюту</h2>
        <div className="crypto-list">
          {availableCryptos.map((crypto) => (
            <div 
              key={crypto} 
              className={`crypto-item ${selectedCrypto === crypto ? "selected" : ""}`} 
              onClick={() => setSelectedCrypto(crypto)}
            >
              <span>{crypto}</span>
              <span>${cryptoData[crypto]?.price?.toFixed(2) || "—"}</span>
              <span style={{ color: cryptoData[crypto]?.change24h >= 0 ? "green" : "red" }}>
                {cryptoData[crypto]?.change24h?.toFixed(2) || "—"}%
              </span>
            </div>
          ))}
        </div>

        <form className="formassetform" onSubmit={handleSubmit}>
          <label>Количество:</label>
          <input
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value ? parseFloat(e.target.value) : 0)} 
          />
          <button type="submit">Добавить</button>
          <button type="button" onClick={() => setModalIsOpen(false)}>
            Закрыть
          </button>
        </form>
      </Modal>
    </>
  );
};

export default AssetFormModal;
