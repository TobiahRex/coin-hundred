import React from 'react';
import PropTypes from 'prop-types';
import { RaisedButton } from 'material-ui';
import _ from 'lodash';

class BittrexResults extends React.Component {
  static propTypes = {
    getMarketSummaries: PropTypes.func.isRequired,
    results: PropTypes.objectOf(PropTypes.any),
  }

  constructor(props) {
    super(props);

    this.state = {
      results: '',
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (!_.isEqual(nextProps.results, this.props.results)) {
      this.setState(() => ({
        results: nextProps.results,
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
        {this.state.results}
      </div>
    );
  }
}

export default BittrexResults;
