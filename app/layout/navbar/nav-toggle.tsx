import { Icon } from '~/components/icon/icon';
import styles from './nav-toggle.module.css';

interface NavToggleProps {
    menuOpen: boolean;
    onClick: () => void;
}

export const NavToggle = ({ menuOpen, onClick }: NavToggleProps) => (
    <button
        type="button"
        className={styles.toggle}
        aria-label="Menu"
        aria-expanded={menuOpen}
        onClick={onClick}
    >
        <Icon className={styles.icon} data-menu data-open={menuOpen} icon="menu" />
        <Icon className={styles.icon} data-close data-open={menuOpen} icon="close" />
    </button>
);
