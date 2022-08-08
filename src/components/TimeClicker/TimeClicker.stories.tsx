import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import TimeClicker from './TimeClicker';
export default {
  title: 'TimeClicker',
  component: TimeClicker,
} as ComponentMeta<typeof TimeClicker>;

export const Primary: ComponentStory<typeof TimeClicker> = (args) => {
  return (
    <div style={{ width: '340px' }}>
      <TimeClicker />
    </div>
  );
};
