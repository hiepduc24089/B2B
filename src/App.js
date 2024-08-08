import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes/Routes';
import DefaultLayout from './components/DefaultLayout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const renderRoutes = (routes, isPrivate = false) => {
    return routes.map((route, index) => {
      const Page = route.component;
      const Layout = route.layout || DefaultLayout;

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
