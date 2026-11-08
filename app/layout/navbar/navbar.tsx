import { Link as RouterLink, useLocation } from '@remix-run/react';
import { navLinks, socialLinks } from "~/layout/navbar/nav-data";
import { Monogram } from '~/components/monogram/monogram';
import { Icon } from '~/components/icon/icon';
import { Transition } from '~/components/transition/transition';
import { tokens } from '~/components/theme-provider/theme';
import { useScrollToHash } from '~/hooks';
import { NavToggle } from './nav-toggle';
import { ThemeToggle } from './theme-toggle';
import { classes, cssProps, msToNum, numToMs } from '~/utils/styles';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
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
  const scrollToHash = useScrollToHash();
  const [menuOpen, setMenuOpen] = useState(false);
  // Properly type the ref for the header element
  const headerRef = useRef<HTMLElement>(null);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Smooth scroll to sections on the home page instead of jumping
  const handleNavItemClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const { hash } = event.currentTarget;

    if (hash && location.pathname === '/' && document.getElementById(hash.slice(1))) {
      event.preventDefault();
      scrollToHash(hash);
    }
  };

  const handleMobileNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    handleNavItemClick(event);
    setMenuOpen(false);
  };

  return (
    <header className={styles.navbar} ref={headerRef}>
      <RouterLink
        className={styles.logo}
        aria-label={`${config.name}, ${config.role}`}
        to={location.pathname === '/' ? '/#intro' : '/'}
        prefetch="intent"
        data-navbar-item
        onClick={handleMobileNavClick}
      >
        <Monogram highlight />
      </RouterLink>
      <NavToggle menuOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
      <nav aria-label="Primary" className={styles.nav}>
        <div className={styles.navList}>
          {(navLinks as NavLink[]).map(({ label, pathname }) => (
            <RouterLink
              prefetch="intent"
              to={pathname}
              key={label}
              data-navbar-item
              className={styles.navLink}
              onClick={handleNavItemClick}
            >
              {label}
            </RouterLink>
          ))}
        </div>
        <NavbarIcons desktop />
      </nav>
      <Transition unmount in={menuOpen} timeout={msToNum(String(tokens.base.durationL))}>
        {({ visible, nodeRef }) => (
          <nav
            aria-label="Mobile"
            className={styles.mobileNav}
            data-visible={visible}
            ref={nodeRef}
          >
            {(navLinks as NavLink[]).map(({ label, pathname }, index) => (
              <RouterLink
                prefetch="intent"
                to={pathname}
                key={label}
                className={styles.mobileNavLink}
                data-visible={visible}
                onClick={handleMobileNavClick}
                style={cssProps({
                  transitionDelay: numToMs(msToNum(String(tokens.base.durationS)) + index * 50),
                })}
              >
                {label}
              </RouterLink>
            ))}
            <NavbarIcons />
            <ThemeToggle
              className={classes(styles.navIconLink, styles.mobileThemeToggle)}
              iconClassName={styles.navIcon}
            />
          </nav>
        )}
      </Transition>
      <ThemeToggle
        className={classes(styles.navIconLink, styles.themeToggle)}
        iconClassName={styles.navIcon}
      />
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
