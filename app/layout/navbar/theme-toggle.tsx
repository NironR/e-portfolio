import { Icon } from '~/components/icon/icon';
import { useTheme } from '~/components/theme-provider/theme-provider';

interface ThemeToggleProps {
    className?: string;
    iconClassName?: string;
}

export const ThemeToggle = ({ className, iconClassName }: ThemeToggleProps) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            className={className}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggleTheme}
        >
            <Icon className={iconClassName} icon={isDark ? 'sun' : 'moon'} />
        </button>
    );
};
