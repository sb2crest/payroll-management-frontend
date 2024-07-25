import Theme from "../../theme/Theme";

const Button = ({ onClick, children, className }) => {
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
    <button
      className={`py-1 px-5 rounded-md ${className} `}
      onClick={onClick}
      style={{
        background: style.colors.primary,
        color: style.colors.componentBackgroundColor,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
