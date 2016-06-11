import React from "react";
import ReactDOM from "react-dom";
import find from "lodash/find";
import orderBy from "lodash/orderBy";

export default class Table extends React.Component {

    static propTypes = {
        data: React.PropTypes.array.isRequired,
        columns: React.PropTypes.array.isRequired,
        //liveResize: React.PropTypes.bool,
        debug: React.PropTypes.bool,
        perPage: React.PropTypes.number,
        blockOnProcessing: React.PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.data = props.data;

        this.state = {
            page: 0,
            sorting: false,
            lastOrder: 'asc',
            sort: [],
            colWidths: [],
            tableHeight: null,
            tableWidth: null,
            draggingSeparatorIndex: null
        }
    }

    componentDidMount() {
        const table = ReactDOM.findDOMNode(this.refs.table);
        const tableHeight = table.offsetHeight;
        const tableWidth = table.offsetWidth;

        const ths = table.querySelectorAll('thead th');
        let colWidths = [];
        ths.forEach((th) => {
            colWidths.push(th.offsetWidth);
        });

        this.setState({colWidths, tableHeight, tableWidth});
    }

    sortBy(e, columnIndex) {
        const {sort, lastOrder} = this.state;
        const {blockOnProcessing} = this.props;
        const data = this.data;
        const stackSort = e.ctrlKey;

        if (blockOnProcessing) {
            this.setState({sorting: true});
        }

        let alreadyHasSort = false;

        let newLastOrder = lastOrder;

        let newSort = [];
        sort.forEach((sortItem) => {
            if (sortItem.columnIndex === columnIndex) {
                alreadyHasSort = true;
                const order = (sortItem.order === 'asc') ? 'desc' : 'asc';
                newLastOrder = order;
                newSort.push({
                    order: order,
                    columnIndex,
                });
            }

            if (stackSort) {
                newSort.push(Object.assign({}, sortItem));
            }
        });

        if (!alreadyHasSort) {
            newSort.push({
                columnIndex,
                order: lastOrder,
            })
        }

        const sortColumnsArr = [];
        const orderArr = [];
        newSort.forEach((sortItem) => {
            sortColumnsArr.push(`content.${sortItem.columnIndex}`);
            orderArr.push(sortItem.order);
        });

        setTimeout(() => {
            this.data = orderBy(data, sortColumnsArr, orderArr);

            this.setState({
                sort: newSort,
                lastOrder: newLastOrder,
                sorting: false
            })
        }, 1);
    }

    renderHead() {
        const {columns} = this.props;
        const {colWidths, sort} = this.state;

        const ths = columns.map((column, thIndex) => {
            let style = {
                cursor: 'pointer',
                MozUserSelect: 'none',
                WebkitUserSelect: 'none',
                msUserSelect: 'none',
            };

            if (colWidths[thIndex] !== undefined) {
                style.width = colWidths[thIndex];
            }

            let sortIndicator;
            const sortProp = find(sort, {columnIndex: thIndex});
            if (sortProp) {
                const sortSpanStyle = {
                    paddingLeft: 5,
                    color: '#999',
                };

                switch (sortProp.order) {
                    case 'asc':
                    {
                        sortIndicator = (
                            <span style={sortSpanStyle}>▲</span>
                        );
                        break;
                    }
                    case 'desc':
                    {
                        sortIndicator = (
                            <span style={sortSpanStyle}>▼</span>
                        );
                        break;
                    }
                }
            }

            return (
                <th key={thIndex}
                    style={style}
                    onClick={(e) => {this.sortBy(e, thIndex)}}>
                    {column.title}
                    {sortIndicator}
                </th>
            )
        });

        return (
            <thead key="thead">
                <tr>
                    {ths}
                </tr>
            </thead>
        );
    }

    renderBody() {
        const {perPage} = this.props;
        const {page, colWidths} = this.state;
        const data = this.data;

        let listData;
        if (perPage) {
            listData = data.slice(page * perPage, page * perPage + perPage);
        } else {
            listData = data;
        }


        const trs = listData.map((row, trIndex) => {
            const tds = row.content.map((dataItem, tdIndex) => {
                let style = {};
                if (colWidths[tdIndex] !== undefined) {
                    style.width = colWidths[tdIndex];
                }
                return (
                    <td style={style} key={tdIndex}>{dataItem}</td>
                )
            });

            return (
                <tr key={row.id}>
                    {tds}
                </tr>
            )
        });

        return (
            <tbody key="tbody">
                {trs}
            </tbody>
        );
    }

    renderControl() {
        const {colWidths, tableHeight, tableWidth, draggingSeparatorIndex} = this.state;
        const {debug} = this.props;

        const style = {
            position: 'relative',
        };

        let leftOffset = 0;

        const separators = colWidths.map((colWidth, index) => {
            //Don't draw last separator
            if (index === colWidths.length - 1) {
                return;
            }

            const style = {
                left: colWidth + leftOffset,
                width: 10,
                backgroundColor: '#f00',
                height: tableHeight,
                position: 'absolute',
                cursor: 'col-resize',
                opacity: debug ? 0.1 : 0
            };

            if (isNaN(style.left)) {
                debugger;
            }

            leftOffset = leftOffset + colWidth;

            return (
                <div key={`separator_${index}`}
                     style={style}
                     onMouseDown={(e) => {this.onStartDragSeparator(e, index)}}/>
            )
        });

        const blockingSelectDivStyle = {
            position: 'absolute',
            width: tableWidth,
            height: tableHeight,
            backgroundColor: '#0F0',
            opacity: debug ? 0.1 : 0
        };

        let blockingSelectDiv;
        if (draggingSeparatorIndex !== null) {
            blockingSelectDiv = (
                <div style={blockingSelectDivStyle}></div>
            )
        }

        return (
            <div style={style}>
                {separators}
                {blockingSelectDiv}
            </div>
        )
    }

    renderBlockScreen() {
        const {sorting, tableWidth, tableHeight} = this.state;
        const blockScreenDivStyle = {
            position: 'absolute',
            width: tableWidth,
            height: tableHeight,
            backgroundColor: '#000',
            opacity: 0.1
        };

        if (sorting) {
            return (
                <div style={blockScreenDivStyle}></div>
            )
        }
    }

    renderPagination() {
        const data = this.data;
        const {page} = this.state;
        const {perPage} = this.props;

        if (!perPage) {
            return;
        }

        const totalPages = data.length / (perPage);

        return (
            <div>
                <button onClick={() => {this.setState({page: page-1})}} disabled={page === 0}>prev</button>
                <span>{page + 1} of {totalPages}</span>
                <button onClick={() => {this.setState({page: page+1})}} disabled={page === totalPages-1}>next</button>
            </div>
        )
    }

    onStartDragSeparator(e, separatorIndex) {
        this.setState({
            draggingSeparatorX: e.clientX,
            draggingSeparatorIndex: separatorIndex
        })
    }

    onStopDragSeparator() {
        this.setState({draggingSeparatorIndex: null})
    }


    onDragSeparator(e) {
        const {draggingSeparatorIndex, draggingSeparatorX, colWidths} = this.state;

        if (draggingSeparatorIndex !== null) {
            const diff = draggingSeparatorX - e.clientX;

            let hasWrongWidth = false;

            const newColWidths = colWidths.map((colWidth, index) => {
                if (draggingSeparatorIndex === index) {
                    return colWidth - diff;
                }

                if (draggingSeparatorIndex + 1 === index) {
                    return colWidth + diff;
                }

                return colWidth;
            });

            newColWidths.forEach((newColWidth) => {
                if (newColWidth < 20) {
                    hasWrongWidth = true;
                }
            });

            if (!hasWrongWidth) {
                const newTableHeight = ReactDOM.findDOMNode(this.refs.table).offsetHeight;
                this.setState({
                    colWidths: newColWidths,
                    draggingSeparatorX: e.clientX,
                    tableHeight: newTableHeight
                });
            }
        }
    }

    render() {
        const tableStyle = {
            tableLayout: 'fixed',
        };

        //style={{height: 400, overflowY: 'auto', overflowX: 'hidden', }}

        return (
            <div>
                <div
                    onMouseMove={(e) => {this.onDragSeparator(e)}}
                     onMouseUp={(e) => {this.onStopDragSeparator(e)}}
                     onMouseLeave={(e) => {this.onStopDragSeparator(e)}}>
                    {this.renderBlockScreen()}
                    {this.renderControl()}
                    <table style={tableStyle} ref="table">
                        {this.renderHead()}
                        {this.renderBody()}
                    </table>
                </div>
                {this.renderPagination()}
            </div>
        )
    }
}