import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Popover } from './Popover';

export default {
  title: 'RadixPopover',
  component: Popover,
} as ComponentMeta<typeof Popover>;

export const PopoverStory: ComponentStory<typeof Popover> = (args) => {
  const [popoverX, setPopoverX] = useState();
  const [popoverY, setPopoverY] = useState();
  const [popoverOpen, setPopoverOpen] = useState(true);

  function openPopover(e: any) {
    setPopoverX(e.clientX);
    setPopoverY(e.clientY);
    setPopoverOpen(true);
    console.log(e.clientX + ' ' + e.clientY);
  }

  return (
    <>
      <div style={{ background: 'coral', width: '200px', height: '500px' }}></div>
      <Popover x={popoverX} y={popoverY} open={popoverOpen}></Popover>
    </>
  );
};
