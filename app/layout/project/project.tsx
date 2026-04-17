import { Button } from '~/components/button/button';
import { Heading } from '~/components/heading/heading';
import { Image } from '~/components/image/image';
import { Section } from '~/components/section/section';
import { Text } from '~/components/text/text';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition/transition';
import { useParallax } from '~/hooks/useParallax';
import { 
forwardRef, 
  useRef, 
  ReactNode, 
  ElementType, 
  HTMLAttributes, 
  ComponentPropsWithoutRef
} from 'react';
import { classes, cssProps, msToNum, numToMs } from '~/utils/styles';
import styles from './project.module.css';

const initDelay = 300;

interface ProjectHeaderProps {
  title: string;
  description: string;
  linkLabel?: string;
  url?: string;
  roles?: string[];
  className?: string;
}

export function ProjectHeader({
  title,
  description,
  linkLabel = 'Visit website',
  url,
  roles,
  className,
}: ProjectHeaderProps) {
  return (
    <Section className={classes(styles.header, className)} as="section">
      <div
        className={styles.headerContent}
        style={cssProps({ initDelay: numToMs(initDelay) })}
      >
        <div className={styles.details}>
          <Heading className={styles.title} level={2} as="h1">
            {title}
          </Heading>
          <Text className={styles.description} size="xl" as="p">
            {description}
          </Text>
          {!!url && (
            <Button
              secondary
              iconHoverShift
              className={styles.linkButton}
              icon="chevron-right"
              href={url}
            >
              {linkLabel}
            </Button>
          )}
        </div>
        {!!roles?.length && (
          <ul className={styles.meta}>
            {roles.map((role, index) => (
              <li
                className={styles.metaItem}
                style={cssProps({ delay: numToMs(initDelay + 300 + index * 140) })}
                key={role}
              >
                <Text secondary>{role}</Text>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}

export const ProjectContainer = ({ className, ...rest }: HTMLAttributes<HTMLElement>) => (
  <article className={classes(styles.project, className)} {...rest} />
);

interface ProjectSectionProps extends HTMLAttributes<HTMLElement> {
  light?: boolean;
  padding?: 'both' | 'none' | 'top' | 'bottom';
  fullHeight?: boolean;
  backgroundOverlayOpacity?: number;
  backgroundElement?: ReactNode;
  children?: ReactNode;
}

export const ProjectSection = forwardRef<HTMLElement, ProjectSectionProps>(
  (
    {
      className,
      light,
      padding = 'both',
      fullHeight,
      backgroundOverlayOpacity = 0.9,
      backgroundElement,
      children,
      ...rest
    },
    ref
  ) => (
    <section
      className={classes(styles.section, className)}
      data-light={light}
      data-full-height={fullHeight}
      ref={ref}
      {...rest}
    >
      {!!backgroundElement && (
        <div
          className={styles.sectionBackground}
          style={cssProps({ opacity: backgroundOverlayOpacity })}
        >
          {backgroundElement}
        </div>
      )}
      <Section className={styles.sectionInner} data-padding={padding}>
        {children}
      </Section>
    </section>
  )
);

// Explicitly setting the displayName for forwardRef components
ProjectSection.displayName = 'ProjectSection';

interface ProjectBackgroundProps extends ComponentPropsWithoutRef<typeof Image> {
  opacity?: number;
  className?: string;
}

export const ProjectBackground = ({ opacity = 0.7, className, ...rest }: ProjectBackgroundProps) => {
  const imageRef = useRef<HTMLDivElement>(null);

  useParallax(0.6, (value: number) => {
    if (!imageRef.current) return;
    imageRef.current.style.setProperty('--offset', `${value}px`);
  });

  return (
    <Transition in timeout={msToNum(String(tokens.base.durationM))}>
      {({ visible, nodeRef }: { visible: boolean; nodeRef: React.RefObject<HTMLElement> }) => (
        <div
          className={classes(styles.backgroundImage, className)}
          data-visible={visible}
          ref={nodeRef as React.RefObject<HTMLDivElement>}
        >
          <div className={styles.backgroundImageElement} ref={imageRef}>
            <Image cover alt="" role="presentation" {...rest} />
          </div>
          <div 
            className={styles.backgroundScrim} 
            style={cssProps({ '--opacity': String(opacity) })} 
          />
        </div>
      )}
    </Transition>
  );
};
export const ProjectImage = ({ className, alt, ...rest }: ComponentPropsWithoutRef<typeof Image>) => (
  <div className={classes(styles.image, className)}>
    <Image reveal alt={alt} delay={300} {...rest} />
  </div>
);

interface ProjectSectionContentProps extends HTMLAttributes<HTMLDivElement> {
  width?: 's' | 'm' | 'l' | 'xl' | 'full';
}

export const ProjectSectionContent = ({ 
  className, 
  width = 'l', 
  ...rest 
}: ProjectSectionContentProps) => (
  <div
    className={classes(styles.sectionContent, className)}
    data-width={width}
    {...rest}
  />
);

export const ProjectSectionHeading = ({ 
  className, 
  level = 3, 
  as = 'h2', 
  ...rest 
}: ComponentPropsWithoutRef<typeof Heading>) => (
  <Heading
    className={classes(styles.sectionHeading, className)}
    as={as}
    level={level}
    align="auto"
    {...rest}
  />
);

export const ProjectSectionText = ({ className, ...rest }: ComponentPropsWithoutRef<typeof Text>) => (
  <Text className={classes(styles.sectionText, className)} size="l" as="p" {...rest} />
);

interface ProjectTextRowProps extends HTMLAttributes<HTMLDivElement> {
  center?: boolean;
  stretch?: boolean;
  justify?: 'start' | 'center' | 'end';
  width?: 's' | 'm' | 'l';
  noMargin?: boolean;
  centerMobile?: boolean;
}

export const ProjectTextRow = ({
  center,
  stretch,
  justify = 'center',
  width = 'm',
  noMargin,
  className,
  centerMobile,
  ...rest
}: ProjectTextRowProps) => (
  <div
    className={classes(styles.textRow, className)}
    data-center={center}
    data-stretch={stretch}
    data-center-mobile={centerMobile}
    data-no-margin={noMargin}
    data-width={width}
    data-justify={justify}
    {...rest}
  />
);

interface ProjectSectionColumnsProps extends ProjectSectionContentProps {
  centered?: boolean;
}

export const ProjectSectionColumns = ({ className, centered, ...rest }: ProjectSectionColumnsProps) => (
  <ProjectSectionContent
    className={classes(styles.sectionColumns, className)}
    data-centered={centered}
    {...rest}
  />
);