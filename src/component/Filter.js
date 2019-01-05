import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Filter extends Component {
  viewOptions = [5, 10, 15, 20, 30, 40, 'All'];
  sortByOptions = ['Title', 'Description', 'Page Count', 'Date'];

  constructor(props) {
    super(props);

    this.closeFilterPanel = this.closeFilterPanel.bind(this);
    this.setWrapperAroundMe = this.setWrapperAroundMe.bind(this);
    this.handleClickOutsideMe = this.handleClickOutsideMe.bind(this);
  }
  
  closeFilterPanel(closeState) {
    this.props.onCloseFilter(closeState);
  }

  handleSortBy(e) {
    console.log(e);
    this.props.onSortyBy(e.target.value);
  }

  handleViewItems(e) {
    console.log(e);
    this.props.onUpdateViewItems(e.target.value);
  }

  setWrapperAroundMe(node){
    this.wrapperEle = node;
  }

  handleClickOutsideMe(e) {
    if(this.wrapperEle && !this.wrapperEle.contains(e.target)){
      this.closeFilterPanel(false);
    }
  }

  componentDidMount(){
    document.addEventListener('mousedown', this.handleClickOutsideMe);
  }

  componentWillUnmount(){
    document.removeEventListener('mousedown', this.handleClickOutsideMe)
  }

  render() {

    return (
      <div className={`filter-panel ${this.props.cssClassname}`} ref={this.setWrapperAroundMe}>
        <a href="#" className="close" onClick={() => {
          this.closeFilterPanel(false)
        }}>
          <FontAwesomeIcon icon="times" /></a>
        <h3>Filter</h3>

        <form onSubmit={() => false}>
          <div className="form-group">
            <label htmlFor="viewItemsControl">View items</label>
            <select className="form-control" id="viewItemsControl" onChange={(e) => this.handleViewItems(e)}>
              <option>Select</option>
              {
                this.viewOptions.map((option, i) => {
                  return (<option key={i} value={option}>{option}</option>)
                })
              }
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="soryByControl">Sort By</label>
            <select className="form-control" id="soryByControl" onChange={(e) => this.handleSortBy(e)}>
              <option>Select</option>
              {
                this.sortByOptions.map((option, i) => {
                  return (<option key={i} value={option}>{option}</option>)
                })
              }
            </select>
          </div>
        </form>
      </div>
    )
  }
}

export default Filter;
