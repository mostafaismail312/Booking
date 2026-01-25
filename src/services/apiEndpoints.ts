export const baseURL: string = "https://upskilling-egypt.com:3000/api/v0"; // Updated base URL based on Postman

// -----------------------------------------------------------------------------
// ADMIN  ENDPOINTS
export const ADMIN_URLS = {
  USER: {
    // Path to get all users (admin view, with pagination/filtering)
    GET_ALL_USERS: `${baseURL}/admin/Users`, // Example: /api/v0/admin/Users?page=1&size=10
    // Path to get a specific user profile (admin view)
    GET_USER_PROFILE: (id: string): string => `${baseURL}/admin/Users/${id}`,
    // Path to create a new user (e.g., manager, admin)
    CREATE_USER: `${baseURL}/admin/Users`,
    // Path for admin to reset a user's password
    RESET_PASSWORD: `${baseURL}/admin/Users/reset-password`, // Assuming a dedicated admin reset endpoint
    // Path for admin to change a user's password
    CHANGE_PASSWORD: `${baseURL}/admin/users/change-password`, // Assuming a dedicated admin change endpoint
    // Path for admin to login (if different from regular user login)
    LOGIN: `${baseURL}/admin/users/login`, // As seen in Postman screenshot
    // Path for admin to forget password (if different from regular user)
    FORGET_PASSWORD: `${baseURL}/admin/users/forget-password`, // As seen in Postman screenshot
  },

  // Room Management Endpoints within Admin
  ROOM: {
    // Path to create a new room
    CREATE_ROOM: `${baseURL}/admin/rooms`,
    // Path to get details of a specific room by its ID
    GET_ROOM: (id: string): string => `${baseURL}/admin/rooms/${id}`,
    // Path to update details of a specific room by its ID
    UPDATE_ROOM: (id: string): string => `${baseURL}/admin/rooms/${id}`,
    // Path to delete a specific room by its ID
    DELETE_ROOM: (id: string): string => `${baseURL}/admin/rooms/${id}`,
    // Path to get all rooms (admin view, with filtering/pagination)
    GET_ALL_ROOMS: `${baseURL}/admin/rooms`,
    // Path to get room types/facilities
    GET_ROOM_FACILITIES: `${baseURL}/admin/room-facilities`, // As seen in Postman screenshot
    // Path to add a new room facility
    ADD_ROOM_FACILITY: `${baseURL}/admin/room-facilities`,
    // Path to update a room facility
    UPDATE_ROOM_FACILITY: (id: string): string =>
      `${baseURL}/admin/room-facilities/${id}`,
    // Path to delete a room facility
    DELETE_ROOM_FACILITY: (id: string): string =>
      `${baseURL}/admin/room-facilities/${id}`,
    // Path to get all rooms for ads (admin view)
    GET_ALL_ROOMS_FOR_ADDS: `${baseURL}/admin/rooms`,
  },

  // Booking Management Endpoints within Admin
  BOOKING: {
    // Path to create a new booking (admin can create bookings)
    CREATE_BOOKING: "/admin/Booking",
    // Path to get details of a specific booking by its ID (admin view)
    GET_BOOKING: (id: string): string => `${baseURL}/admin/booking/${id}`,
    // Path to update details of a specific booking by its ID (admin view)
    UPDATE_BOOKING: (id: number): string => `${baseURL}/admin/Booking/${id}`,
    // Path to cancel a specific booking by its ID (admin view)
    CANCEL_BOOKING: (id: number): string =>
      `${baseURL}/admin/Booking/${id}/cancel`,
    // Path to delete a specific booking by its ID (admin view)
    DELETE_BOOKING: (id: string) => `${baseURL}/admin/booking/${id}`,
    // Path to get all bookings (admin view, with filtering/pagination)
    GET_ALL_BOOKINGS: "/admin/Booking",
    // Path to confirm a specific booking (admin action)
    CONFIRM_BOOKING: (id: number): string =>
      `${baseURL}/admin/Booking/${id}/confirm`,
  },

  // Ads Management Endpoints within Admin
  ADS: {
    // Path to create a new ad
    CREATE_AD: `${baseURL}/admin/Ads`,
    // Path to get details of a specific ad by its ID
    GET_AD: (id: string): string => `${baseURL}/admin/Ads/${id}`,
    // Path to update details of a specific ad by its ID
    UPDATE_AD: (id: string): string => `${baseURL}/admin/Ads/${id}`,
    // Path to delete a specific ad by its ID
    DELETE_AD: (id: string): string => `${baseURL}/admin/Ads/${id}`,
    // Path to get all ads (admin view, with filtering/pagination)
    GET_ALL_ADS: `${baseURL}/admin/Ads`,
  },

  // Dashboard Endpoints within Admin
  DASHBOARD: {
    GET_SUMMARY: `${baseURL}/admin/dashboard`, // Assuming a general dashboard endpoint
  },
};

// -----------------------------------------------------------------------------
// PORTAL API ENDPOINTS
// Grouping all API paths related to the 'portal' (client/user-facing) section.
export const PORTAL_URLS = {
  // User Management Endpoints within Portal
  USER: {
    // User login path for portal users
    LOGIN: `${baseURL}/portal/users/login`, // As seen in Postman screenshot
    // Path for portal users to register
    REGISTER: `${baseURL}/portal/users`, // Assuming a separate registration for portal
    // Path for portal users to forget password
    FORGET_PASSWORD: `${baseURL}/portal/users/forgot-password`, // As seen in Postman screenshot
    // Path for portal users to reset password
    RESET_PASSWORD: `${baseURL}/portal/users/reset-password`, // As seen in Postman screenshot
    // Path for Google OAuth login
    GOOGLE_AUTH: `${baseURL}/portal/google-auth`, // As seen in Postman screenshot
    // Path for Facebook OAuth login
    FACEBOOK_AUTH: `${baseURL}/portal/facebook-auth`, // As seen in Postman screenshot
    // Path to get current user profile for portal users
    GET_USER_PROFILE: `${baseURL}/portal/users/currentUser`, // Assuming a dedicated endpoint for portal
    // Path to update current user profile for portal users
    UPDATE_PROFILE: `${baseURL}/portal/users`,
    // Path to change password for portal users
    CHANGE_PASSWORD: `${baseURL}/portal/users/ChangePassword`,
    // Path to verify account for portal users
    VERIFY_ACCOUNT: `${baseURL}/portal/users/verify`,
  },

  // Rooms Endpoints within Portal
  ROOMS: {
    // Path to get all available rooms for booking (portal view)
    GET_ALL_ROOMS: `${baseURL}/portal/rooms`,
    // Path to get details of a specific room by its ID (portal view)
    GET_ROOM_DETAILS: (id: string) => `${baseURL}/portal/rooms/${id}`,
    // Path to get favorite rooms for the current user
    GET_FAVORITE_ROOMS: `${baseURL}/portal/favorite-rooms`, // As seen in Postman screenshot
    // Path to add a room to favorites
    ADD_TO_FAVORITES: `${baseURL}/portal/favorite-rooms`,
    // Path to remove a room from favorites
    REMOVE_FROM_FAVORITES: (roomId: string) =>
      `${baseURL}/portal/favorite-rooms/${roomId}`,
    // Path to get comments for a specific room
    GET_ROOM_COMMENTS: (roomId: string) =>
      `${baseURL}/portal/Room-comments/${roomId}`, // As seen in Postman screenshot
    // Path to add a comment to a room
    ADD_ROOM_COMMENT: (roomId: string) =>
      `${baseURL}/portal/room-comments/${roomId}`,
    // Path to get reviews for a specific room
    GET_ROOM_REVIEWS: (roomId: string) =>
      `${baseURL}/portal/Room-reviews/${roomId}`, // As seen in Postman screenshot
    // Path to add a review to a room
    ADD_ROOM_REVIEW: `${baseURL}/portal/Room-reviews`,
    GET_ALL_ROOMS_FILTER: (
      pageNumber: number,
      pageSize: number,
      startDate: string,
      endDate: string,
      capacity: number
    ) =>
      `${baseURL}/portal/rooms/available?page=${pageNumber}&size=${pageSize}${
        startDate && `&startDate=${startDate}`
      }${endDate && `&endDate=${endDate}`}${
        capacity && `&capacity=${capacity}`
      }`,
  },

  // Booking Endpoints within Portal
  BOOKING: {
    // Path to create a new booking by a portal user
    CREATE_BOOKING: `${baseURL}/portal/Booking`,
    // Path to get details of a specific booking by its ID for a portal user
    GET_BOOKING: (id: string) => `${baseURL}/portal/Booking/${id}`,
    // Path to update details of a specific booking by its ID for a portal user
    UPDATE_BOOKING: (id: string) => `${baseURL}/portal/Booking/${id}`,
    // Path to cancel a specific booking by its ID for a portal user
    CANCEL_BOOKING: (id: string) => `${baseURL}/portal/Booking/${id}/cancel`,
    // Path to get all bookings for the current portal user
    GET_MY_BOOKINGS: `${baseURL}/portal/Booking/my-bookings`, // Assuming a dedicated endpoint for user's own bookings
  },

  // Ads Endpoints within Portal (if applicable for users to view)
  ADS: {
    // Path to get all active ads for portal users
    GET_ALL_ADS: `${baseURL}/portal/Ads`,
    // Path to get a specific ad by its ID for portal users
    GET_AD: (id: string) => `${baseURL}/portal/Ads/${id}`,
  },
};

// -----------------------------------------------------------------------------

export const PAYMENT = (bookingId: string) =>
  `${baseURL}/portal/booking/${bookingId}/pay`;

export const PING_URL: string = `${baseURL}/Misc/Ping`; // Check if service is working
