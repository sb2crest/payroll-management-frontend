import React from "react";

const Button = ({ onClick, children, className }) => {
  const style = {
    colors: {
      backgroundColor: "#A784ED",
      primary: "#FFFFFF",
      secondary: "#a855f7",
    },
  };
  return (
    <button
      className={`py-2 px-10 rounded-md ${className} `}
      onClick={onClick}
      style={{
        background: style.colors.backgroundColor,
        color: style.colors.primary,
        hover: style.secondary,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
