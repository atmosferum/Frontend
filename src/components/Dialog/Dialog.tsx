import {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Close,
  DialogProps as RadixDialogProps,
} from '@radix-ui/react-dialog';
import styles from './Dialog.module.scss';
import cn from 'classnames/bind';
import React, { ReactNode } from 'react';
import { X } from 'react-feather';
const cx = cn.bind(styles);

interface DialogProps extends RadixDialogProps {
  children: ReactNode;
  trigger?: ReactNode;
  close?: () => any;
  title?: string;
}

export function Dialog(props: DialogProps) {
  const { close, children, trigger, title, ...restProps } = props;
  return (
    <>
      {restProps.open && (
        <Root {...restProps}>
          <Trigger asChild>{trigger}</Trigger>
          <Portal>
            <Content className={cx('content')}>
              {title && <div className={cx('modalTitle')}>{title}</div>}
              {children}
              <Close onClick={close} className={cx('close')}>
                <X />
              </Close>
            </Content>
            <Overlay onClick={close} className={cx('overlay')} />
          </Portal>
        </Root>
      )}
    </>
  );
}
