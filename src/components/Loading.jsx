import { useTheme } from "../context/theme-context";

function Loading() {
  const { colors } = useTheme();
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <span
        className="loading loading-spinner"
        style={{ color: colors.primary }}
      ></span>
    </div>
  );
}

export default Loading;
