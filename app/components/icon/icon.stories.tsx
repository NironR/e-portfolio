import { Icon } from '~/components/icon';
import manifest from '~/components/icon/manifest.json';
import { StoryContainer } from '../../../.storybook/';

export default {
    title: 'Icon',
};

export const Icons = () => {
    return (
        <StoryContainer>
            {Object.keys(manifest).map(key => (
                <Icon key={key} icon={key} />
            ))}
        </StoryContainer>
    );
};
