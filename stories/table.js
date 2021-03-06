import React from "react";
import {storiesOf, action} from "@kadira/storybook";
import {Table, Column} from "../src/index";
import faker from "faker";
import "../style/main.less";

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
        [i + 1, faker.random.arrayElement(names), faker.random.arrayElement(emails), faker.address.zipCode(), faker.address.zipCode(), faker.address.zipCode(), faker.address.zipCode()]
    )
}

storiesOf('Button', module)
    .add('lazy render', () => {

        return (
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
            </div>
        )
    })
    .add('pagination', () => {

        return (
            <div>
                <div>Table contains <strong>{data.length}</strong> rows.</div>
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
            </div>
        )
    })
    .add('fixed width with first static column', () => {

        return (
            <div>
                <div>Table contains <strong>{data.length}</strong> rows.</div>
                <Table data={data}
                       rowHeight={25}
                       height={400}
                       width={900}
                       headerHeight={50}
                       fixedFirstColumn
                       >
                    <Column width={80}>ID</Column>
                    <Column width={400}>Name</Column>
                    <Column>EMail</Column>
                    <Column>ZIP-1</Column>
                    <Column>ZIP-2</Column>
                    <Column>ZIP-3</Column>
                    <Column>ZIP-4</Column>
                </Table>
            </div>
        )
    });