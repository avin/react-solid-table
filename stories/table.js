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
for (let i = 0; i < 200; i++) {
    data.push(
        [i + 1, faker.random.arrayElement(names), faker.random.arrayElement(emails), faker.address.zipCode()]
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
                    <Column>ZIP</Column>
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
                    <Column>ZIP</Column>
                </Table>
            </div>
        )
    })
    .add('fixed width', () => {

        return (
            <div>
                <div>Table contains <strong>{data.length}</strong> rows.</div>
                <Table data={data}
                       rowHeight={25}
                       height={400}
                       width={900}
                       headerHeight={50}
                       debug>
                    <Column width={800}>ID</Column>
                    <Column width={800}>Name</Column>
                    <Column width={800}>EMail</Column>
                    <Column width={800}>ZIP</Column>
                </Table>
            </div>
        )
    });