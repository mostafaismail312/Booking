
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
      ]
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
