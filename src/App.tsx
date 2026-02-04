import "./App.css";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import NotFound from "./shared/NotFound/NotFound";
import Login from "./templates/AuthTemplate/Login/Login";
import Register from "./templates/AuthTemplate/Register/Register";
import ForgetPass from "./templates/AuthTemplate/ForgetPass/ForgetPass";
import ResetPass from "./templates/AuthTemplate/ResetPass/ResetPass";
import VerifyAccount from "./templates/AuthTemplate/VerifyAccount/VerifyAccount";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PATHS from "./services/paths";
import ChangePassword from "./templates/AuthTemplate/ChangePassword/ChangePassword";
import MasterLayout from "./shared/MasterLayout/MasterLayout";
import { Dashboard } from "@mui/icons-material";
import RoomList from "./templates/DashboardTemplate/Rooms/RoomList/RoomList";
import CreateRoom from "./templates/DashboardTemplate/Rooms/CreateRoom/CreateRoom";
import Users from "./templates/DashboardTemplate/Users/Users";
import Home from "./templates/DashboardTemplate/Home/Home";
import FacilitiesList from "./templates/DashboardTemplate/Facilities/FacilitiesList/FacilitiesList";
import FacilityData from "./templates/DashboardTemplate/Facilities/FacilityData/FacilityData";
import AdsList from "./templates/DashboardTemplate/ADS/AdsList/AdsList";
import CreateAds from "./templates/DashboardTemplate/ADS/CreateAds/CreateAds";
import ProtectedRoute from "./context/ProtectedRoute";
import RoomsExplore from "./templates/MasterLayoutTemplate/Rooms/RoomsExplore/RoomsExplore";
import RoomDetails from "./templates/MasterLayoutTemplate/Rooms/RoomsDetails/RoomDetails";

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

          path: 'change-password',

          element: <ChangePassword />,
        },
      ],
    },

    {
      path: PATHS.DASHBOARD_PATH,
      element: <ProtectedRoute> <MasterLayout /></ProtectedRoute>,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        { path: "home", element: <Home /> },
        { path: "rooms", element: <RoomList /> },

        { path: "createroom", element: <CreateRoom /> },
        { path: "edit/:id", element: <CreateRoom /> },
        { path: "users", element: <Users /> },
        {
          path: "facilities-list",
          element: <FacilitiesList />,
        },
        {
          path: PATHS.FACILITY_DATA_PATH,
          element: <FacilityData />,
        },
        {
          path: PATHS.ADS_LIST_PATH,
          element: <AdsList />,
        },
        { path: "createads", element: <CreateAds /> },
        { path: "editads/:id", element: <CreateAds /> },
      ],
    },

    {
    path: PATHS.MAIN_PATH, // "/"
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "rooms", element: <RoomsExplore /> },
      { path: "room-details/:id", element: <RoomDetails /> },
    ],
  },
  ]);

  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
}

export default App;
