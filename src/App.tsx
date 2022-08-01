import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';
// import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
// import { createBrowserHistory } from 'history';
import RouteSelect from './components/RouteSelect';

function App() {
  return (
  // <HistoryRouter history={history}>
    <BrowserRouter>
      <RouteSelect />
    </BrowserRouter>

  // </HistoryRouter>
  );
}

export default App;
