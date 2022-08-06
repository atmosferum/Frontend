import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ParticipantsLine from './ParticipantsLine';

export default {
  title: 'COMPONENT/ParticipantsLine',
  component: ParticipantsLine,
} as ComponentMeta<typeof ParticipantsLine>;

const Template: ComponentStory<typeof ParticipantsLine> = (args) => {
  return <ParticipantsLine {...args} />;
};
export const Primary = Template.bind({});
Primary.args = {
  participants: [
    {
      name: 'fedor',
      id: '3',
      isAdmin: false,
      isCurrentUser: false,
    },
    {
      name: 'макар',
      id: '8',
      isAdmin: false,
      isCurrentUser: false,
    },
    {
      name: 'Дима',
      id: '4',
      isAdmin: false,
      isCurrentUser: false,
    },
    {
      name: 'Иван Иванович',
      id: '5',
      isAdmin: false,
      isCurrentUser: false,
    },
    {
      name: 'fedor',
      id: '6',
      isAdmin: false,
      isCurrentUser: false,
    },
    {
      name: 'Петр Алексеевич',
      id: '7',
      isAdmin: false,
      isCurrentUser: false,
    },
    // {
    //     name:"fedor",
    //     id:'7',
    //     isAdmin:false,
    //     isCurrentUser:false
    // },
    // {
    //     name:"fedor",
    //     id:'7',
    //     isAdmin:false,
    //     isCurrentUser:false
    // },
    // {
    //     name:"Иван Иванович",
    //     id:'7',
    //     isAdmin:false,
    //     isCurrentUser:false
    // }
  ],
};
