import { INITIAL_STATE } from '../../common/app-const';
import { authConstants } from '../_constants';

const authentication = (state = INITIAL_STATE.authentication, action) => {
  switch (action.type) {
    case authConstants.LOGIN_SUCCESS:
      return {
        isAuthenticated: true,
        user: action.user
      };

    case authConstants.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        user: {}
      };

    case authConstants.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        user: {},
        error: action.error
      };

    case authConstants.LOGOUT:
      return {};

    case authConstants.LOAD_USER_SUCCESS:
      return {
        isAuthenticated: true,
        user: action.user
      };

    case authConstants.LOAD_USER_FAILURE:
      return {};

    case authConstants.LOGIN_MODAL_SHOW:
      return {
        ...state,
        isShowLoginModal: true
      }

    case authConstants.LOGIN_MODAL_HIDE:
      return {
        ...state,
        isShowLoginModal: false
      };

    case authConstants.LOGIN_MODAL_TOGGLE:
      return {
        ...state,
        isShowLoginModal: !state.isShowLoginModal
      };

    case authConstants.ADD_NOTIFICATIONS_COUNT:
      state.user.contractor.totalUnreadNotifications++;

      return {
        ...state
      };

    case authConstants.SET_NOTIFICATIONS_COUNT:
      state.user.contractor.totalUnreadNotifications = action.totalUnreadNotifications;

      return {
        ...state
      };

    case authConstants.MIN_NOTIFICATIONS_COUNT:
      state.user.contractor.totalUnreadNotifications--;

      return {
        ...state
      };

    default:
      return state;
  }
};

export default authentication;
