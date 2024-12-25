"use client";

//? Import libraries and dependencies
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from "react";
import { routes } from "../constants/routes";

//? Define interfaces
export interface User {
  user: {
    _id: string;
    email: string;
    fullname: string;
    password: string;
    __v: number;
  };
  token: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface AuthContextProps {
  children: ReactNode;
}

//? Create context for auth
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

//? Create context provider
export function AuthContextProvider({ children }: AuthContextProps) {
  //* Initially set the state to null
  const [user, setUser] = useState<User | null>(null);
  const token = Cookies.get("token");

  //* If the user doesnot exist but token is present in cookies, get the user info
  useEffect(() => {
    if (!user) {
      if (token) getUserInfo(token);
    }
  }, [token]);

  //* Get user info from the server by making a get request to the userInfo route
  const getUserInfo = (token: string) => {
    axios
      .get(routes.userInfo, {
        //* Set the Authorization header with the token
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //* Set the user state with the user info and token
        setUser({ user: { ...res.data?.data }, token });
      })
      //* If there is an error, log the error to the console
      .catch((err) => console.log(err));
  };

  //* Return the AuthContext.Provider with the value of user and setUser
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
