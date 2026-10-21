import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';

const meta = {
  component: Button,
  args: { children: 'Button' },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { secondary: true },
};
