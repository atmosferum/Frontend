import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Input } from './Input';

export default {
  title: 'Input',
  component: Input,
  argTypes: {
    error: {
      name: 'error',
      type: 'boolean',
      defaultValue: false,
    },
    placeholder: {
      type: 'string',
      defaultValue: 'Плейсхолдер',
    },
    value: {
      type: 'string',
    },
  },
} as ComponentMeta<typeof Input>;

export const Primary: ComponentStory<typeof Input> = (args) => {
  return <Input error={args.error} value={args.value} placeholder={args.placeholder} />;
};
