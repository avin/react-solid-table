import React from "react";
import ReactDOM from "react-dom";
import Table from '../../src/Table';
import faker from 'faker';
import '../../style/main.less';

let names = [];
for (let i = 0; i < 100; i++) {
    names.push(faker.name.findName());
}

let emails = [];
for (let i = 0; i < 100; i++) {
    emails.push(faker.internet.email());
}

let data = [];
for (let i = 0; i < 2000; i++) {
    data.push(
        {
            content: [faker.random.arrayElement(names), faker.random.arrayElement(emails), faker.address.zipCode()],
            id: i
        }
    )
}

const columns = [
    {
        title: 'Name'
    },
    {
        title: 'EMail'
    },
    {
        title: 'ZIP'
    }
];

//perPage={20}

ReactDOM.render(
    <div>
        <div>Table contains <strong>{data.length}</strong> rows.</div>
        <Table columns={columns} data={data} liveResize={false} perPage={20}/>
    </div>,
    document.getElementById('root')
);