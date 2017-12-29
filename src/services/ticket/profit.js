// import { stringify } from 'qs';
import request from '../../utils/request';
import { getUrlParamsByCondition } from '../../utils/utils';

// yanyj
export async function queryTicketProfitList(condition = { page: 1, pageSize: 5 }) {
  // return request('http://localhost:3000/ticket/profits');
  const params = getUrlParamsByCondition(condition);
  return request(`/ticket/profits${params}`);
}

export async function queryTicketProfitListByCondition(condition) {
  // return request('http://localhost:3000/ticket/profits');
  const params = getUrlParamsByCondition(condition);
  return request(`/ticket/profits${params}`);
}

export async function submitWithDrawForm(id, params) {
  return request(`/ticket/profits/${id}`, {
    method: 'PATCH',
    body: params,
  });
}


export async function submitNewProfit(params) {
  return request('/ticket/profits', {
    method: 'POST',
    body: params,
  });
}

export async function getMonthAnalysis() {
  return request('/ticket/analysis/profits/month');
}

export async function deletTcicketProfit(id) {
  return request(`/ticket/profits/${id}`, {
    method: 'DELETE',
  });
}


export async function getAnalysis() {
  return request('/ticket/analysis/profits');
}

export async function getIncomeStat() {
  return request('/ticket/analysis/profits/amount');
}

