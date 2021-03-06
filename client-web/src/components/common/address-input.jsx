import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { placesServices } from 'Services/domain/google';

export class AddressInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: props.address || '',
      isFetching: false,
    };
  }

  /**
   * Handle user input to address field
   */
  _handleChangeAddress = address => {
    const { onChange } = this.props;

    this.setState({ address }, () => {
      onChange && onChange(address);
    });
  };

  /**
   * Handle user select address from auto complete
   */
  _handleSelectAddress = address => {
    const { onSelect } = this.props;

    this.setState({
      isFetching: true,
    });

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        const newState = {
          address,
          latitude: latLng.lat,
          longitude: latLng.lng,
          isFetching: false,
        };

        this.setState(newState, () => {
          onSelect && onSelect(newState);
        });
      })
      .catch(error => {
        this.setState({
          isFetching: false,
        });
        console.error('Error', error);
      });
  };

  /**
   * Get current long, lat for submit hiring request
   */
  _handleSelectCurrentLocation = () => {
    if (!window.navigator || !window.navigator.geolocation) {
      return false;
    }

    const { onSelect } = this.props;

    const location = window.navigator.geolocation;
    this.setState({
      isFetching: true,
    });
    location.getCurrentPosition(
      async result => {
        const { coords } = result;
        const { latitude, longitude } = coords;

        try {
          const addressResult = await placesServices.getAddressByLatLong(latitude, longitude);
          if ((addressResult.status === 'OK') & (addressResult.results.length > 0)) {
            const address = addressResult.results[0].formatted_address;
            const newState = {
              address,
              latitude,
              longitude,
              isFetching: false,
            };

            this.setState(newState, () => {
              onSelect && onSelect(newState);
            });
          } else {
            this.setState({
              isFetching: false,
            });
            window.alert('Can not get your location, please try again!');
          }
        } catch (error) {
          this.setState({
            isFetching: false,
          });
          window.alert('Can not get your location, please try again!');
        }
      },
      () => {
        this.setState({
          isFetching: false,
        });
        window.alert('Can not get your location, please allow!');
      }
    );
  };

  render() {
    const { address, isFocus, isFetching } = this.state;
    const { wrapperProps, inputProps, t } = this.props;

    return (
      <PlacesAutocomplete
        value={address}
        onChange={this._handleChangeAddress}
        onSelect={this._handleSelectAddress}
        searchOptions={{
          componentRestrictions: {
            country: 'VN',
          },
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
          const componentInputProps = getInputProps({
            placeholder: `${t('common.searchLocation')}...`,
            className: 'form-control location-search-input',
          });

          if (inputProps.onBlur) {
            const customOnBlur = inputProps.onBlur;
            inputProps.onBlur = e => {
              customOnBlur(e);
              componentInputProps.onBlur(e);
            };
          }

          return (
            <div
              {...wrapperProps}
              onFocus={() => this.setState({ isFocus: true })}
              onBlur={() => this.setState({ isFocus: false })}
            >
              <input autoComplete={false} {...componentInputProps} {...inputProps} />
              {isFocus && !address && !loading && suggestions.length === 0 && (
                <div className="autocomplete-dropdown-container shadow-lg border bg-white">
                  <div
                    className="suggestion-item"
                    onMouseDown={this._handleSelectCurrentLocation}
                    onTouchStart={this._handleSelectCurrentLocation}
                    role="option"
                  >
                    <i className="fas fa-map-marker text-primary" /> {t('common.useCurrentLocation')}
                  </div>
                </div>
              )}
              {(isFetching || loading || suggestions.length > 0) && (
                <div className="autocomplete-dropdown-container shadow-lg border bg-white">
                  {(loading || isFetching) && (
                    <div className="suggestion-item">
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      {t('common.loading')}...
                    </div>
                  )}
                  {suggestions.map(suggestion => {
                    const className = suggestion.active
                      ? 'suggestion-item active'
                      : 'suggestion-item';

                    const suggestionProps = getSuggestionItemProps(suggestion, {
                      className,
                    });

                    return (
                      <div {...suggestionProps}>
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }}
      </PlacesAutocomplete>
    );
  }
}

AddressInput.props = {
  wrapperProps: PropTypes.object,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  t: PropTypes.func.isRequired,
};

AddressInput.defaultProps = {
  wrapperProps: {},
  inputProps: {},
};

export default withTranslation()(AddressInput);
