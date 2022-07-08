import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Popover } from './Popover';
import popoverStyles from './style.module.scss';
export default {
  title: 'RadixPopover',
  component: Popover,
} as ComponentMeta<typeof Popover>;

export const PopoverStory: ComponentStory<typeof Popover> = (args) => {
  return (
    <>
      <div
        className={popoverStyles.trigger}
        style={{ background: 'coral', width: '200px', height: '500px', position: 'relative' }}
      >
        <Popover>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur delectus impedit
          maxime nostrum temporibus voluptates. Corporis ea ex exercitationem facere harum hic,
          illum impedit molestias neque omnis quam temporibus! Architecto.
        </Popover>
      </div>
    </>
  );
};
