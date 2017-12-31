import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
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
      height: '400px',
      fixedHeader: true,
      fixedFooter: true,
      selectable: false,
      multiSelectable: false,
      showCheckboxes: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showRowHover: false,
      stripedRows: false,
      UsdtBtc: 1,
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

  renderMarketSummaries = (summaries) => {
    let UsdtBtc = 0;
    return summaries
    .map((obj) => {
      if (obj.MarketName === 'USDT-BTC') {
        UsdtBtc = (obj.Bid + obj.Ask) / 2;
      }
      return obj;
    })
    .map(({
      MarketName,
      MarketCurrency,
      MarketCurrencyLong,
      Volume,
      TimeStamp,
      Bid,
      Ask,
      OpenBuyOrders,
      OpenSellOrders,
      LogoUrl,
    }, i) => (
      <TableRow key={MarketName}>
        <TableRowColumn>
          {i + 1}
          <br />
          <img src={LogoUrl} alt={MarketName} style={{ maxWidth: 100 }} />
        </TableRowColumn>
        <TableRowColumn>
          {
            MarketName.split('-')[0] === 'BTC' ?
            `${MarketCurrencyLong} (${MarketCurrency})}` :
            MarketName
          }
        </TableRowColumn>
        <TableRowColumn>{Volume.toFixed(2)}</TableRowColumn>
        <TableRowColumn>$
          {
            (MarketName.slice(0, 3) === 'BTC') ?
            (UsdtBtc * ((Bid + Ask) / 2)).toFixed(4) :
            ((Bid + Ask) / 2).toFixed(4)
          }
        </TableRowColumn>
        <TableRowColumn>{OpenBuyOrders}</TableRowColumn>
        <TableRowColumn>{OpenSellOrders}</TableRowColumn>
        <TableRowColumn>{moment(`${TimeStamp}`).format('hh:mm, Do MMM YYYY')}</TableRowColumn>
      </TableRow>
    ));
  }

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
        {
          this.state.summaries &&
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
                  <TableHeaderColumn
                    colSpan="7"
                    tooltip="Bittrex Markets"
                    style={{
                      textAlign: 'center',
                      color: '#FFF',
                      fontSize: '24px',
                    }}
                  >
                    Bittrex Market Summaries
                  </TableHeaderColumn>
                </TableRow>
                <TableRow>
                  <TableHeaderColumn tooltip="#" style={{ color: '#0097a7' }}>
                    #
                  </TableHeaderColumn>
                  <TableHeaderColumn tooltip="Name" style={{ color: '#0097a7' }}>
                    Name
                  </TableHeaderColumn>
                  <TableHeaderColumn tooltip="Volume" style={{ color: '#0097a7' }}>
                    Volume
                  </TableHeaderColumn>
                  <TableHeaderColumn tooltip="Price" style={{ color: '#0097a7' }}>
                    Price
                  </TableHeaderColumn>
                  <TableHeaderColumn tooltip="Open Buy" style={{ color: '#0097a7' }}>
                    Open Buy
                  </TableHeaderColumn>
                  <TableHeaderColumn tooltip="Open Sell" style={{ color: '#0097a7' }}>
                    Open Sell
                  </TableHeaderColumn>
                  <TableHeaderColumn tooltip="Time Stamp" style={{ color: '#0097a7' }}>
                    Time Stamp
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={this.state.showCheckboxes}
                deselectOnClickaway={this.state.deselectOnClickaway}
                showRowHover={this.state.showRowHover}
                stripedRows={this.state.stripedRows}
              >
                {this.renderMarketSummaries(this.state.summaries)}
              </TableBody>
              <TableFooter adjustForCheckbox={this.state.showCheckboxes}>
                <TableRow>
                  <TableRowColumn colSpan="3" style={{ textAlign: 'center' }}>
                    Bittrex Market Summaries
                  </TableRowColumn>
                </TableRow>
              </TableFooter>
              {/* {JSON.stringify(this.state.summaries)} */}
            </Table>
        }
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
