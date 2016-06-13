import React from "react";
import {storiesOf, action} from "@kadira/storybook";
import { Table, Column } from '../src/index';
import faker from 'faker';
import '../style/main.less';

storiesOf('Button', module)
    .add('simple', () => {
        
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
                [i, faker.random.arrayElement(names), faker.random.arrayElement(emails), faker.address.zipCode()]
            )
        }

        //liveResize={false} perPage={20}

        return (
            <div>
                <div>Table contains <strong>{data.length}</strong> rows.</div>
                <Table data={data} height={400} debug perPage={20}>
                    <Column>ID</Column>
                    <Column>Name</Column>
                    <Column>EMail</Column>
                    <Column>ZIP</Column>
                </Table>
            </div>
        )
    });