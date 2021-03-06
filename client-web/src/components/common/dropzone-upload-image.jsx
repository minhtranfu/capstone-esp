import React, { Component } from "react";
import DropZone from "react-dropzone";
import PropTypes from "prop-types";

class DropzoneUploadImage extends Component {
  constructor() {
    super();
    this.state = {
      files: []
    };
  }

  _onDrop = files => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(files);
    }
  }

  render() {
    const { multiple, height } = this.props;

    return (
      <section>
        <DropZone accept="image/*" onDrop={this._onDrop} multiple={multiple}>
          {({ getRootProps, getInputProps }) => (
            <div
              style={{
                height
              }}
              {...getRootProps()}
              className="image-dropzone d-flex align-items-center justify-content-center rounded"
            >
              <input {...getInputProps()}/>
              <p>Click to select or drop photos here</p>
            </div>
          )}
        </DropZone>
      </section>
    );
  }
}

DropzoneUploadImage.props = {
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  height: PropTypes.number,
};

DropzoneUploadImage.defaultProps = {
  multiple: true,
  height: 200,
};

export default DropzoneUploadImage;
