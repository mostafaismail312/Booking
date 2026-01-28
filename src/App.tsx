
import './App.css'
import AuthLayout from './layouts/AuthLayout/AuthLayout'
import NotFound from './shared/NotFound/NotFound'
import Login from './templates/AuthTemplate/Login/Login'
import Register from './templates/AuthTemplate/Register/Register'
import ForgetPass from './templates/AuthTemplate/ForgetPass/ForgetPass'
import ResetPass from './templates/AuthTemplate/ResetPass/ResetPass'
import VerifyAccount from './templates/AuthTemplate/VerifyAccount/VerifyAccount'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PATHS from './services/paths'
import ChangePassword from './templates/AuthTemplate/ChangePassword/ChangePassword'
import MasterLayout from './shared/MasterLayout/MasterLayout'
import { Dashboard } from '@mui/icons-material'
import Rooms from './templates/DashboardTemplate/Rooms/Rooms'
import Users from './templates/DashboardTemplate/Users/Users'
import Home from './templates/DashboardTemplate/Home/Home'

function App() {


    
   const routes = createBrowserRouter([
    // Auth Routes
    {
      path: "",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { path: PATHS.LOGIN_PATH, element: <Login /> },
        { path: PATHS.REGISTER_PATH, element: <Register /> },
        {
          path: PATHS.FORGET_PASS_PATH,
          element: <ForgetPass />,
        },
        {
          path: PATHS.RESET_PASS_PATH,
          element: <ResetPass />,
        },
        {
          path: PATHS.VERIFY_ACCOUNT_PATH,
          element: <VerifyAccount />,
        },
           {
          path: PATHS.CHANGE_PASS_PATH,
          element: <ChangePassword />,
        },
      ]
    },
    
    {
      path: "/dashboard",
      element: <MasterLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home/> },
         { path: "home", element: <Home /> },
          { path: "rooms", element: <Rooms /> },
           { path: "users", element: <Users /> },
      
    
      
      ],
    },

   ] 
  );

  return (
    <>
   <RouterProvider router={routes}></RouterProvider>
    </>
  );
 
  
}

export default App
