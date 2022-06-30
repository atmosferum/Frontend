import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Dialog } from './Dialog';
import { Button } from '../Button';
import { Input } from '../Input';

export default {
  title: 'Dialog',
  component: Dialog,
} as ComponentMeta<typeof Dialog>;

export const DialogStory: ComponentStory<typeof Dialog> = (args) => {
  return (
    <>
      <Dialog trigger={<Button>Создать</Button>}>
        <Input placeholder="введите имя"></Input>
        <br />
        <Button>Сохранить</Button>
      </Dialog>
    </>
  );
};
