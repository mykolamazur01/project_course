import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SupplyCard from './components/SupplyCard/SupplyCard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SupplyCard supplyProp={{
      supply_id: 1,
      supply_date: '2021-10-10',
      supply_detail_ids: [15,16,17]
    }} />
  </React.StrictMode>
);


