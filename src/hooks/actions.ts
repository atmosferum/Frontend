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
import { deleteInterval } from '../store/intervalsActions';

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
  deleteInterval,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
