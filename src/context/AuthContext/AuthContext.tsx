/* eslint-disable react-refresh/only-export-components */
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthContextType,
  DecodedTokenPayload,
  FullUserDataType,
  
} from "../../services/types";
import { ADMIN_URLS } from "../../services/apiEndpoints";
import { axiosInstance } from "../../services/axiosInstance";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [loginData, setLoginData] = useState<DecodedTokenPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fullUserData, setFullUserData] = useState<FullUserDataType | null>(
    null
  );

  const saveLoginData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<DecodedTokenPayload>(token);
        console.log("decoded", decoded);
        setLoginData(() => decoded);
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false); // stop loading whether success or fail
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      if (!loginData?._id) return;
      const res = await axiosInstance.get(
        ADMIN_URLS.USER.GET_USER_PROFILE(loginData?._id)
      );
      console.log("res", res);
      setFullUserData(res.data.data.user);
      // // console.log("userData", res.data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  }, [loginData]);

  useEffect(() => {
    if (localStorage.getItem("token") && !loginData) {
      saveLoginData();
    } else if (loginData) {
      getCurrentUser();
    } else {
      setLoginData(null);
      setIsLoading(false); // no token, stop loading anyway
    }
  }, [loginData, saveLoginData, getCurrentUser]);

  const logOutUser = () => {
    localStorage.removeItem("token");
    saveLoginData();
    setFullUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loginData,
        saveLoginData,
        isLoading,
        fullUserData,
        getCurrentUser,
        logOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
