import axios from "axios";
import StatusAction from "./status";
import * as Actions from "../types";

export function listTransactionBySupplier(contractorId) {
  return async dispatch => {
    dispatch({
      type: Actions.LIST_SUPPLIER_TRANSACTION.REQUEST
    });
    try {
      const res = await axios.get(`transactions/supplier/${contractorId}`);
      dispatch({
        type: Actions.LIST_SUPPLIER_TRANSACTION.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.LIST_SUPPLIER_TRANSACTION.ERROR
      });
    }
  };
}

export function listTransactionByRequester(contractorId) {
  return async dispatch => {
    dispatch({
      type: Actions.LIST_REQUESTER_TRANSACTION.REQUEST
    });
    try {
      const res = await axios.get(`transactions/requester/${contractorId}`);
      dispatch({
        type: Actions.LIST_REQUESTER_TRANSACTION.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.LIST_REQUESTER_TRANSACTION.ERROR
      });
    }
  };
}

export function sendTransactionRequest(transaction) {
  return async dispatch => {
    const res = await axios.post(`transactions`, transaction);
    dispatch({
      type: Actions.SEND_TRANSACTION_REQUEST.SUCCESS,
      payload: res
    });
    dispatch(StatusAction.success("Send success"));
  };
}

export function requestTransaction(id, transactionStatus) {
  return async dispatch => {
    try {
      dispatch({ type: Actions.REQUEST_TRANSACTION.REQUEST });
      const res = await axios.put(`transactions/${id}`, transactionStatus);
      dispatch({
        type: Actions.REQUEST_TRANSACTION.SUCCESS,
        payload: { data: res, id: id }
      });
      // dispatch(StatusAction.success("Request success"));
    } catch (error) {
      dispatch({ type: Actions.REQUEST_TRANSACTION.ERROR });
    }
  };
}
export function getAdjustTransaction(transactionId) {
  return async dispatch => {
    dispatch({
      type: Actions.GET_ADJUST_TRANSACTION.REQUEST
    });
    const res = await axios.get(
      `transactions/${transactionId}/adjustDateRequests`
    );
    dispatch({
      type: Actions.GET_ADJUST_TRANSACTION.SUCCESS,
      payload: res
    });
  };
}

export function sendAdjustTransaction(transactionId, date) {
  return async dispatch => {
    dispatch({
      type: Actions.SEND_ADJUST_TRANSACTION.REQUEST
    });
    const res = await axios.post(
      `transactions/${transactionId}/adjustDateRequests`,
      date
    );
    dispatch({
      type: Actions.SEND_ADJUST_TRANSACTION.SUCCESS,
      payload: { data: res, id: transactionId }
    });
  };
}

export function requestAdjustTransaction(transactionId, status) {
  return async dispatch => {
    dispatch({
      type: Actions.REQUEST_ADJUST_TRANSACTION.REQUEST
    });
    const res = await axios.put(
      `transactions/${transactionId}/adjustDateRequests`,
      status
    );
    dispatch({
      type: Actions.REQUEST_ADJUST_TRANSACTION.SUCCESS,
      payload: { data: res, id: transactionId }
    });
  };
}

export function deleteAdjustTransaction(transactionId) {
  return async dispatch => {
    dispatch({
      type: Actions.DELETE_ADJUST_TRANSACTION.REQUEST
    });
    const res = await axios.delete(
      `transactions/${transactionId}/adjustDateRequests`
    );
    dispatch({
      type: Actions.DELETE_ADJUST_TRANSACTION.SUCCESS,
      payload: { data: res, id: transactionId }
    });
  };
}

export function cancelTransaction(id) {
  return async dispatch => {
    const res = await axios.delete(`transactions/${id}`);
    dispatch({
      type: Actions.CANCEL_TRANSACTION.SUCCESS,
      payload: { id }
    });
    dispatch(StatusAction.success("Send success"));
  };
}

export function clearSupplierTransactionList() {
  return {
    type: Actions.CLEAR_SUPPLIER_TRANSACTION_SUCCESS
  };
}

export function listMaterialTransactionBySupplier(supplierId) {
  return async dispatch => {
    dispatch({
      type: Actions.LIST_SUPPLIER_MATERIAL_TRANSACTION.REQUEST
    });
    try {
      const res = await axios.get(
        `materialTransactions/supplier/${supplierId}`
      );
      dispatch({
        type: Actions.LIST_SUPPLIER_MATERIAL_TRANSACTION.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.LIST_SUPPLIER_MATERIAL_TRANSACTION.ERROR
      });
    }
  };
}

export function listMaterialTransactionByRequester(requesterId) {
  return async dispatch => {
    dispatch({
      type: Actions.LIST_REQUESTER_MATERIAL_TRANSACTION.REQUEST
    });
    try {
      const res = await axios.get(
        `materialTransactions/requester/${requesterId}`
      );
      dispatch({
        type: Actions.LIST_REQUESTER_MATERIAL_TRANSACTION.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.LIST_REQUESTER_MATERIAL_TRANSACTION.ERROR
      });
    }
  };
}

export function requestMaterialTransaction(material) {
  return async dispatch => {
    dispatch({
      type: Actions.SEND_MATERIAL_TRANSACTION_REQUEST.REQUEST
    });
    const res = await axios.post(`materialTransactions`, material);
    dispatch({
      type: Actions.SEND_MATERIAL_TRANSACTION_REQUEST.SUCCESS,
      payload: res
    });
  };
}

export function changeMaterialTransactionRequest(requestId, request) {
  return async dispatch => {
    dispatch({
      type: Actions.CHANGE_MATERIAL_TRANSACTION_REQUEST.REQUEST
    });
    const res = await axios.put(`materialTransactions/${requestId}`, request);
    dispatch({
      type: Actions.CHANGE_MATERIAL_TRANSACTION_REQUEST.SUCCESS,
      payload: { data: res, id: requestId }
    });
  };
}