import React, { useState, useCallback, useMemo } from "react";

import ActiveContext from "./ActiveContext";
import userAPI from "../../apis/userAPI";
import authAPI from "../../apis/authAPI";

const ActiveState = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const checkedStatusActive = useCallback(async () => {
    try {
      const active = await userAPI.status();

      if (!active?.isActive) {
        setShowModal(true);
        return;
      }
      setShowModal(false);
    } catch (error) {
      setShowModal(true);
      console.error(error?.response?.data.message);
    }
  }, []);

  const handleInactive = useCallback(async () => {
    try {
      await userAPI.change({ isActive: false });
      setShowModal(true);
    } catch (error) {
      setShowModal(true);
    }
  }, []);

  const verifySecurityCode = useCallback(async (inputCode) => {
    try {
      const result = await authAPI.verifyCode({ security_code: inputCode });
      if (result) {
        await userAPI.change({ isActive: true });
        setShowModal(false);
        return true;
      }
    } catch (error) {
      setShowModal(true);
      setError(error.response?.data?.message);
      return false;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      showModal,
      checkedStatusActive,
      handleInactive,
      verifySecurityCode,
      setShowModal,
      error,
      setError,
    }),
    [
      showModal,
      setShowModal,
      checkedStatusActive,
      handleInactive,
      verifySecurityCode,
      error,
    ],
  );

  return (
    <ActiveContext.Provider value={contextValue}>
      {children}
    </ActiveContext.Provider>
  );
};
export default ActiveState;
