import axios from "axios";
import StatusAction from "./status";
import * as Actions from "../types";

export function listTransactionBySupplierId(id) {
  return async dispatch => {
    const res = await axios.get(`transactions/supplier/${id}`);
    dispatch({
      type: Actions.LIST_SUPPLIER_TRANSACTION_SUCCESS,
      payload: res.data
    });
  };
}

export function getTransactionDetail(id) {
  return async dispatch => {
    const res = await axios.get(`transactions/${id}`);
    dispatch({
      type: Actions.GET_TRANSACTION_DETAIL_SUCCESS,
      payload: res.data
    });
  };
}

export function sendTransactionRequest(transaction) {
  return async dispatch => {
    try {
      const res = await axios.post(`transactions`, transaction);
      dispatch({
        type: Actions.SEND_TRANSACTION_REQUEST_SUCCESS,
        payload: res.data
      });
    } catch (error) {
      StatusAction.error("Send not successful");
    }
  };
}

export function requestTransaction(id, transactionStatus) {
  return async dispatch => {
    const res = await axios.put(`transactions/${id}`, transactionStatus);
    dispatch({
      type: Actions.REQUEST_TRANSACTION_SUCCESS,
      payload: res.data
    });
  };
}

export function cancelTransaction(id) {
  return async dispatch => {
    const res = await axios.post(`transactions/${id}`);
    dispatch({
      type: Actions.CANCEL_TRANSACTION_SUCCESS,
      payload: res.data
    });
  };
}

export function clearTransactionDetail() {
  return {
    type: Actions.CLEAR_TRANSACTION_DETAIL
  };
}

export function clearSupplierTransactionList() {
  return {
    type: Actions.CLEAR_SUPPLIER_TRANSACTION_SUCCESS
  };
}
