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
for (let i = 0; i < 1000; i++) {
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
                       debug
                       height={400}
                       >
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
                       perPage={10}>
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
                       width={800}
                       headerHeight={50}>
                    <Column>ID</Column>
                    <Column>Name</Column>
                    <Column>EMail</Column>
                    <Column>ZIP</Column>
                </Table>
            </div>
        )
    });