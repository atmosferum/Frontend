import React from 'react';
import s from './Copyboard.module.scss';

function Copyboard({ url }: { url: string }) {
  async function copyHandler() {
    await navigator.clipboard.writeText(url);
  }
  return (
    <div className={s.wrapper}>
      <div className={s.url}>
        <p>{url}</p>
      </div>
      <div onClick={copyHandler} className={s.copyClick}>
        <p>copy</p>
      </div>
    </div>
  );
}

export { Copyboard };
