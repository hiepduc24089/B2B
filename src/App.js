import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes/Routes';
import DefaultLayout from './components/DefaultLayout';
import PrivateRoute from './components/PrivateRoute';
import LoginLayout from './components/LoginLayout';
import routesConfig from '~/config/routes';

function App() {
  const renderRoutes = (routes, isPrivate = false) => {
    return routes.map((route, index) => {
      const Page = route.component;
      let Layout = route.layout || DefaultLayout;

      if (
        route.path === routesConfig.login ||
        route.path === routesConfig.register ||
        route.path === routesConfig.select_password ||
        route.path === routesConfig.reset_password
      ) {
        Layout = LoginLayout;
      }

      const element = (
        <Layout>
          <Page />
        </Layout>
      );

      return (
        <Route key={index} path={route.path} element={isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element} />
      );
    });
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {renderRoutes(publicRoutes)}
          {renderRoutes(privateRoutes, true)}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
