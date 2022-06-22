import { Root, Trigger, Portal, Overlay, Content, Title, Description, Close } from '@radix-ui/react-dialog';
import styles from './style.module.scss'
import cn from 'classnames/bind'
import { ReactNode } from 'react';
import { X } from 'react-feather'
const cx = cn.bind(styles)

interface DialogProps {
    children: ReactNode,
    trigger: ReactNode
}

export function Dialog(props: DialogProps) {
    const {
        children,
        trigger
    } = props

    return <Root>
        <Trigger asChild>
            {trigger}
        </Trigger>
        <Portal>
            <Content className={cx('content')}>
                {children}
                <Close className={cx('close')}><X/></Close>
            </Content>
            <Overlay className={cx('overlay')} />
        </Portal>
    </Root>
};
