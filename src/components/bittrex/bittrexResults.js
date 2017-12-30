import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RaisedButton } from 'material-ui';
import _ from 'lodash';
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

  render() {
    return (
      <div>
        <RaisedButton
          primary
          label={'Get Markets'}
          type={'button'}
          onClick={this.getMarketSummaries}
        />
        {this.state.summaries}
      </div>
    );
  }
}

export default connect(
  ({ bittrex, api }) => ({
    summaries: bittrex.summaries,
    apiStatus: api,
  }),
  dispatch => ({
    fetching: () => dispatch(apiActions.fetching()),
    getMarketSummaries: () => dispatch(bittrexActions.getMarketSummaries()),
  }),
)(BittrexResults);
