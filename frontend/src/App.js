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
import CreateUser from './views/admin/CreateUser';
import UpdateUser from './views/admin/UpdateUser';
import CompanyServices from './views/company/CompanyServices';
import CreateCompanyService from './views/company/CreateCompanyService';
import UpdateCompanyService from './views/company/UpdateCompanyService';
import TransferCompany from './views/client/TransferCompany';
import ClientServices from './views/client/ClientService';

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
            <Route path="client/companies" element={<TransferCompany />} />
            <Route path="client/services" element={<ClientServices />} />
          </Route>
          <Route element={<RequiredUser allowedRoles={['company']} />}>
            <Route path="company/services" element={<CompanyServices />} />
            <Route path="company/services/create-service" element={<CreateCompanyService />} />
            <Route path="company/services/update-service/:id" element={<UpdateCompanyService />} />
          </Route>
          <Route element={<RequiredUser allowedRoles={['admin']} />}>
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/users/create-user" element={<CreateUser />} />
            <Route path="admin/users/update-user/:id" element={<UpdateUser />} />
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
