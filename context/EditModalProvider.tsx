"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import { useState } from "react";

export type EditUserType = {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditUserContext = createContext<EditUserType>(
{
  open:false,
  setOpen:(value)=>{},
  userId:"",
  setUserId:(value)=>{}
}
);

export const EditUserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  return (
    <EditUserContext.Provider value={{ open, setOpen, userId, setUserId }}>
      {children}
    </EditUserContext.Provider>
  );
};
