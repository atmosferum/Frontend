import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import s from '../App.module.scss';
import { Button } from '../../components/Button';
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
