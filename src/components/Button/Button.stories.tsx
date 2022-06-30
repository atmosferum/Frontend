import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from './';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    variant: {
      name: 'Variant',
      options: ['primary', 'secondary', 'ghost'],
      control: {
        type: 'select',
      },
    },
    disabled: {
      name: 'Is disabled',
      type: 'boolean',
      defaultValue: false,
    },
    loading: {
      name: 'Is loading',
      type: 'boolean',
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = (args) => {
  return (
    <Button variant={args.variant} disabled={args.disabled} loading={args.loading}>
      Сохранить
    </Button>
  );
};
