import React, { Component } from 'react';
import { connect } from "react-redux";



class MaterialCart extends Component {
  state = {
    isChanged: false
  };
  materialCartCount = 0;

  componentDidUpdate() {
    const { isChanged } = this.state;
    const { materialCart } = this.props;
    if (materialCart.count !== this.materialCartCount) {
      this.materialCartCount = materialCart.count;

      this.setState({
        isChanged: true
      });
    }

    if (isChanged) {
      setTimeout(() => {
        this.setState({
          isChanged: false
        });
      }, 1300);
    }
  }

  render() {
    const { isChanged } = this.state;
    const { materialCart } = this.props;

    return (
      <li className="nav-item">
        <a className="text-dark d-flex h-100 align-items-center px-3" href="#">
          <i className="fal fa-shopping-cart"></i>
          <span className={`badge badge-pill badge-danger ${isChanged ? 'heartBeat' : ''}`}>{materialCart.count}</span>
        </a>
      </li>
    );
  }
}


const mapStateToProps = state => {
  const { materialCart } = state;
  
  return {
    materialCart
  };
};

export default connect(mapStateToProps)(MaterialCart);
