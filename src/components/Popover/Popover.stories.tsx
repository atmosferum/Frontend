import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from '../Button';
import { Input } from '../Input';

export default {
  title: 'Popover',
  component: Popover,
} as ComponentMeta<typeof Popover>;

export const PopoverStory: ComponentStory<typeof Popover> = (args) => {
  return (
    <>
      <Popover trigger={<Button>Открыть Popover</Button>}>
        {/* <Button>Сохранить</Button>
            <Input></Input> */}
      </Popover>
    </>
  );
};
