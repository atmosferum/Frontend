import { SetStateAction, useState } from 'react';

export function useInput(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  function onChange(event: { target: { value: SetStateAction<string> } }) {
    setValue(event.target.value);
  }
  function clear() {
    setValue('');
  }
  return {
    bind: { value, onChange },
    value,
    clear,
    setValue,
  };
}
