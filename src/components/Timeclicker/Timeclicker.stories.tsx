import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Timeclicker from './Timeclicker';
export default {
  title: 'Timeclicker',
  component: Timeclicker,
} as ComponentMeta<typeof Timeclicker>;

export const Primary: ComponentStory<typeof Timeclicker> = (args) => {
  return (
    <div style={{ width: '340px' }}>
      <Timeclicker />
    </div>
  );
};
