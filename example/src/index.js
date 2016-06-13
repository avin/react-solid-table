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
        <h1>react-solid-table</h1>
        <p>
            These tables are lazy rendered, so there is no browser performance problems with HUGE amount of rows. <br/>
            You can find this component on <a href="https://github.com/avin/react-solid-table">GitHub</a>
        </p>
        <div>Demo tables contain <strong>{data.length}</strong> rows each one.</div>

        <h2>Simple</h2>

        <Table data={data}
               height={400}>
            <Column>ID</Column>
            <Column>Name</Column>
            <Column>EMail</Column>
            <Column>ZIP-1</Column>
            <Column>ZIP-2</Column>
            <Column>ZIP-3</Column>
            <Column>ZIP-4</Column>
        </Table>

        <h2>Specified width with first fixed column</h2>
        <Table data={data}
               rowHeight={25}
               height={400}
               width={900}
               headerHeight={50}
               fixedFirstColumn>
            <Column width={80}>ID</Column>
            <Column width={400}>Name</Column>
            <Column>EMail</Column>
            <Column>ZIP-1</Column>
            <Column>ZIP-2</Column>
            <Column>ZIP-3</Column>
            <Column>ZIP-4</Column>
        </Table>

        <h2>With pagination</h2>
        <Table data={data}
               rowHeight={25}
               headerHeight={50}
               perPage={10}
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