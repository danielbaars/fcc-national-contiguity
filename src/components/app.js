import React, { Component } from 'react';
import { json } from 'd3-request';

import ForceDirectedGraph from './force_directed_graph';

const DATA_URL = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }
  componentDidMount() {
    var _this = this;
    this.serverRequest = json(DATA_URL, d => {
      _this.setState({
        data: d
      });
    })
  }
   render() {
     return (
      <div className='App'>
        <div className="row">
          <div className="col-md-12">
            <div className="header">
              <h1>Force Directed Graph of National Contiguity</h1>
            </div>
            { Object.keys(this.state.data).length !== 0 ? <ForceDirectedGraph data={this.state.data} size={[920,560]} /> : null }
          </div>
        </div>
      </div>
     )
   }
};
