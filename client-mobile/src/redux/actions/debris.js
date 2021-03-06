import * as Actions from "../types";
import StatusAction from "./status";
import axios from "axios";

export function getAllDebrisServiceTypes() {
  return async dispatch => {
    dispatch({
      type: Actions.GET_DEBRIS_SERVICES_TYPES.REQUEST
    });
    const res = await axios.get("debrisServiceTypes");
    dispatch({
      type: Actions.GET_DEBRIS_SERVICES_TYPES.SUCCESS,
      payload: res
    });
  };
}

export function getDebrisArticleByRequester() {
  return async dispatch => {
    const res = await axios.get("debrisPosts/requester");
    dispatch({
      type: Actions.GET_DEBRIS_ARTICLE_BY_REQUESTER.SUCCESS,
      payload: res
    });
  };
}

export function createNewArticle(article) {
  return async dispatch => {
    const res = await axios.post("debrisPosts", article);
    dispatch({
      type: Actions.POST_DEBRIS_ARTICLE.SUCCESS,
      payload: res
    });
    dispatch(StatusAction.success("Add success"));
  };
}

export function editArticle(articleId, article) {
  return async dispatch => {
    const res = await axios.put(`debrisPosts/${articleId}`, article);
    dispatch({
      type: Actions.EDIT_DEBRIS_ARTICLE.SUCCESS,
      payload: { data: res, id: articleId }
    });
  };
}

export function getDebrisBidBySupplier() {
  return async dispatch => {
    const res = await axios.get("debrisBids/supplier");
    dispatch({
      type: Actions.GET_DEBRIS_BIDS_BY_SUPPLIER.SUCCESS,
      payload: res
    });
  };
}

//Get debris post detail from bid
export function getDebrisBidDetail(debrisPostId) {
  return async dispatch => {
    dispatch({
      type: Actions.GET_DEBRIS_DETAIL_BY_SUPPLIER.REQUEST
    });
    const res = await axios.get(`debrisPosts/${debrisPostId}`);
    dispatch({
      type: Actions.GET_DEBRIS_DETAIL_BY_SUPPLIER.SUCCESS,
      payload: res
    });
  };
}

export function clearDebrisDetail() {
  return {
    type: Actions.CLEAR_DEBRIS_DETAIL.SUCCESS
  };
}

export function supplierPlaceBid(debrisBids) {
  return async dispatch => {
    const res = await axios.post("debrisBids", debrisBids);
    dispatch({
      type: Actions.SEND_DEBRIS_BIDS.SUCCESS,
      payload: res
    });
  };
}

export function supplierEditBid(bidId, debrisBids) {
  return async dispatch => {
    const res = await axios.put(`debrisBids/${bidId}`, debrisBids);
    dispatch({
      type: Actions.EDIT_DEBRIS_BIDS.SUCCESS,
      payload: { data: res, id: bidId }
    });
  };
}

export function supplierDeleteBid(articleId) {
  return async dispatch => {
    const res = await axios.delete(`debrisBids/${articleId}`);
    dispatch({
      type: Actions.DELETE_DEBRIS_BID.SUCCESS,
      payload: { data: res, id: articleId }
    });
  };
}

export function searchDebris(data) {
  return async dispatch => {
    dispatch({
      type: Actions.SEARCH_DEBRIS.REQUEST
    });
    console.log("check", data);
    const typeId = data.typeId.map(item => `debrisTypeId=${item.id}`);
    const query = typeId.join("&");
    const url = `debrisPosts?offset=0&limit=1000&q=${
      data.keyword
    }&${query}&orderBy=created_time.desc`;
    console.log(url);
    const res = await axios.get(url);
    dispatch({
      type: Actions.SEARCH_DEBRIS.SUCCESS,
      payload: res
    });
  };
}

export function sendDebrisFeedback(feedback) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.SEND_DEBRIS_FEEDBACK.REQUEST
      });
      const res = await axios.post(`debrisFeedbacks`, feedback);
      dispatch({
        type: Actions.SEND_DEBRIS_FEEDBACK.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.SEND_DEBRIS_FEEDBACK.ERROR
      });
    }
  };
}

export function addTypeServices(data) {
  return {
    type: Actions.ADD_TYPE_SERVICES.SUCCESS,
    payload: data
  };
}

export function removeTypeServices(id) {
  return {
    type: Actions.REMOVE_TYPE_SERVICES.SUCCESS,
    payload: id
  };
}

export function clearTypeServices() {
  return {
    type: Actions.CLEAR_TYPE_SERVICES.SUCCESS
  };
}
