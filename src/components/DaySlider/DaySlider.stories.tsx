import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DaySlider } from './DaySlider';
import { MS_IN_DAY } from '../../consts';

export default {
  title: 'DaySlider',
  component: DaySlider,
} as ComponentMeta<typeof DaySlider>;

export const Primary: ComponentStory<typeof DaySlider> = (args) => {
  const [date, setDate] = useState(new Date());
  function previousWeek() {
    setDate(new Date(+date - MS_IN_DAY * 1));
  }

  function nextWeek() {
    setDate(new Date(+date + MS_IN_DAY * 1));
  }
  return (
    <div style={{ width: '350px', marginLeft: 'auto', marginRight: 'auto' }}>
      <DaySlider {...args} date={date} left={previousWeek} right={nextWeek} />
    </div>
  );
};
