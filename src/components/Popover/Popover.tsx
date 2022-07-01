import React, { ReactNode } from 'react';
import {
  Root,
  Trigger,
  Content,
  Close,
  Arrow,
  PopoverProps as RadixPopoverProps,
} from '@radix-ui/react-popover';
import { Button } from '../Button';

interface PopoverProps extends RadixPopoverProps {
  children: ReactNode;
  trigger: ReactNode;
}

export function Popover(props: PopoverProps) {
  const { children, trigger, ...restProps } = props;

  return (
    <Root>
      <Trigger asChild>{trigger}</Trigger>
      <Content>
        {children}
        <Close />
        <Arrow />
      </Content>
    </Root>
  );
}
