import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { storeActions } from '../store/store.slice';

const actions = {
  ...storeActions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
