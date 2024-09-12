import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './components/App';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);


// import React from 'react'
// import type { PropsWithChildren } from 'react'

// import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react'
// import store, { persistor } from './redux/store';

// export const MainProviders = ({ children }: PropsWithChildren) => {
//     return (
//         <Provider store={store}>
//             <PersistGate loading={null} persistor={persistor}>
//                 {children}
//             </PersistGate>
//         </Provider>
//     )
// }

