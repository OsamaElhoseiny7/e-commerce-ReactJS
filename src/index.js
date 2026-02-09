import ReactDOM from 'react-dom/client';
import App from './App';
import UserProvider from './contextAPI/UserProvider';
import ProductsProvider from './contextAPI/ProductsProvider';
import OrdersProvider from './contextAPI/OrdersProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ProductsProvider>
  <UserProvider>
  <OrdersProvider>
        <App />
  </OrdersProvider>
  </UserProvider>
  </ProductsProvider>
  // </React.StrictMode>
);


