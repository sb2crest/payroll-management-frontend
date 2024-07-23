import React from "react";

const Input = ({ label, id, name, type, placeholder }) => {
  const style = {
    colors: {
      backgroundColor: "#FFFFFF",
    },
  };
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className="block w-full border border-gray-100 py-1.5 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-white sm:text-sm sm:leading-6"
          style={{
            backgroundColor: style.colors.backgroundColor,
          }}
        />
      </div>
    </div>
  );
};

export default Input;
