import { Link as RouterLink, useLocation} from '@remix-run/react';
import styles from './navbar.module.css';
import config from '~/config.json';



export const Navbar = () => {
    const location = useLocation();

    return (
        <header>
            <RouterLink
                className={styles.logo}
                aria-label={`${config.name}, ${config.role}`}
                to={location.pathname === '/' ? '/#intro' : '/'}
            >
                <nav className={styles.nav}>
                    <div className={styles.navList}>
                        Hello there!
                    </div>
                </nav>
            </RouterLink>
        </header>
    )
}

export default Navbar;