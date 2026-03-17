import React from "react";
import { AtomLoading } from "../../Atoms/AtomLoading/AtomLoading";

export const MoleculesLoading = () => {
  const loadingHeading = "Loading";
  return <AtomLoading children={loadingHeading} />;
};
