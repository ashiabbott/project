import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <select value={theme} onChange={toggleTheme}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
};
