import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { DayTimeline } from './DayTimeline';

export default {
  title: 'COMPONENT/DayTimeline',
  component: DayTimeline,
} as ComponentMeta<typeof DayTimeline>;

const Template: ComponentStory<typeof DayTimeline> = (args) => {
  return (
    <>
      <h1>column</h1>
      <div style={{ width: 600, display: 'flex' }}>
        <DayTimeline {...args} />
      </div>
    </>
  );
};
export const Primary = Template.bind({});
