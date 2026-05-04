import { toast } from "react-toastify";
import React from "react";

const baseConfig = (id) => ({
  toastId: id,
});

const confirm = (message, onConfirm) => {
  const toastId = "confirm-toast";

  if (toast.isActive(toastId)) return;

  toast(
    ({ closeToast }) =>
      React.createElement(
        "div",
        null,
        React.createElement("p", null, message),

        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              gap: "10px",
              marginTop: "8px",
            },
          },

          React.createElement(
            "button",
            {
              onClick: async () => {
                closeToast();
                try {
                  await onConfirm();
                } catch (err) {
                  console.error(err);
                }
              },
            },
            "Yes"
          ),

          React.createElement(
            "button",
            {
              onClick: closeToast,
            },
            "No"
          )
        )
      ),
    {
      toastId,
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  );
};

export const showToast = {
  success: (message) =>
    toast.success(message, baseConfig(`success-${message}`)),

  error: (message) =>
    toast.error(message, baseConfig(`error-${message}`)),

  info: (message) =>
    toast.info(message, baseConfig(`info-${message}`)),

  warning: (message) =>
    toast.warning(message, baseConfig(`warning-${message}`)),

  confirm,
};