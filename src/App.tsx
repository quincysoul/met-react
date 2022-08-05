import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.min.css';
// import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
// import { createBrowserHistory } from 'history';
import {
  Layout, Row, Typography,
} from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import MetroApp from './components/MetroApp';

const { Title } = Typography;
function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ paddingTop: '2em', height: '100px' }}>
          <Title level={2} style={{ color: 'blueViolet' }}>Metro App</Title>
        </Header>
        <Content>
          <Row justify="center">
            <MetroApp />
          </Row>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
