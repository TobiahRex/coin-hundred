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
  TableBody,
  TableFooter,
  TableRowColumn,
} from 'material-ui';
import apiActions from '../../redux/api';
import bittrexActions from '../../redux/bittrex';

const { objectOf, any, func, arrayOf } = PropTypes;

class BittrexResults extends React.Component {
  static propTypes = {
    getMarketSummaries: func.isRequired,
    summaries: arrayOf(any),
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
      selectable: true,
      multiSelectable: true,
      showCheckboxes: true,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showRowHover: false,
      stripedRows: true,
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

  // renderMarketSummaries = (summaries) =>
  // summaries.map(({}) => {
  //
  // })

  render() {
    return (
      <div>
        <RaisedButton
          primary
          label={'Get Markets'}
          type={'button'}
          onClick={this.getMarketSummaries}
        />
        <br />
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
            <TableRow>
              <TableHeaderColumn colSpan="3" tooltip="Bittrex Markets" style={{ textAlign: 'center' }}>
                Bittrex Market Summaries
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="#">#</TableHeaderColumn>
              <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
              {/* <TableHeaderColumn tooltip="High">High</TableHeaderColumn> */}
              {/* <TableHeaderColumn tooltip="Low">Low</TableHeaderColumn> */}
              <TableHeaderColumn tooltip="Volume">Volume</TableHeaderColumn>
              <TableHeaderColumn tooltip="Price">Price</TableHeaderColumn>
              <TableHeaderColumn tooltip="Open Buy">Open Buy</TableHeaderColumn>
              <TableHeaderColumn tooltip="Open Sell">Open Sell</TableHeaderColumn>
              <TableHeaderColumn tooltip="Time Stamp">Time Stamp</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.summaries.length && this.state.summaries.map(({
              MarketName,
              High,
              Low,
              Volume,
              Last,
              BaseVolume,
              TimeStamp,
              Bid,
              Ask,
              OpenBuyOrders,
              OpenSellOrders,
            }, i) =>
              <TableRow key={MarketName}>
                <TableRowColumn>{i + 1}</TableRowColumn>
                <TableRowColumn>{MarketName}</TableRowColumn>
                {/* <TableRowColumn>{High}</TableRowColumn> */}
                {/* <TableRowColumn>{Low}</TableRowColumn> */}
                <TableRowColumn>{Volume}</TableRowColumn>
                <TableRowColumn>{(Bid + Ask) / 2}</TableRowColumn>
                <TableRowColumn>{OpenBuyOrders}</TableRowColumn>
                <TableRowColumn>{OpenSellOrders}</TableRowColumn>
                <TableRowColumn>{TimeStamp}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
          <TableFooter adjustForCheckbox={this.state.showCheckboxes}>
            <TableRow>
              <TableHeaderColumn >#</TableHeaderColumn>
              <TableHeaderColumn >Name</TableHeaderColumn>
              {/* <TableHeaderColumn >High</TableHeaderColumn> */}
              {/* <TableHeaderColumn >Low</TableHeaderColumn> */}
              <TableHeaderColumn >Volume</TableHeaderColumn>
              <TableHeaderColumn >Price</TableHeaderColumn>
              <TableHeaderColumn >Open Buy</TableHeaderColumn>
              <TableHeaderColumn >Open Sell</TableHeaderColumn>
              <TableHeaderColumn >Time Stamp</TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn colSpan="3" style={{ textAlign: 'center' }}>
                Bittrex Market Summaries
              </TableRowColumn>
            </TableRow>
          </TableFooter>
          {/* {JSON.stringify(this.state.summaries)} */}
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
