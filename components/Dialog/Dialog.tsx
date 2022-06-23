import {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
  DialogProps as RadixDialogProps,
} from '@radix-ui/react-dialog';
import styles from './style.module.scss';
import cn from 'classnames/bind';
import { ReactNode } from 'react';
import { X } from 'react-feather';
const cx = cn.bind(styles);

interface DialogProps extends RadixDialogProps {
  children: ReactNode;
  trigger?: ReactNode;
  close?: () => any;
}

export function Dialog(props: DialogProps) {
  const { close, children, trigger, ...restProps } = props;

  return (
    <Root {...restProps}>
      <Trigger asChild>{trigger}</Trigger>
      <Portal>
        <Content className={cx('content')}>
          {children}
          <Close onClick={close} className={cx('close')}>
            <X />
          </Close>
        </Content>
        <Overlay onClick={close} className={cx('overlay')} />
      </Portal>
    </Root>
  );
}
