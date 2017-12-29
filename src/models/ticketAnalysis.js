import moment from 'moment';
import {getAnalysis, getIncomeStat} from "../services/ticket/profit";
export default {
  namespace: 'ticketAnalysis',


  state: {
    selectType: 'year', // 本年收益趋势分析Select 类型
    incomeStat: { // 本年收益统计
      year: 0.0,  // 本年收益
      month: 0.0,  // 本月收益
      week: 0.0,  // 本周收益
    },
    incomeTrendYear: { //本年
      amount: 0.0, // 总额
      average: 0.0, //平均值
      // data:[{ // 图标数据
      //   x: 0, //日期
      //   y: 0.0 //时间
      // }]
      data: [{x:0,y:0}]
    },
    incomeTrendMonth: { //本月
      amount: 0.0, // 总额
      average: 0.0, //平均值
      // data:[{ // 图标数据
      //   x: 0, //日期
      //   y: 0.0 //时间
      // }]
      data: [{x:0,y:0}]
    },
    incomeTrendDate: { //本日
      amount: 0.0, // 总额
      average: 0.0, //平均值
      // data:[{ // 图标数据
      //   x: 0, //日期
      //   y: 0.0 //时间
      // }]
      data: [{x:0,y:0}]
    }
  },

  effects: {
    *getAnalysis({ payload }, { put, call }){
      const response = yield call(getAnalysis);
      const income = yield call(getIncomeStat);
      yield put({
        type: 'changeState',
        payload: response,
      });

      yield put({
        type: 'changeIncome',
        payload: income,
      });
    }

  },
  reducers: {

    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeIncome(state, { payload }) {
      return {
        ...state,
        incomeStat: payload,
      };
    },
  }

}
