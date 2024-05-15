import { createContext, useContext } from "react";

export type UserContextProps = {};

export const UserContext = createContext<UserContextProps>({});

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={{}}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
