import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { OrderContextProvider } from './context/OrderContext.jsx'
import { WarehouseContextProvider } from './context/WarehouseContext.jsx'
import { PaymentUserContextProvider } from './context/PaymentUserContext.jsx'
import { DeliveryPartnerProvider } from './context/DeliveryPartners.jsx'
import { TrackingContextProvider } from './context/TrackingContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
      {/* <TrackingContextProvider> */}
      <OrderContextProvider>
        <WarehouseContextProvider>
            <DeliveryPartnerProvider>
          <PaymentUserContextProvider>
    <App />
          </PaymentUserContextProvider>
            </DeliveryPartnerProvider>
        </WarehouseContextProvider>
      </OrderContextProvider>
      {/* </TrackingContextProvider> */}
    </AuthContextProvider>
)
