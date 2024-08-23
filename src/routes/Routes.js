import routesConfig from '~/config/routes';
import Home from '~/pages/Home';
import HotDeal from '~/pages/HotDeal';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import SelectPassword from '~/pages/SelectPassword';
import ResetPassword from '~/pages/ResetPassword';
import Profile from '~/pages/Profile';
import ShoppingCart from '~/pages/ShoppingCart';
import Category from '~/pages/Category';
import Supplier from '~/pages/Supplier';
import ForYou from '~/pages/ForYou';
import ProductDetails from '~/pages/ProductDetails';
import Payment from '~/pages/Payment';
import StoreManagement from '~/pages/StoreManagement';

// Routes accessible without login
const publicRoutes = [
  { path: routesConfig.home, component: Home },
  { path: routesConfig.hot_deal, component: HotDeal },
  { path: routesConfig.login, component: Login },
  { path: routesConfig.register, component: Register },
  { path: routesConfig.select_password, component: SelectPassword },
  { path: routesConfig.reset_password, component: ResetPassword },
  { path: routesConfig.shopping_cart, component: ShoppingCart },
  { path: routesConfig.category, component: Category },
  { path: routesConfig.supplier, component: Supplier },
  { path: routesConfig.foryou, component: ForYou },
  { path: routesConfig.product_details, component: ProductDetails },
];

// Routes accessible only after login
const privateRoutes = [
  { path: routesConfig.profile, component: Profile },
  { path: routesConfig.payment, component: Payment },
  { path: routesConfig.store_management, component: StoreManagement },
];

export { publicRoutes, privateRoutes };
