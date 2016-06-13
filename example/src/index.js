import React from "react";
import ReactDOM from "react-dom";
import {Table, Column} from "../../src/index";
import faker from "faker";
import "../../style/main.less";

let names = [];
for (let i = 0; i < 100; i++) {
    names.push(faker.name.findName());
}

let emails = [];
for (let i = 0; i < 100; i++) {
    emails.push(faker.internet.email());
}

let data = [];
for (let i = 0; i < 200000; i++) {
    data.push(
        [i + 1, faker.random.arrayElement(names), faker.random.arrayElement(emails), faker.address.zipCode(), faker.address.zipCode(), faker.address.zipCode(), faker.address.zipCode()]
    )
}

ReactDOM.render(
    <div>
        <div>Table contains <strong>{data.length}</strong> rows.</div>
        <Table data={data}
               height={400}
               debug>
            <Column>ID</Column>
            <Column>Name</Column>
            <Column>EMail</Column>
            <Column>ZIP-1</Column>
            <Column>ZIP-2</Column>
            <Column>ZIP-3</Column>
            <Column>ZIP-4</Column>
        </Table>
    </div>,
    document.getElementById('root')
);