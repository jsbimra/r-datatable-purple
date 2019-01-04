import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Filter from './Filter';
import Pagination from './Pagination';

class DataTable extends Component {
    state = {
        gridData: [],
        dataTableRecords: [],
        totalRecords: 0,
        viewItems: 0,
        direction: {
            ID: 'desc',
            Title: 'desc',
            PageCount: 'desc',
            PublishDate: 'desc',
        }
    }

    constructor(props) {
        super(props);

        this.setNewGridRecords = this.setNewGridRecords.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.updateViewItems = this.updateViewItems.bind(this);
    }

    sortBy(type) {
        console.clear();

        let key = type !== '' ? type.replace(/ /gi, '') : null;
        if (!key) return;

        //console.log('sortBy type ', type, 'direction', this.state.direction[type]);

        const { dataTableRecords, direction } = this.state;
        let sortedData = [];
        switch (key) {
            case 'Title':
                sortedData = (direction && direction[key] === 'asc' ?
                    dataTableRecords.sort((a, b) => {
                        const [aLast, aFirst] = a[key].split(' ');
                        const [bLast, bFirst] = a[key].split(' ');

                        return aLast > bLast ? 1 : -1;
                    }) : dataTableRecords.sort((a, b) => {
                        const [aLast, aFirst] = a[key].split(' ');
                        const [bLast, bFirst] = a[key].split(' ');

                        return bLast > aLast ? 1 : -1;
                    }))

                this.setState({ dataTableRecords: sortedData });
                break;

            default:
                sortedData = (direction && direction[key] === 'asc' ?
                    dataTableRecords.sort((a, b) => {
                        return a[key] > b[key] ? 1 : -1;
                    }) : dataTableRecords.sort((a, b) =>{
                        return b[key] > a[key] ? 1 :-1;
                    }));
                this.setState({ dataTableRecords: sortedData });
                break;
        }
        
        direction[key] = direction[key] === 'asc' ? 'desc' : 'asc';
        this.setState({ direction });

    }

    updateViewItems(val) {
        if (val && val !== '') {
            if (typeof val !== "number" && val.toLowerCase() === 'all') {
                const nextCnt = this.state.totalRecords;
                this.setNewGridRecords({ prevCnt: 0, nextCnt });
                this.setState({ viewItems: nextCnt });
            } else {
                this.setNewGridRecords({ prevCnt: 0, nextCnt: parseFloat(val) });
                this.setState({ viewItems: val });
            }
        }
    }

    renderFilter() {
        return (
            <Filter
                cssClassname={this.props.isFilterTrigged ? 'active' : ''}
                onCloseFilter={this.props.onCloseFilter}
                onSortyBy={this.sortBy}
                onUpdateViewItems={this.updateViewItems}
            />

        );
    }

    setNewGridRecords({ prevCnt, nextCnt }) {
        // //console.log('setNewGridRecords method called ', typeof prevCnt, typeof nextCnt, this.state.gridData);
        //console.log('prevCnt ', prevCnt, 'nxtCnt ', nextCnt);

        const dataTableRecords = this.state.gridData.slice(prevCnt, nextCnt);
        //console.log(dataTableRecords);

        if (!dataTableRecords.length) {
            //console.log('You have reached the limit');
            return;
        }

        this.setState({ dataTableRecords });

        return dataTableRecords;
    }

    componentWillMount() {
        const { gridData } = this.props;
        this.setState({ totalRecords: gridData.length, gridData });
    }

    componentDidMount() {
        this.setNewGridRecords({ prevCnt: 0, nextCnt: this.props.defaultItems, viewItems: this.props.defaultItems });
    }

    renderTable() {
        const newGridData = this.state.dataTableRecords ? this.state.dataTableRecords : [];

        if (newGridData.length) {
            const {direction} = this.state;
            return (
                <div>
                    <h2>Books</h2>
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

                    <div className={this.state.viewItems > 5 ? 'grid-table-panel' : ''}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <td width="10%"><a href="#" onClick={() => this.sortBy('ID')}>ID <FontAwesomeIcon icon={direction.ID === 'asc' ? 'caret-up' : 'caret-down'} /></a></td>
                                    <td width="15%"><a href="#" onClick={() => this.sortBy('Title')}>Title <FontAwesomeIcon icon={direction.Title === 'asc' ? 'caret-up' : 'caret-down'} /></a></td>
                                    <td width="49%">Description</td>
                                    <td width="13%" className="text-center"><a href="#" onClick={() => this.sortBy('PageCount')}>Page Count <FontAwesomeIcon icon={direction.PageCount === 'asc' ? 'caret-up' : 'caret-down'} /></a></td>
                                    <td width="13%" className="text-right"><a href="#" onClick={() => this.sortBy('PublishDate')}>Publish Date <FontAwesomeIcon icon={direction.PublishDate === 'asc' ? 'caret-up' : 'caret-down'} /></a></td>
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
                                            <td className="text-right">{new Date(item.PublishDate).getFullYear()}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {this.renderFilter()}

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
