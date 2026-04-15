import { Link as RouterLink, useLocation } from '@remix-run/react';
import { navLinks, socialLinks } from "~/layout/navbar/nav-data";
import { Monogram } from '~/components/monogram/monogram';
import { Icon } from '~/components/icon/icon';
import { useRef } from 'react';
import styles from './navbar.module.css';
import config from '~/config.json';

// Define the shape of navigation and social links
interface NavLink {
  label: string;
  pathname: string;
}

interface SocialLink {
  label: string;
  url: string;
  icon: string; // Assuming icon is a string identifier for the Icon component
}

export const Navbar = () => {
  const location = useLocation();
  // Properly type the ref for the header element
  const headerRef = useRef<HTMLElement>(null);

  return (
    <header className={styles.navbar} ref={headerRef}>
      <RouterLink
        className={styles.logo}
        aria-label={`${config.name}, ${config.role}`}
        to={location.pathname === '/' ? '/#intro' : '/'}
        prefetch="intent"
        data-navbar-item
      >
        <Monogram highlight />
      </RouterLink>
      <nav aria-label="Primary" className={styles.nav}>
        <div className={styles.navList}>
          {(navLinks as NavLink[]).map(({ label, pathname }) => (
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

interface NavbarIconsProps {
  desktop?: boolean;
}

const NavbarIcons = ({ desktop }: NavbarIconsProps) => (
  <div className={styles.navIcons}>
    {
      (socialLinks as SocialLink[]).map(({ label, url, icon }) => (
        <a
          key={label}
          data-navbar-item={desktop || undefined}
          className={styles.navIconLink}
          aria-label={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer" // Fixed typo here
        >
          <Icon className={styles.navIcon} icon={icon} />
        </a>
      ))
    }
  </div>
);