import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Filter from './Filter';
import Pagination from './Pagination';

Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

class FormatDate extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.date) return 'no-date';
        const dateStr = new Date(this.props.date);
        const dy = dateStr.getFullYear();
        const dm = dateStr.getMonth();
        const dd = dateStr.getDate();
        const format = `${dd}-${dm + 1}-${dy}`;
        return (format);
    }

};

class DataTable extends Component {

    state = {
        editable: false,
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
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
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
                    }) : dataTableRecords.sort((a, b) => {
                        return b[key] > a[key] ? 1 : -1;
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

    createFieldControl(control, id) {
        const controls = {
            text: 'input',
            largeText: 'textarea',
            date: 'input',
            button: 'button',
            dropdown: 'select'
        };

        if (control && controls[control]) {
            let field = document.createElement(controls[control]);
            field.name = `${controls[control]}${id}`;
            field.id = `${controls[control]}${id}`;
            field.className = `form-control`;
            if (control === 'date') {
                field.type = 'date';
            }
            return field;
        }
    }

    save(id) {
        console.log('We are saving following item id ', id);
    }

    edit(id) {
        if (id) {
            // console.log(#toggleEditAction);

            this.setState({ editable: !this.state.editable });

            if (!this.state.editable) {
                //on edit
                const curRow = document.querySelector(`.dtrow${id}`);
                if (!curRow) return;

                const allCols = Array.from(curRow.querySelectorAll('td[data-editable]'));
                const editRef = this.refs[`editRef${id}`];

                allCols.map((col, idx) => {
                    const control = col.dataset.editable;
                    const newControl = this.createFieldControl(control, idx);
                    newControl.value = control === 'date' ? new Date(col.textContent).toDateInputValue() : col.textContent;
                    col.innerHTML = '';
                    col.appendChild(newControl);
                });

                // ReactDOM.render(<FontAwesomeIcon icon="edit" color="blue" />, editRef);


            } else {
                //on save
                const curRow = document.querySelector(`.dtrow${id}`);
                if (!curRow) return;

                const allCols = Array.from(curRow.querySelectorAll('td[data-editable]'));

                allCols.map((col, idx) => {
                    const editRef = this.refs[`editRef${id}`];
                    const text = col.children[0].value || col.children[0].textContent;
                    col.innerHTML = text;

                    // ReactDOM.render(<FontAwesomeIcon icon="check" color="green" />, editRef);
                });
            }
        }
    }

    delete(id) {
        if (id) {
            const { dataTableRecords } = this.state;
            const idx = dataTableRecords.findIndex(item => id === item.ID);
            const confirm = window.confirm('Are you sure want to delete?');

            if (confirm) {
                dataTableRecords.splice(idx, 1);
                this.setState({ dataTableRecords });
            }
            return;
        }
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

    renderTable() {
        const newGridData = this.state.dataTableRecords ? this.state.dataTableRecords : [];

        if (newGridData.length) {
            const { direction, editable } = this.state;
            return (
                <div>
                    {this.state.totalRecords ? (
                        <Pagination
                            gridData={this.state.gridData}
                            defaultItems={5}
                            onSetNewGridRecords={this.setNewGridRecords}
                            handlePrevious={this.handlePrevious}
                            handleNext={this.handleNext}
                            tabularMsg="books in store."
                        />
                    ) : null
                    }

                    <div className={this.state.viewItems > 5 ? 'grid-table-panel' : ''}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <td width="8%"><a href="#" onClick={() => this.sortBy('ID')}>ID <FontAwesomeIcon icon={direction.ID === 'asc' ? 'caret-up' : 'caret-down'} /></a></td>
                                    <td width="15%"><a href="#" onClick={() => this.sortBy('Title')}>Title <FontAwesomeIcon icon={direction.Title === 'asc' ? 'caret-up' : 'caret-down'} /></a></td>
                                    <td width="40%">Description</td>
                                    <td width="10%" className="text-center"><a href="#" onClick={() => this.sortBy('PageCount')}>Page Count <FontAwesomeIcon icon={direction.PageCount === 'asc' ? 'caret-up' : 'caret-down'} /></a></td>
                                    <td width="10%" className="text-right"><a href="#" onClick={() => this.sortBy('PublishDate')}>Publish Date <FontAwesomeIcon icon={direction.PublishDate === 'asc' ? 'caret-up' : 'caret-down'} /></a></td>
                                    <td width="12%" className="text-center">Action</td>
                                </tr>
                            </thead>
                            <tbody className="grid-table-panel">
                                {newGridData.map(item => {
                                    return (
                                        <tr key={item.ID} className={`dtrow${item.ID}`}>
                                            <td>{item.ID}</td>
                                            <td data-editable="text">{item.Title}</td>
                                            <td data-editable="largeText">{item.Description}</td>
                                            <td data-editable="text" className="text-center">{item.PageCount}</td>
                                            <td data-editable="date" className="text-right">{(<FormatDate date={item.PublishDate} />)}</td>
                                            <td className="text-center">
                                                <a href="#" onClick={(e) => this.edit(item.ID)} ref={`editRef${item.ID}`}><FontAwesomeIcon icon="edit" color="#ffcc00" /></a>
                                                &nbsp;|&nbsp;
                                                <a href="#" onClick={(e) => this.delete(item.ID)}><FontAwesomeIcon icon="trash-alt" color="#cc0000" /></a>

                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
            )
        } else {
            return (
                <div>
                    <div className="alert alert-warning text-center" role="alert">Currently no records to show.</div>
                </div>
            )
        }
    }
    render() {
        return (
            <div>
                {this.renderTable()}
                {this.renderFilter()}
            </div>
        )
    }
}

export default DataTable;
