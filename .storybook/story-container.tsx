import React, { CSSProperties, ReactNode } from 'react';
import './story-container.css';

interface StoryContainerProps {
    padding?: number;
    stretch?: boolean;
    gutter?: number;
    vertical?: boolean;
    children: ReactNode;
    style?: CSSProperties;
}

export const StoryContainer: React.FC<StoryContainerProps> = ({
                                                                  padding = 32,
                                                                  stretch,
                                                                  gutter = 32,
                                                                  vertical,
                                                                  children,
                                                                  style,
                                                              }) => (
    <div
        className="storyContainer"
        style={{
            padding,
            gap: gutter,
            flexDirection: vertical ? 'column' : 'row',
            alignItems: stretch ? 'stretch' : 'flex-start',
            justifyContent: stretch ? 'stretch' : 'flex-start',
            ...style,
        }}
    >
        {children}
    </div>
);
