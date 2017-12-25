import {queryTicketProfitList, submitWithDrawForm} from '../services/api';

export default {
  namespace: 'TicketProfitListState',

  state: {
    list: [],
    loading: false,
    withdrawVisible: false,
    withdrawLoading: false,
    withdrawNumber: 0.0,
  },

  effects: {
    *changeWithDraNumberA({ payload }, { put }) {
      console.log(payload);

      yield put({
        type: 'changeWithDrawNumber',
        payload: payload.value,
      });
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryTicketProfitList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *changeWithDrawModal({ payload }, { put }) {
      yield put({
        type: 'changeWithDrawVisible',
        payload: payload.visible,
      });
    },

    *submitWithDraw({ payload }, { call, put }) {
      yield put({
        type: 'changeWithDrawLoading',
        payload: true,
      });
      console.log(payload);
      let response = yield call(submitWithDrawForm, payload.id, payload);
      const responseList = yield call(queryTicketProfitList, payload);
      yield put({
        type: 'changeWithDrawLoading',
        payload: false,
      });
      yield put({
        type: 'changeWithDraNumber',
        payload: 0.0,
      });
      yield put({
        type: 'appendList',
        payload: Array.isArray(responseList) ? responseList : [],
      });

      yield put({
        type: 'changeWithDrawVisible',
        payload: false,
      });
    },
  },

  reducers: {
    appendList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeWithDrawVisible(state, action) {
      return {
        ...state,
        withdrawVisible: action.payload,
      };
    },
    changeWithDrawLoading(state, action) {
      return {
        ...state,
        withdrawLoading: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeWithDrawNumber(state, action) {
      return {
        ...state,
        withdrawNumber: action.payload,
      };
    },
  },
};
