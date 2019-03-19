function renderActions(name) {
  return {
    SUCCESS: `${name}_SUCCESS`,
    ERROR: `${name}_ERROR`,
    REQUEST: `${name}_REQUEST`
  };
}

//LOGIN
export const LOGIN_REQUEST = "@@auth/LOGIN_REQUEST";
export const LOGIN_SUCCESS = "@@auth/LOGIN_SUCCESS";
export const LOGIN_FAIL = "@@auth/LOGIN_FAIL";

export const LOGOUT_SUCCESS = "@@auth/LOGOUT_SUCCESS";

//TYPE
export const GET_GENERAL_EQUIPMENT_TYPE = renderActions(
  "@@type/GET_GENERAL_EQUIPMENT_TYPE"
);

//EQUIPMENT
export const LIST_CONTRACTOR_EQUIPMENT = renderActions(
  "@@equip/LIST_CONTRACTOR_EQUIPMENT"
);
export const UPDATE_EQUIPMENT = renderActions("@@equip/UPDATE_EQUIPMENT");
export const ADD_EQUIPMENT = renderActions("@@equip/ADD_EQUIPMENT");
export const REMOVE_EQUIPMENT = renderActions("@@equip/REMOVE_EQUIPMENT");
export const EQUIPMENT_LIST = renderActions("@@equip/EQUIPMENT_LIST");
export const UPDATE_EQUIPMENT_STATUS = renderActions(
  "@@equip/UPDATE_EQUIPMENT_STATUS"
);
export const CLEAR_SEARCH_RESULT = renderActions("@@equip/CLEAR_SEARCH_RESULT");

//UPLOAD IMAGE
export const UPLOAD_IMAGE = renderActions("@@equip/UPLOAD_IMAGE");
export const INSERT_NEW_IMAGE = renderActions("@@equip/INSERT_NEW_IMAGE");
export const GET_IMAGE_BY_ID = renderActions("@@equip/GET_IMAGE_BY_ID");
export const DELETE_IMAGE = renderActions("@@equip/DELETE_IMAGE");
export const CLEAR_IMAGE_LIST = "@@equip/CLEAR_IMAGE_LIST";

//TRANSACTION
export const LIST_SUPPLIER_TRANSACTION = renderActions(
  "@@equip/LIST_SUPPLIER_TRANSACTION"
);
export const LIST_REQUESTER_TRANSACTION = renderActions(
  "@@transaction/LIST_REQUESTER_TRANSACTION"
);
export const UPDATE_TRANSACTION_EQUIPMENT_STATUS = renderActions(
  "@@transaction/UPDATE_TRANSACTION_EQUIPMENT_STATUS"
);
export const SEND_TRANSACTION_REQUEST = renderActions(
  "@@transaction/SEND_REQUEST"
);
export const REQUEST_TRANSACTION = renderActions(
  "@@transaction/REQUEST_TRANSACTION"
);
export const CANCEL_TRANSACTION = renderActions(
  "@@transaction/CANCEL_TRANSACTION"
);
export const CLEAR_SUPPLIER_TRANSACTION_SUCCESS =
  "@@equip/CLEAR_SUPPLIER_TRANSACTION_SUCCESS";
export const GET_ADJUST_TRANSACTION = renderActions(
  "@@transaction/GET_ADJUST_TRANSACTION"
);
export const SEND_ADJUST_TRANSACTION = renderActions(
  "@@transaction/SEND_ADJUST_TRANSACTION"
);
export const REQUEST_ADJUST_TRANSACTION = renderActions(
  "@@transaction/REQUEST_ADJUST_TRANSACTION"
);
export const DELETE_ADJUST_TRANSACTION = renderActions(
  "@@transaction/DELETE_ADJUST_TRANSACTION"
);
export const LIST_SUPPLIER_MATERIAL_TRANSACTION = renderActions(
  "@@transaction/LIST_SUPPLIER_MATERIAL_TRANSACTION"
);
export const LIST_REQUESTER_MATERIAL_TRANSACTION = renderActions(
  "@@transaction/LIST_REQUESTER_MATERIAL_TRANSACTION"
);
export const SEND_MATERIAL_TRANSACTION_REQUEST = renderActions(
  "@@transaction/SEND_MATERIAL_TRANSACTION_REQUEST"
);
export const CHANGE_MATERIAL_TRANSACTION_REQUEST = renderActions(
  "@@transaction/CHANGE_MATERIAL_TRANSACTION_REQUEST"
);

//SEARCH EQUIPMENT
export const SEARCH_EQUIPMENT = renderActions("@@equip/SEARCH_EQUIPMENT");
export const SEARCH_FILTER_EQUIPMENT = renderActions(
  "@@equip/SEARCH_FILTER_EQUIPMENT"
);

//CART
export const GET_LIST_CART = renderActions("@@cart/GET_LIST_CART");
export const ADD_ITEM_CART = renderActions("@@cart/ADD_ITEM_CART");
export const UPDATE_ITEM_CART = renderActions("@@cart/UPDATE_ITEM_CART");
export const REMOVE_ITEM_CART = renderActions("@@cart/REMOVE_ITEM_CART");
export const REMOVE_ALL_ITEM = renderActions("@@cart/REMOVE_ALL_ITEM");
export const CART_CHECK_OUT = renderActions("@@cart/CART_CHECK_OUT");

// STATUS
export const STATUS_LOADING = "@@status/LOADING";
export const STATUS_SUCCESS = "@@status/SUCCESS";
export const STATUS_ERROR = "@@status/ERROR";

//CONTRACTOR
export const GET_CONTRACTOR = renderActions("@@contractor/GET_CONTRACTOR");
export const CONTRACTOR_REGISTER = renderActions(
  "@@contractor/CONTRACTOR_REGISTER"
);
export const UPDATE_CONTRACTOR_DETAIL = renderActions(
  "@@contractor/UPDATE_CONTRACTOR_DETAIL"
);
export const GET_CONSTRUCTION_LIST = renderActions(
  "@@contractor/GET_CONSTRUCTION_LIST"
);
export const CREATE_CONSTRUCTION = renderActions(
  "@@contractor/CREATE_CONSTRUCTION"
);
export const UPDATE_CONSTRUCTION = renderActions(
  "@@contractor/UPDATE_CONSTRUCTION"
);
export const DELETE_CONSTRUCTION = renderActions(
  "@@contractor/DELETE_CONSTRUCTION"
);
export const GET_LIST_FEEDBACK = renderActions(
  "@@contractor/GET_LIST_FEEDBACK"
);
export const CREATE_NEW_FEEDBACK = renderActions(
  "@@contractor/CREATE_NEW_FEEDBACK"
);
export const LIST_FEEDBACK_TYPES = renderActions(
  "@@contractor/LIST_FEEDBACK_TYPES"
);

//NOTIFICATION
export const INSERT_NOTIFICATION_TOKEN = renderActions(
  "@@contractor/INSERT_NOTIFICATION_TOKEN"
);
export const GET_ALL_NOTIFICATION = renderActions(
  "@@contractor/GET_ALL_NOTIFICATION"
);
export const READ_NOTIFICATION = renderActions(
  "@@contractor/READ_NOTIFICATION"
);
export const DELETE_NOTIFICATION_MESSAGE = renderActions(
  "@@contractor/DELETE_NOTIFICATION_MESSAGE"
);
export const DELETE_NOTIFICATION_TOKEN = renderActions(
  "@@contractor/DELETE_NOTIFICATION_TOKEN"
);
export const ALLOW_PUSH_NOTIFICATION = renderActions(
  "@@contractor/ALLOW_PUSH_NOTIFICATION"
);

//MATERIAL
export const GET_GENERAL_MATERIAL_TYPE = renderActions(
  "@@material/GET_GENERAL_MATERIAL_TYPE"
);
export const GET_MATERIAL_TYPE = renderActions("@@material/GET_MATERIAL_TYPE");
export const GET_MATERIAL_DETAIL = renderActions(
  "@@material/GET_MATERIAL_DETAIL"
);
export const SEARCH_MATERIAL = renderActions("@@material/SEARCH_MATERIAL");
export const ADD_NEW_MATERIAL = renderActions("@@material/ADD_NEW_MATERIAL");
export const UPDATE_MATERIAL_DETAIl = renderActions(
  "@@material/UPDATE_MATERIAL_DETAIl"
);
export const GET_MATERIAL_LIST_BY_CONTRACTOR = renderActions(
  "@@material/GET_MATERIAL_LIST_BY_CONTRACTOR"
);
