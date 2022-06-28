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
      <input
        type="text"
        value={url}
        style={{ height: 0, position: 'absolute', left: 100000000 }}
        ref={ref}
      />
      <div className={s.urlWrapper}>
        <p>{url}</p>
      </div>
      <div onClick={copyHandler} className={s.copyClick}>
        <p>Copy</p>
      </div>
    </div>
  );
}

export { Copyboard };
