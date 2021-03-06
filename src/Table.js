import React from "react";
import ReactDOM from "react-dom";
import find from "lodash/find";
import orderBy from "lodash/orderBy";
import {clearSelection} from "./helpers";


export default class Table extends React.Component {

    static propTypes = {
        data: React.PropTypes.array.isRequired,
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
            draggingSeparatorIndex: null,
            headerHeight: props.headerHeight || 50,
            rowHeight: props.rowHeight || 50

        }
    }

    componentDidMount() {
        const table = ReactDOM.findDOMNode(this.refs.table);
        const tableContainer = ReactDOM.findDOMNode(this.refs.tableContainer);
        const tableHeight = table.offsetHeight;
        const tableWidth = tableContainer.offsetWidth;
        let theadWidth = 0;

        const ths = table.querySelectorAll('thead th');
        let colWidths = [];

        React.Children.forEach(this.props.children, (column) => {
            const colWidth = Math.floor(column.props.width || tableWidth / ths.length);

            colWidths.push(colWidth);
            theadWidth += colWidth;
        });

        this.setState({colWidths, tableHeight, tableWidth, theadWidth});
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
            sortColumnsArr.push(`${sortItem.columnIndex}`);
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

    renderHead(onlyFirstColumn = false) {
        const {colWidths, sort, headerHeight} = this.state;

        const columns = React.Children.map(this.props.children, (column, columnIndex) => {

            if (onlyFirstColumn && (columnIndex !== 0)) {
                return;
            }

            const sortProp = find(sort, {columnIndex});
            const colWidth = colWidths[columnIndex];

            return (
                React.cloneElement(
                    column,
                    {
                        sortProp: sortProp,
                        columnIndex: columnIndex,
                        onClick: (e, thIndex) => {
                            this.sortBy(e, thIndex)
                        },
                        width: colWidth,
                        height: headerHeight
                    }
                )
            )
        });

        return (
            <thead key="thead">
                <tr style={{whiteSpace: 'nowrap'}}>
                    {columns}
                </tr>
            </thead>
        );
    }

    renderBody(onlyFirstColumn = false) {
        const {perPage, height} = this.props;
        const {page, colWidths, containerScrollTop, rowHeight} = this.state;
        const data = this.data;

        //Params for non-pages table

        let topHiddenHeight = 0;
        let bottomHiddenHeight = 0;

        const count = (height / rowHeight);
        const from = ((containerScrollTop || 0) / rowHeight);


        let listData;

        if (perPage) {
            listData = data.slice(page * perPage, page * perPage + perPage);
        } else {

            topHiddenHeight = from * rowHeight;

            bottomHiddenHeight = (data.length - (from + count)) * rowHeight;
            bottomHiddenHeight = (bottomHiddenHeight >= 0) ? bottomHiddenHeight : 0;

            listData = data.slice(from, from + count);
        }

        const trs = listData.map((row, trIndex) => {
            const tds = row.map((dataItem, tdIndex) => {
                if (onlyFirstColumn && (tdIndex !== 0)) {
                    return;
                }

                let style = {};
                if (colWidths[tdIndex] !== undefined) {
                    //style.width = colWidths[tdIndex];
                }
                return (
                    <td style={style} key={tdIndex}>{dataItem}</td>
                )
            });

            const key = trIndex + from;

            return (
                <tr key={key} style={{height: rowHeight, whiteSpace: 'nowrap'}}>
                    {tds}
                </tr>
            )
        });

        let bottomHiddenTr;
        if (bottomHiddenHeight) {
            bottomHiddenTr = (
                <tr style={{height: bottomHiddenHeight}}/>
            )
        }

        return (
            <tbody key="tbody">
                <tr style={{height: topHiddenHeight}}/>
                {trs}
                {bottomHiddenTr}
            </tbody>
        );
    }

    renderControl() {
        const {colWidths, tableHeight, tableWidth, draggingSeparatorIndex, containerScrollLeft} = this.state;
        const {debug, fixedFirstColumn} = this.props;

        const style = {
            position: 'relative',
        };

        let leftOffset = 0;

        const separators = colWidths.map((colWidth, index) => {
            //Don't draw last separator
            if (index === colWidths.length - 1) {
                return;
            }

            let firstSeparatorLeftOffset = 0;
            if (fixedFirstColumn){
                firstSeparatorLeftOffset = containerScrollLeft || 0;
            }

            const style = {
                left: colWidth + leftOffset + ((index===0) ? firstSeparatorLeftOffset : 0),
                paddingLeft: 5,
                paddingRight: 5,
                backgroundColor: '#f00',
                height: tableHeight,
                position: 'absolute',
                zIndex: 3,
                cursor: 'col-resize',
                opacity: debug ? 0.1 : 0
            };

            leftOffset = leftOffset + colWidth + 3;

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
            zIndex: 2,
            backgroundColor: '#0F0',
            opacity: debug ? 0.1 : 0,
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none'
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
        clearSelection();

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

    onScrollTableContainer(e) {
        this.setState({
            containerScrollTop: e.target.scrollTop,
            containerScrollLeft: e.target.scrollLeft
        });
    }

    renderFixedFirstColumn() {
        const {containerScrollLeft, containerScrollTop, colWidths} = this.state;
        const {fixedFirstColumn} = this.props;

        if (!fixedFirstColumn) {
            return;
        }

        let shadow = undefined;
        if (containerScrollLeft){
            shadow = `#999 0px 0px ${(containerScrollLeft < 10) ? containerScrollLeft : 10}px`
        }

        const fixedFirstColumnTableStyle = {
            tableLayout: 'fixed',
            minWidth: colWidths[0],
            maxWidth: colWidths[0],
            width: colWidths[0],
            position: 'absolute',

            zIndex: 1,
            top: 0,
            left: containerScrollLeft,
            boxShadow: shadow
        };

        const fixedFirstColumnHeaderTableStyle = {
            minWidth: colWidths[0],
            maxWidth: colWidths[0],
            width: colWidths[0],
            tableLayout: 'fixed',
            position: 'absolute',

            zIndex: 1, //!
            top: containerScrollTop, //!
            left: containerScrollLeft  //!
        };

        return (
            <div>
                <table style={fixedFirstColumnTableStyle} ref="staticTable">
                    {this.renderHead(true)}
                    {this.renderBody(true)}
                </table>

                <table style={fixedFirstColumnHeaderTableStyle}>
                    {this.renderHead(true)}
                </table>
            </div>
        )

    }

    render() {
        const {theadWidth, containerScrollTop} = this.state;
        const {height, width} = this.props;

        const tableStyle = {
            tableLayout: 'fixed',
            minWidth: theadWidth,
            maxWidth: theadWidth,
            width: theadWidth
        };

        const tableContainerStyle = {
            position: 'relative',
            height: height,
            overflowY: height ? 'auto' : 'hidden',
            overflowX: width ? 'auto' : 'hidden'
        };

        const fixedHeaderTableStyle = {
            minWidth: theadWidth,
            maxWidth: theadWidth,
            width: theadWidth,
            tableLayout: 'fixed',
            position: 'absolute',
            top: containerScrollTop
        };

        return (
            <div className="react-solid-table" style={{width}}>

                <div ref="tableContainer"
                     className="tableContainer"
                     style={tableContainerStyle}
                     onMouseMove={(e) => {this.onDragSeparator(e)}}
                     onMouseUp={(e) => {this.onStopDragSeparator(e)}}
                     onMouseLeave={(e) => {this.onStopDragSeparator(e)}}
                     onScroll={(e) => {this.onScrollTableContainer(e)}}>

                    {this.renderBlockScreen()}
                    {this.renderControl()}

                    <table style={tableStyle} ref="table">
                        {this.renderHead()}
                        {this.renderBody()}
                    </table>

                    <table style={fixedHeaderTableStyle}>
                        {this.renderHead()}
                    </table>

                    {this.renderFixedFirstColumn()}

                </div>

                {this.renderPagination()}
            </div>
        )
    }
}