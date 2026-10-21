import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryContainer } from '../../../.storybook/story-container';
import { Heading } from './heading';

const meta = {
  component: Heading,
  args: { children: 'Heading' },
  argTypes: {
    level: { control: { type: 'range', min: 1, max: 5 } },
  },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Each story varies one prop; Controls apply the rest to every heading
export const Levels: Story = {
  argTypes: { level: { control: false } },
  render: args => (
    <StoryContainer vertical>
      {[1, 2, 3, 4, 5].map(level => (
        <Heading key={level} {...args} level={level}>{`Level ${level}`}</Heading>
      ))}
    </StoryContainer>
  ),
};

export const Weights: Story = {
  args: { level: 3 },
  argTypes: { weight: { control: false } },
  render: args => (
    <StoryContainer vertical>
      <Heading {...args} weight="light">Light</Heading>
      <Heading {...args} weight="regular">Regular</Heading>
      <Heading {...args} weight="medium">Medium</Heading>
      <Heading {...args} weight="bold">Bold</Heading>
    </StoryContainer>
  ),
};

export const Alignment: Story = {
  args: { level: 3 },
  argTypes: { align: { control: false } },
  render: args => (
    <StoryContainer vertical stretch>
      <Heading {...args} align="start">Start</Heading>
      <Heading {...args} align="center">Center</Heading>
      <Heading {...args} align="right">Right</Heading>
    </StoryContainer>
  ),
};
