import React, { Component } from 'react';

class Pagination extends Component {
    state = {
        gotoPageNo: '',
        totalRecords: 0,
        defaultItems: 0,
        prevCnt: 0,
        nextCnt: 0,
        currentPage: 1
    }

    constructor(props) {
        super(props);

        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.gotoPage = this.gotoPage.bind(this);
        this.handlePageInputChange = this.handlePageInputChange.bind(this);
        this.handlePageInputKeyDown = this.handlePageInputKeyDown.bind(this);
        
    }

    handlePageInputChange(e) {
        const val = e.target.value;
        console.log(val);
        if (val.length)
            this.setState({ gotoPageNo: parseFloat(val) });
        else 
            this.setState({ gotoPageNo: '' });
    }

    handlePageInputKeyDown(e) {
        const keyCode = e.keyCode;
        console.log(keyCode);

        if(keyCode === 13) {
            this.gotoPage();
        }
    }

    handlePage({ prevCnt, nextCnt } = {}) {
        const { onSetNewGridRecords = f => f } = this.props;
        onSetNewGridRecords({prevCnt, nextCnt});
    }

    gotoPage() {
        console.log('go to page ');
        const { totalRecords, gotoPageNo, defaultItems, currentPage } = this.state;

        if (gotoPageNo && gotoPageNo <= (totalRecords/defaultItems)) {
            const prevCnt = (gotoPageNo - 1) * defaultItems;
            const nextCnt =  (gotoPageNo * defaultItems);

            this.setState({ currentPage: gotoPageNo, prevCnt, nextCnt });
            this.handlePage({ prevCnt, nextCnt });
        } else {
            console.error('Sorry, no page exists');
        }
    }

    handlePrevious() {
        console.clear();
        console.log('Previous Trigger ');
        let { prevCnt, nextCnt, defaultItems, currentPage } = this.state;
        if (prevCnt > 0) {
            prevCnt = parseFloat(prevCnt) - defaultItems;
            nextCnt = parseFloat(nextCnt) - defaultItems;
            currentPage = currentPage - 1;
            this.setState({ prevCnt, nextCnt, currentPage, gotoPageNo: '' });
            this.handlePage({ prevCnt, nextCnt });
        }
    }

    handleNext() {
        console.clear();
        console.log('Next Trigger ');
        let { prevCnt, nextCnt, defaultItems, currentPage, totalRecords } = this.state;

        if (nextCnt < totalRecords) {
            prevCnt = parseFloat(prevCnt) + defaultItems;
            nextCnt = parseFloat(prevCnt) + defaultItems;
            currentPage = currentPage + 1;
            this.setState({ prevCnt, nextCnt, currentPage, gotoPageNo: '' });
            this.handlePage({ prevCnt, nextCnt });

        } else {
            nextCnt = totalRecords;
            this.setState({ nextCnt });
        }
    }

    componentWillMount() {
        const totalRecords = this.props.gridData.length;
        const pagination = this.state;
       
        pagination.totalRecords = totalRecords;
        pagination.defaultItems = this.props.defaultItems;

        this.setState({ pagination });
    }

    render() {
        const { totalRecords, defaultItems, currentPage, prevCnt, nextCnt, gotoPageNo } = this.state;

        return (
            <div>
                <div className="tabular-info clearfix">
                    <h5 className="float-left"><span>{totalRecords}</span> books in store.</h5>
                    <h6 className="float-left"><span>Page {`${currentPage}/${(totalRecords / defaultItems)}`}</span></h6>
                    <div className="float-right col-4">
                        <div className="input-group input-group-sm float-right">
                            <input type="text" name="gotoPageInput" className="form-control goto-input"
                                value={gotoPageNo}
                                onChange={this.handlePageInputChange}
                                onKeyDown={this.handlePageInputKeyDown}
                                maxLength={5}
                            />
                            <div className="input-group-append">
                                <button onClick={this.gotoPage} name="gotoPageButton" className="btn btn-outline-secondary" type="button">Go</button>
                            </div>
                        </div>
                        <ul className="pagination pagination-sm float-right">
                            <li className={!prevCnt ? 'page-item disabled' : 'page-item'}>
                                <a className="page-link" href="#" onClick={() => this.handlePrevious()}>Previous</a>
                            </li>
                            <li className={nextCnt === totalRecords ? 'page-item disabled' : 'page-item'}>
                                <a className="page-link" href="#" onClick={() => this.handleNext()}>Next</a>
                            </li>
                        </ul>
                    </div>


                </div>
            </div>
        )
    }
}

export default Pagination;
