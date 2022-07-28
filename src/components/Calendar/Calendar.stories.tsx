import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useRef, useState } from 'react';
import { Calendar } from './Calendar';
import { Interval } from '../../types';
import { getDateOfMonday } from '../../dateUtils';

export default {
  title: 'COMPONENT/Calendar',
  component: Calendar,
} as ComponentMeta<typeof Calendar>;

const Template: ComponentStory<typeof Calendar> = (args) => {
  const [intervals, setIntervals] = useState<Array<Interval>>([]);
  const [adminIntervals, setAdminIntervals] = useState<Array<Interval>>();
  const draggingElement = useRef(null);

  return (
    <>
      <Calendar />
      <h1>Hello World</h1>
    </>
  );
};
export const Primary = Template.bind({});
const now = getDateOfMonday(new Date());
Primary.args = {};
