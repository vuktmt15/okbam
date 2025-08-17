import React from "react";

export const MyTabContext = React.createContext<{goWithdraw: () => void}>(
  {goWithdraw: () => {}}
);


