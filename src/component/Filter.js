import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Filter extends Component {
  constructor(props) {
    super(props);

    this.closeFilterPanel = this.closeFilterPanel.bind(this);
  }
  closeFilterPanel(closeState) {
    this.props.onCloseFilter(closeState);
  }

  render() {
    return (
      <div className={`filter-panel ${this.props.cssClassname}`}>
          <a href="#" className="close" onClick={()=> {
              this.closeFilterPanel(false)
            }}>
          <FontAwesomeIcon icon="times" /></a> 
         <h3>Filter</h3>

         <form onSubmit={() => false}>
             {/* <button name="prev" type="button" disabled={!this.props.pagination.prevCnt ? 'disabled' : ''} onClick={()=> this.props.handlePrevious()} >Prev</button>
             <button name="next" type="button" disabled={this.props.pagination.nextCnt === this.props.pagination.totalRecords ? 'disabled' : ''} onClick={()=> this.props.handleNext()} >Next</button> */}
         </form>
      </div>
    )
  }
}

export default Filter;
