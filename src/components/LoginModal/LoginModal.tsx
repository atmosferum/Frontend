import { Dialog } from '../Dialog';
import { Input } from '../Input';
import s from '../../styles/App.module.scss';
import { Button } from '../Button';
import React from 'react';

export function LoginModal(props: any) {
  const { close, isLoginModalOpen, name, loginAndSaveIntervals } = props;
  return (
    <Dialog title="Введите имя" close={close} open={isLoginModalOpen}>
      <br />
      <Input className={s.stretch} {...name.bind} placeholder="Иван Иванов" />
      <br />
      <Button onClick={loginAndSaveIntervals} disabled={!name.value} className={s.stretch}>
        Сохранить
      </Button>
    </Dialog>
  );
}
