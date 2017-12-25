import { queryFakeList } from '../services/api';

export default {
  namespace: 'list',

  state: {
    list: [],
    loading: false,
    test: 2,
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response.list) ? response.list : [],
      });
      yield put({
        type: 'changeTest',
        payload: response.test,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
    changeTest(state, action) {
      return {
        ...state,
        test: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
