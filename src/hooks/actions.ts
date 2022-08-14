import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  postEventThunk,
  storeActions,
  getAllIntervalsThunk,
  setResultThunk,
  getCurrentUserThunk,
  login,
  goToResultsThunk,
  loginAndSaveIntervals,
  saveIntervals,
  initState,
} from '../store/store.slice';

const actions = {
  ...storeActions,
  postEventThunk,
  setResultThunk,
  getCurrentUserThunk,
  login,
  loginAndSaveIntervals,
  getAllIntervalsThunk,
  saveIntervals,
  goToResultsThunk,
  initState,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
