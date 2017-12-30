import React from 'react';
import PropTypes from 'prop-types';
import { RaisedButton } from 'material-ui';
import _ from 'lodash';

class BittrexResults extends React.Component {
  static propTypes = {
    getMarketSummaries: PropTypes.func.isRequired,
    summaries: PropTypes.objectOf(PropTypes.any),
    apiStatus: PropTypes.objectOf(PropTypes.any),
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

  getMarketSummaries = () => this.props.getMarketSummaries();

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

const mapStateToProps = ({ bittrex, api }) => ({
  summaries: bittrex.summaries,
  apiStatus: api,
})

export default BittrexResults;
