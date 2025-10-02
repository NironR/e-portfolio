import { Link as RouterLink, useLocation } from '@remix-run/react';
import { navLinks } from "~/layout/navbar/nav-data";
import { Monogram } from '~/components/monogram/monogram';
import styles from './navbar.module.css';
import config from '~/config.json';

export const Navbar = () => {
    const location = useLocation();

    return (
        <header className={styles.navbar}>
            <RouterLink
                className={styles.logo}
                aria-label={`${config.name}, ${config.role}`}
                to={location.pathname === '/' ? '/#intro' : '/'}
                prefetch="intent"
            >
                <Monogram highlight={location.pathname === '/'} />
            </RouterLink>
            <nav aria-label="Primary">
                <div className={styles.navList}>
                    {navLinks.map(({ label, pathname }) => (
                        <RouterLink
                            prefetch="intent"
                            to={pathname}
                            key={label}
                            data-navbar-item
                            className={styles.navLink}
                        >
                            {label}
                        </RouterLink>
                    ))}
                </div>
            </nav>
        </header>
    );
};
