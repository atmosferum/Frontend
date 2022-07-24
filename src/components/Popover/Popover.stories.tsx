import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Popover } from './Popover';
import popoverStyles from './Popover.module.scss';
export default {
  title: 'RadixPopover',
  component: Popover,
} as ComponentMeta<typeof Popover>;

export const PopoverStory: ComponentStory<typeof Popover> = (args) => {
  const [y, setY] = useState(0);
  function mouseEnterHandler(e: any) {
    const bounds = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - bounds.top;
    setY(y);
  }
  return (
    <>
      <div
        onMouseEnter={mouseEnterHandler}
        className={popoverStyles.trigger}
        style={{
          background: 'coral',
          width: '200px',
          height: '500px',
          position: 'relative',
          top: 300,
        }}
      >
        <Popover y={y}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur delectus impedit
          maxime nostrum temporibus voluptates. Corporis ea ex exercitationem facere harum hic,
          illum impedit molestias neque omnis quam temporibus! Architecto.
        </Popover>
      </div>
      <div
        onMouseEnter={mouseEnterHandler}
        className={popoverStyles.trigger}
        style={{
          background: 'coral',
          width: '200px',
          height: '500px',
          position: 'relative',
          top: 300,
        }}
      >
        <Popover y={y}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur delectus impedit
          maxime nostrum temporibus voluptates. Corporis ea ex exercitationem facere harum hic,
          illum impedit molestias neque omnis quam temporibus! Architecto.
        </Popover>
      </div>
    </>
  );
};
