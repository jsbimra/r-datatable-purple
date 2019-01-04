import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import API from './api/service';
import Filter from './component/Filter';
import DataTable from './component/DataTable';
import './App.css';

import './fontawesome';

class App extends Component {
  state = {
    isFilterTrigged: false,
    flashOut: false,
    heading: {
      title: 'Getting your lab ready!',
      icon: ['fas', 'mug-hot']
    },
    fetchedData: []
  }
  constructor(props) {
    super(props);

    this.showFilter = this.showFilter.bind(this);
    this.closeFilter = this.closeFilter.bind(this);
    this.flashHeader = this.flashHeader.bind(this);
  }

  componentWillMount() {
    API.fetchData('Books')
      .then((res) => {

        this.setState({ fetchedData: res });

        let heading = this.state.heading;
        heading.title = 'Welcome to Stylish Lab!';
        heading.icon = '';

        if (res) {
          this.flashHeader();
          this.setState({ heading, flashOut: !this.state.flashOut });
        }
      });

  }

  closeFilter(closedStatus) {
    this.setState({ isFilterTrigged: closedStatus })
  }

  showFilter() {
    this.setState({ isFilterTrigged: !this.state.isFilterTrigged });
  }

  flashHeader() {
    const body = document.querySelector('body');
    body.classList.add('flash-out');
  }


  renderFilter() {
    return (
      <Filter
        cssClassname={this.state.isFilterTrigged ? 'active' : ''}
        onCloseFilter={this.closeFilter}
      />

    );
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1>{this.state.heading.title}  <br />
            {this.state.heading.icon ? (<FontAwesomeIcon icon={this.state.heading.icon} />) : ''}
          </h1>

          {
            this.state.flashOut && !this.state.isFilterTrigged ? (
              <a href="#" className="filter-icon" onClick={(e) => { this.showFilter(e) }}><FontAwesomeIcon icon="cog" /></a>
            ) : ''
          }
        </header>

        <div className="container-fluid app-body">
          {this.state.fetchedData.length ? (
            <div>
              <DataTable 
                gridData={this.state.fetchedData}
                defaultItems={5}
              />
            </div>
          ) : 'No data to display!!'}
          {this.renderFilter()}
        </div>
      </div>
    );
  }
}

export default App;
