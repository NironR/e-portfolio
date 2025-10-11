import { Link as RouterLink, useLocation } from '@remix-run/react';
import { navLinks, socialLinks } from "~/layout/navbar/nav-data";
import { Monogram } from '~/components/monogram/monogram';
import { Icon } from '~/components/icon/icon';
import { useRef } from 'react';
import styles from './navbar.module.css';
import config from '~/config.json';

export const Navbar = () => {
    const location = useLocation();
    const headerRef = useRef();

    return (
        <header className={styles.navbar} ref={headerRef}>
            <RouterLink
                className={styles.logo}
                aria-label={`${config.name}, ${config.role}`}
                to={location.pathname === '/' ? '/#intro' : '/'}
                prefetch="intent"
                data-navbar-item
            >
                <Monogram highlight/>
            </RouterLink>
            <nav aria-label="Primary" className={styles.nav}>
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
                <NavbarIcons desktop />
            </nav>
        </header>
    );
};

const NavbarIcons = ({ desktop }) => (
    <div className={styles.navIcons}>
        {
            socialLinks.map(({ label, url, icon }) => (
                <a
                    key={label}
                    data-navbar-item={desktop || undefined}
                    className={styles.navIconLink}
                    aria-label={label}
                    href={url}
                    target="_blank"
                    rel="noopner noreferrer"
                >
                    <Icon className={styles.navIcon} icon={icon} />
                </a>
            ))
        }
    </div>
)
