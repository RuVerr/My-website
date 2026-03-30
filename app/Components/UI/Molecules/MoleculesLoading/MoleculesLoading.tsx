import React from "react";
import { AtomLoading } from "../../Atoms/GROUP-AtomBackgrounds/AtomLoading/AtomLoading";

export const MoleculesLoading = () => {
  const loadingHeading = "Loading";
  return <AtomLoading children={loadingHeading} className="" spanClassName="" />;
};
