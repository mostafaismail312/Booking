export type validationType = {
  USERNAME_VALIDATION: object;
  EMAIL_VALIDATION: object;
  PASSWORD_VALIDATION: (requred: string) => object;
  CONFIRM_PASSWORD_VALIDATION: (
    getValues: (value: string) => string,
    newPassword: string
  ) => object;
};

export type DecodedTokenPayload = {
  exp: number;
  iat: number;
  role: string;
  verified: boolean;
  _id: string;
};

export type setLogin ={
  userName: string;
}

export type FullUserDataType = {
  country: string;
  createdAt: Date | string;
  email: string;
  phoneNumber: number;
  profileImage: string;
  role: "admin" | "portal";
  updatedAt: Date | string;
  userName: string;
  verified: boolean;
  _id: string;
};

export type AuthContextType = {
  isLoading: boolean;
  loginData: DecodedTokenPayload | null;
  fullUserData: FullUserDataType | null;
  logOutUser: () => void;
  saveLoginData: () => void;
  getCurrentUser: () => void;
};

export type RoomFormInputs = {
  roomNumber: string;
  price: string;
  discount: string;
  capacity: string;
  facilities: string[];
  imgs: File | null;
  oldImage?: string; // ✅ New field to store old image from API
};

export type UserType = {
  country: string;
  createdAt: Date | string;
  email: string;
  phoneNumber: number;
  profileImage: string;
  role: "admin" | "portal";
  updatedAt: Date | string;
  userName: string;
  verified: boolean;
  _id: string;
};

export type FacilityType = {
  _id: string;
  name: string;
};

export type RoomType = {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: FacilityType[];
  createdBy: UserType;
  images: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type BookingsType = {
  _id: string;
  startDate: Date | string;
  endDate: Date | string;
  totalPrice: number;
  user: UserType;
  room: RoomType | null;
  status: "pending" | "completed";
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Dashboard_Charts = {
  rooms: number;
  facilities: number;
  bookings: {
    pending: number;
    completed: number;
  };
  ads: number;
  users: {
    user: number;
    admin: number;
  };
};
