import moment from 'moment';
import { queryTicketProfitList, submitWithDrawForm, submitNewProfit, deletTcicketProfit, queryTicketProfitListByCondition, getMonthAnalysis } from '../services/ticket/profit';

export default {
  namespace: 'TicketProfitListState',

  state: {
    list: [],
    loading: false,
    withdrawVisible: false,
    withdrawLoading: false,
    addModalVisible: false,
    withdrawNumber: 0.0,
    momentTime: moment(),
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 100,
      currentPage: 1,
    },
    totalMonth: 0,
    amount: 0,
    profit: 0,
  },

  effects: {

    * deleteTicketProfit({ payload }, { put, call }) {
      yield call(deletTcicketProfit, payload.id);
      const response = yield call(queryTicketProfitList);
      yield put({
        type: 'appendList',
        payload: {
          list: Array.isArray(response.data) ? response.data : [],
          total: response.total,
        },
      });
      const analysis = yield call(getMonthAnalysis, payload);
      yield put({
        type: 'changeAnalysis',
        payload: analysis,
      });
    },
    * submitNewProfit({ payload }, { put, call }) {
      yield call(submitNewProfit, { ...payload, extractAmount: 0.0, extractRecords: [] });
      const response = yield call(queryTicketProfitList);
      yield put({
        type: 'appendList',
        payload: {
          list: Array.isArray(response.data) ? response.data : [],
          total: response.total,
        },
      });
      const analysis = yield call(getMonthAnalysis, payload);
      yield put({
        type: 'changeAnalysis',
        payload: analysis,
      });
      yield put({
        type: 'changeAddModalVisibleState',
        payload: false,
      });
    },
    * submitPrincipalLoss({ payload }, { put, call }) {
      yield call(submitWithDrawForm, payload.id, payload);
      const response = yield call(queryTicketProfitList);
      yield put({
        type: 'appendList',
        payload: {
          list: Array.isArray(response.data) ? response.data : [],
          total: response.total,
        },
      });
      const analysis = yield call(getMonthAnalysis, payload);
      yield put({
        type: 'changeAnalysis',
        payload: analysis,
      });
      yield put({
        type: 'changeAddModalVisibleState',
        payload: false,
      });
    },
    * changeWithDraNumberA({ payload }, { put }) {
      yield put({
        type: 'changeWithDrawNumber',
        payload: payload.value,
      });
    },
    * fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryTicketProfitList);
      yield put({
        type: 'appendList',
        payload: {
          list: Array.isArray(response.data) ? response.data : [],
          total: response.total,
        },
      });
      const analysis = yield call(getMonthAnalysis, payload);
      yield put({
        type: 'changeAnalysis',
        payload: analysis,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    * filterList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryTicketProfitListByCondition, payload);
      yield put({
        type: 'appendList',
        payload: {
          list: Array.isArray(response.data) ? response.data : [],
          total: response.total,
        },
      });
      const analysis = yield call(getMonthAnalysis, payload);
      yield put({
        type: 'changeAnalysis',
        payload: analysis,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    * changeWithDrawModal({ payload }, { put }) {
      yield put({
        type: 'changeWithDrawVisible',
        payload: payload.visible,
      });
    },
    * changeAddModalVisible({ payload }, { put }) {
      yield put({
        type: 'changeAddModalVisibleState',
        payload: payload.visible,
      });
      yield put({
        type: 'changeMoment',
        payload: moment(),
      });
    },

    * submitWithDraw({ payload }, { call, put }) {
      yield put({
        type: 'changeWithDrawLoading',
        payload: true,
      });
      yield call(submitWithDrawForm, payload.id, payload);
      const responseList = yield call(queryTicketProfitList);


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
        payload: {
          list: Array.isArray(responseList.data) ? responseList.data : [],
          total: responseList.total,
        },
      });

      const analysis = yield call(getMonthAnalysis, payload);
      yield put({
        type: 'changeAnalysis',
        payload: analysis,
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
        list: action.payload.list,
        pagination: { total: action.payload.total },
      };
    },
    changeWithDrawVisible(state, action) {
      return {
        ...state,
        withdrawVisible: action.payload,
      };
    },
    changeAddModalVisibleState(state, action) {
      return {
        ...state,
        addModalVisible: action.payload,
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
    changeAnalysis(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeMoment(state, action) {
      return {
        ...state,
        momentTime: action.payload,
      };
    },
  },
};
