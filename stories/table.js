import React from "react";
import {storiesOf, action} from "@kadira/storybook";
import Table from '../src';
import '../style/main.less';

storiesOf('Button', module)
    .add('simple', () => {

        const columns = [
            {
                title: 'Column 1'
            },
            {
                title: 'Column 2'
            },
            {
                title: 'Column 3'
            }
        ];

        const data = [
            ['11', 'data1.2', 'data1.3'],
            ['11', 'data2.2', 'data2.3'],
            ['22', 'data3.2', 'data3.3'],
        ];

        return (
            <Table columns={columns} data={data}/>
        )
    });