import React, { useRef } from 'react';
import s from './Copyboard.module.scss';

function Copyboard({ url }: { url: string }) {
  const ref = useRef<HTMLInputElement | null>(null);
  async function copyHandler() {
    ref.current!.select();
    document.execCommand('copy');
  }
  return (
    <div className={s.wrapper}>
      <div className={s.urlWrapper}>
        <input type="text" value={url} ref={ref}></input>
      </div>
      <div onClick={copyHandler} className={s.copyClick}>
        <p>Copy</p>
      </div>
    </div>
  );
}

export { Copyboard };
