import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { WeekSlider } from './WeekSlider';

export default {
  title: 'WeekSlider',
  component: WeekSlider,
  argTypes: {
    text: {
      type: 'string',
      defaultValue: 'Текущая неделя',
    },
  },
} as ComponentMeta<typeof WeekSlider>;

export const Primary: ComponentStory<typeof WeekSlider> = (args) => {
  return <WeekSlider {...args} />;
};
Primary.args = {
  highlightRight: false,
  highlightLeft: false,
  date: new Date(),
  left: () => {},
  right: () => {},
};
