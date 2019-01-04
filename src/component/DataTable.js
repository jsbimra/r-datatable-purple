import React, { Component } from 'react';

import Pagination from './Pagination';

class DataTable extends Component {
    state = {
        gridData: [],
        dataTableRecords: [],
        totalRecords: 0
    }
    
    constructor(props) {
        super(props);

        this.setNewGridRecords = this.setNewGridRecords.bind(this);
    }

    setNewGridRecords({prevCnt, nextCnt}) {
        // console.log('setNewGridRecords method called ', typeof prevCnt, typeof nextCnt, this.state.gridData);
        console.log('prevCnt ', prevCnt,'nxtCnt ', nextCnt);

        const dataTableRecords =  this.state.gridData.slice(prevCnt, nextCnt);
        console.log(dataTableRecords);

        if (!dataTableRecords.length) {
            console.log('You have reached the limit');
            return;
        }
        
        this.setState({ dataTableRecords });
        
        return dataTableRecords;
    }

    componentWillMount() {
        const {gridData} = this.props;
        this.setState({ totalRecords: gridData.length, gridData });
    }

    componentDidMount() {
        this.setNewGridRecords({prevCnt: 0, nextCnt: this.props.defaultItems});
    }

    renderTable() {
        const newGridData = this.state.dataTableRecords ? this.state.dataTableRecords : [];

        if (newGridData.length) {
            return (
                <div>
                    <h2>Books</h2>
                    <div className="">

                        {this.state.totalRecords ? (
                            <Pagination
                                gridData={this.state.gridData}
                                defaultItems={5}
                                onSetNewGridRecords={this.setNewGridRecords}
                                handlePrevious={this.handlePrevious}
                                handleNext={this.handleNext}
                            />
                        ) : null
                        }

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <td width="10%">Id</td>
                                    <td width="15%">Title</td>
                                    <td width="65%">Description <a href="#">^</a></td>
                                    <td width="10%">Page Count</td>
                                    <td width="10%">Publish Date</td>
                                </tr>
                            </thead>
                            <tbody className="grid-table-panel">
                                {newGridData.map(item => {
                                    return (
                                        <tr key={item.ID}>
                                            <td>{item.ID}</td>
                                            <td>{item.Title}</td>
                                            <td>{item.Description}</td>
                                            <td className="text-center">{item.PageCount}</td>
                                            <td>{new Date(item.PublishDate).getFullYear()}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
    }
    render() {
        return (
            <div>
                {this.renderTable()}

            </div>
        )
    }
}

export default DataTable;
