import React from 'react';
import s from './ReloadButton.module.scss';
// @ts-ignore
import { ReactComponent as ReloadSvg } from './reload-svgrepo-com.svg';
import classnames from 'classnames/bind';
const cx = classnames.bind(s);
interface Props {
  className?: string;
  onClick?: () => any;
  isLoading: boolean;
}
function ReloadButton(props: Props) {
  const { onClick, isLoading, className } = props;
  return (
    <div style={{ margin: '2px 5px 0 0' }}>
      <ReloadSvg onClick={onClick} className={cx('reloadSvg', isLoading && '--spin', className)} />
    </div>
  );
}

export default ReloadButton;
