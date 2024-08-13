import routesConfig from '~/config/routes';
import Home from '~/pages/Home';
import HotDeal from '~/pages/HotDeal';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Profile from '~/pages/Profile';
import ShoppingCart from '~/pages/ShoppingCart';
import Category from '~/pages/Category';
import Supplier from '~/pages/Supplier';
import ForYou from '~/pages/ForYou';

// Routes accessible without login
const publicRoutes = [
  { path: routesConfig.home, component: Home },
  { path: routesConfig.hot_deal, component: HotDeal },
  { path: routesConfig.login, component: Login },
  { path: routesConfig.register, component: Register },
  { path: routesConfig.shopping_cart, component: ShoppingCart },
  { path: routesConfig.category, component: Category },
  { path: routesConfig.supplier, component: Supplier },
  { path: routesConfig.foryou, component: ForYou },
];

// Routes accessible only after login
const privateRoutes = [{ path: routesConfig.profile, component: Profile }];

export { publicRoutes, privateRoutes };
