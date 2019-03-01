import React, { PureComponent } from 'react';

import ccpApiService from '../../../services/domain/ccp-api-service';
import { EQUIPMENT_SHOWABLE_STATUSES } from '../../../common/consts';

class MyEquipments extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      filterStatus: 'all'
    };
  }

    _loadData = async () => {
      const REQUESTER_ID = 12;
      const equipments = await ccpApiService.getEquipmentsByContractorId(REQUESTER_ID);
      this.setState({
        equipments
      });
    };

    componentDidMount () {
      this._loadData();
    }

    render () {
      const { equipments } = this.state;

      return (
        <div className="container py-4">
          <h4>My equipments</h4>
          {equipments && equipments.map(equipment => {
            return (
              <div key={equipment.id} className="d-flex transaction my-3 rounded shadow-sm">
                <div className="image flex-fill">
                  <img src={equipment.thumbnailImage || '/public/upload/product-images/unnamed-19-jpg.jpg'} className="rounded-left" />
                </div>
                <div className="detail flex-fill p-2">
                  <h6>
                    {equipment.name}
                    <span className="float-right">
                      <button className="btn btn-outline-success btn-sm"><i className="fa fa-pencil"></i></button>
                      <button className="btn btn-outline-danger btn-sm ml-2"><i className="fa fa-trash"></i></button>
                    </span>
                    <span className="clearfix"></span>
                  </h6>
                  <div>Status: {EQUIPMENT_SHOWABLE_STATUSES[equipment.status]}</div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
}

export default MyEquipments;