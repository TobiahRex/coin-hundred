import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  RaisedButton,
  Table,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui';
import apiActions from '../../redux/api';
import bittrexActions from '../../redux/bittrex';

const { objectOf, any, func } = PropTypes;

class BittrexResults extends React.Component {
  static propTypes = {
    getMarketSummaries: func.isRequired,
    summaries: objectOf(any),
    apiStatus: objectOf(any),
    fetching: func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      summaries: '',
      height: '500px',
      fixedHeader: true,
      fixedFooter: true,
      selectable: false,
      multiSelectable: false,
      showCheckboxes: false,
      adjustForCheckbox: false,
      enableSelectAll: false,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (!_.isEqual(nextProps.summaries, this.props.summaries)) {
      this.setState(() => ({
        summaries: nextProps.summaries,
      }));
    }
  }

  getMarketSummaries = () => {
    this.props.fetching();
    this.props.getMarketSummaries();
  };

  renderMarketSummaries = (summaries) =>
  summaries.map(({}) => {

  })

  render() {
    return (
      <div>
        <RaisedButton
          primary
          label={'Get Markets'}
          type={'button'}
          onClick={this.getMarketSummaries}
        />
        <br/>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            {JSON.stringify(this.state.summaries)}
          </TableHeader>
        </Table>
      </div>
    );
  }
}

export default connect(
  ({ bittrex, api }) => ({
    summaries: bittrex,
    apiStatus: api,
  }),
  dispatch => ({
    fetching: () => dispatch(apiActions.fetching()),
    getMarketSummaries: () => dispatch(bittrexActions.getMarketSummaries()),
  }),
)(BittrexResults);
