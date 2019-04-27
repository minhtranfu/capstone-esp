import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';

import Header from './layout/Header';
import SubHeader from './layout/SubHeader';
import Footer from './layout/Footer';
import Routes from './modules/Routes';
import LoginModal from './modules/login/LoginModal';
import NotificationRoot from './layout/NotificationRoot';

import { authActions } from '../redux/actions';

import PageLoader from './common/PageLoader';

function App({ loadUserFromToken, authenticating, isAuthenticated }) {

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  });

  useEffect(() => {
    loadUserFromToken();
  }, []);

  const { i18n } = useTranslation();

  const _changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  // shouldComponentUpdate(nextProps) {
  //   const { location, isAuthenticated } = this.props;

  //   if (location !== nextProps.location) {
  //     return true;
  //   }

  //   if (isAuthenticated !== nextProps.isAuthenticated) {
  //     return true;
  //   }

  //   return false;
  // }

  if (authenticating) {
    return <PageLoader pastDelay />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onChangeLang={_changeLanguage} />
      {isAuthenticated &&
        <SubHeader />
      }
      {Routes}
      <Footer />
      <LoginModal />
      <NotificationRoot />
    </div>
  );
}

App.propTypes = {
  location: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  authenticating: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  loadUserFromToken: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { authenticating, isAuthenticated } = authentication;
  return {
    authenticating,
    isAuthenticated
  };
};

const mapDispatchToProps = {
  loadUserFromToken: authActions.loadUserFromToken
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
