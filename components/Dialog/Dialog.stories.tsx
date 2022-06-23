import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Dialog } from './Dialog';
import { Button } from '../Button';
import { useRef } from '../../../../../../Program Files/JetBrains/WebStorm 2021.3.2/plugins/JavaScriptLanguage/jsLanguageServicesImpl/external/react';

export default {
  title: 'Dialog',
  component: Dialog,
} as ComponentMeta<typeof Dialog>;

export const DialogStory: ComponentStory<typeof Dialog> = (args) => {
  const button = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <Button>Открыть модальное окно</Button>
    </>
  );
};
