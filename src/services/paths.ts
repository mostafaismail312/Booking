// ------------------ Auth Routes ------------------
export const MAIN_PATH = "/";
export const LOGIN_PATH = `${MAIN_PATH}login`;
export const REGISTER_PATH = `${MAIN_PATH}register`;
export const FORGET_PASS_PATH = `${MAIN_PATH}forget-pass`;
export const RESET_PASS_PATH = `${MAIN_PATH}reset-pass`;
export const VERIFY_ACCOUNT_PATH = `${MAIN_PATH}verify-account`;

// ------------------ Main Layout Routes ------------------
export const HOME_PATH = MAIN_PATH;
export const ROOMS_GRID_PATH = `${MAIN_PATH}rooms`;
export const ROOM_DETAILS_PATH = `${MAIN_PATH}room-details/:id`;
export const FAV_LIST_PATH = `${MAIN_PATH}fav-list`;
export const PAYMENT_PATH = `${MAIN_PATH}payment`;
export const CONFIRMATION_PATH = `${MAIN_PATH}confirmation`;
export const CHANGE_PASS_PATH = `${MAIN_PATH}change-pass`;

// ------------------ Dashboard Layout Routes ------------------
export const DASHBOARD_PATH = `${MAIN_PATH}dashboard`;

// Dashboard > Facilities
export const FACILITIES_LIST_PATH = `${DASHBOARD_PATH}/facilities-list`;
export const FACILITY_DATA_PATH = `${DASHBOARD_PATH}/facility-data`;

// Dashboard > Ads
export const ADS_LIST_PATH = `${DASHBOARD_PATH}/ads-list`;
export const AD_ADD_PATH = `${DASHBOARD_PATH}/ad-data/add/`;
export const AD_EDIT_PATH = `${DASHBOARD_PATH}/ad-data/edit`;

// Dashboard > Rooms
export const ROOMS_LIST_PATH = `${DASHBOARD_PATH}/rooms-list`;
export const ROOM_ADD_PATH = `${DASHBOARD_PATH}/room/add`;
export const ROOM_EDIT_PATH = `${DASHBOARD_PATH}/room/edit`;

// Dashboard > Bookings
export const BOOKINGS_LIST_PATH = `${DASHBOARD_PATH}/bookings-list`;
export const BOOKING_DATA_PATH = `${DASHBOARD_PATH}/booking-data`;

// Dashboard > Users
export const USERS_LIST_PATH = `${DASHBOARD_PATH}/users-list`;
export const USER_DATA_PATH = `${DASHBOARD_PATH}/user-data`;

const PATHS = {
  MAIN_PATH: MAIN_PATH,
  LOGIN_PATH: LOGIN_PATH.replace(MAIN_PATH, ""),
  REGISTER_PATH: REGISTER_PATH.replace(MAIN_PATH, ""),
  FORGET_PASS_PATH: FORGET_PASS_PATH.replace(MAIN_PATH, ""),
  RESET_PASS_PATH: RESET_PASS_PATH.replace(MAIN_PATH, ""),
  VERIFY_ACCOUNT_PATH: VERIFY_ACCOUNT_PATH.replace(MAIN_PATH, ""),
  ROOMS_GRID_PATH: ROOMS_GRID_PATH.replace(MAIN_PATH, ""),
  ROOM_DETAILS_PATH: `${ROOM_DETAILS_PATH}/:id`.replace(MAIN_PATH, ""),
  FAV_LIST_PATH: FAV_LIST_PATH.replace(MAIN_PATH, ""),
  PAYMENT_PATH: PAYMENT_PATH.replace(MAIN_PATH, ""),
  CONFIRMATION_PATH: CONFIRMATION_PATH.replace(MAIN_PATH, ""),
  CHANGE_PASS_PATH: CHANGE_PASS_PATH.replace(MAIN_PATH, ""),
  DASHBOARD_PATH: DASHBOARD_PATH.replace(MAIN_PATH, ""),
  FACILITIES_LIST_PATH: FACILITIES_LIST_PATH.replace(DASHBOARD_PATH + "/", ""),
  FACILITY_DATA_PATH: `${FACILITY_DATA_PATH}/:id`.replace(
    DASHBOARD_PATH + "/",
    ""
  ),
  ADS_LIST_PATH: ADS_LIST_PATH.replace(DASHBOARD_PATH + "/", ""),
  AD_ADD_PATH: AD_ADD_PATH.replace(DASHBOARD_PATH + "/", ""),
  AD_EDIT_PATH: `${AD_EDIT_PATH}/:id`.replace(DASHBOARD_PATH + "/", ""),
  ROOMS_LIST_PATH: ROOMS_LIST_PATH.replace(DASHBOARD_PATH + "/", ""),
  ROOM_ADD_PATH: ROOM_ADD_PATH.replace(DASHBOARD_PATH + "/", ""),
  ROOM_EDIT_PATH: `${ROOM_EDIT_PATH}/:id`.replace(DASHBOARD_PATH + "/", ""),
  BOOKINGS_LIST_PATH: BOOKINGS_LIST_PATH.replace(DASHBOARD_PATH + "/", ""),
  BOOKING_DATA_PATH: `${BOOKING_DATA_PATH}/:id`.replace(
    DASHBOARD_PATH + "/",
    ""
  ),
  USERS_LIST_PATH: USERS_LIST_PATH.replace(DASHBOARD_PATH + "/", ""),
  USER_DATA_PATH: `${USER_DATA_PATH}/:id`.replace(DASHBOARD_PATH + "/", ""),
};

export default PATHS;
