import './App.css';
import Register from './views/auth/Register';
import RequiredUser from './components/RequiredUser';
import { getHomeRouteForLoggedInUser, getUserData } from './utils/Utils';
import Layout from './components/Layout';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/auth/Login';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientRegister from './views/auth/ClientRegister';
import CompanyRegister from './views/auth/CompanyRegister';
import AdminLogin from './views/auth/AdminLogin';
import Users from './views/admin/Users';
import Statistics from './views/admin/Statistics';

const App = () => {
  const getHomeRoute = () => {
    const user = getUserData()
    if (user) {
      return <Navigate to={getHomeRouteForLoggedInUser(user.role)} replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }
  return (
    <Suspense fallback={null}>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={getHomeRoute()} />

          <Route element={<RequiredUser allowedRoles={['client']} />}>

          </Route>
          <Route element={<RequiredUser allowedRoles={['company']} />}>

          </Route>
          <Route element={<RequiredUser allowedRoles={['admin']} />}>
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/statistics" element={<Statistics />} />
          </Route>
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="company-register" element={<CompanyRegister />} />
        <Route path="client-register" element={<ClientRegister />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </Suspense>
  );
}

export default App;
