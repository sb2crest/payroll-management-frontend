import { useTheme } from "../context/theme-context";

function Login() {
  const { theme } = useTheme();
  return (
    <div>
      <button style={{ background: theme.colors.primary }}>add</button>
    </div>
  );
}

export default Login;
