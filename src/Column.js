import React from "react";

export default class Column extends React.Component {

    render(){
        const {sortProp, onClick, columnIndex, width} = this.props;

        let style = {
            cursor: 'pointer',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
            width,
        };

        let sortIndicator;
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
            <th onClick={(e) => {onClick(e, columnIndex)}} style={style}>
                {this.props.children} {sortIndicator}
            </th>
        )
    }
}