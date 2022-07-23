import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useRef, useState } from 'react';
import { Calendar } from './Calendar';
import { Interval } from '../../types';
import { getDateOfMonday } from '../../api';

export default {
  title: 'COMPONENT/Calendar',
  component: Calendar,
} as ComponentMeta<typeof Calendar>;

// resultsIntervals: Interval[];
// adminIntervals: Interval[];
// myIntervals: Interval[];
// dateOfMonday: Date;
// draggingElement: DraggingElement;
// setIntervals: SetStateAction<any>;
// isAdmin?: boolean;
// isResults?: boolean;

const Template: ComponentStory<typeof Calendar> = (args) => {
  const [intervals, setIntervals] = useState<Array<Interval>>([]);
  const [adminIntervals, setAdminIntervals] = useState<Array<Interval>>(args.adminIntervals);
  const draggingElement = useRef(null);

  return (
    <>
      <Calendar
        {...args}
        adminIntervals={adminIntervals}
        setIntervals={args.isAdmin ? setAdminIntervals : setIntervals}
        draggingElement={draggingElement}
        myIntervals={intervals}
      />
      <h1>Hello World</h1>
    </>
  );
};
export const Primary = Template.bind({});
const now = getDateOfMonday(new Date());
Primary.args = {};
