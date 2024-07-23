import Theme from "../../theme/Theme";

const Input = ({ label, id, name, type, placeholder }) => {
  const style = {
    colors: {
      primary: Theme.colors.primary,
      secondary: Theme.colors.secondary,
      accent: Theme.colors.accent,
      globalBackgroundColor: Theme.colors.globalBackgroundColor,
      componentBackgroundColor: Theme.colors.componentBackgroundColor,
    },
    font: {
      fontFamily: Theme.font.font,
    },
    company: {
      logo: Theme.company.logoURL,
      name: Theme.company.name,
    },
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6"
        style={{ color: style.colors.secondary }}
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className="block border-white py-1.5 px-3 focus:outline-none focus:border-white sm:text-sm sm:leading-6"
          style={{
            backgroundColor: style.colors.componentBackgroundColor,
            placeholder: style.colors.accent,
          }}
        />
      </div>
    </div>
  );
};

export default Input;
