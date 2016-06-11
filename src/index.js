import React from 'react';
import ReactDOM from 'react-dom';

export default class Table extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
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

    renderHead() {
        const {columns} = this.props;
        const {colWidths} = this.state;

        const ths = columns.map((column, thIndex) => {
            let style = {};
            if (colWidths[thIndex] !== undefined) {
                style.width = colWidths[thIndex];
            }
            return (
                <th key={thIndex}
                    style={style}>
                    {column.title}
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
        const {data} = this.props;

        const trs = data.map((row, trIndex) => {
            const tds = row.map((dataItem, tdIndex) => {
                return (
                    <td key={tdIndex}>{dataItem}</td>
                )
            });

            return (
                <tr key={trIndex}>
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
            if (index === colWidths.length - 1){
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

        return (
            <div onMouseMove={(e) => {this.onDragSeparator(e)}}
                 onMouseUp={(e) => {this.onStopDragSeparator(e)}}
                 onMouseLeave={(e) => {this.onStopDragSeparator(e)}}>
                {this.renderControl()}
                <table style={tableStyle} ref="table">
                    {this.renderHead()}
                    {this.renderBody()}
                </table>
            </div>
        )
    }
}