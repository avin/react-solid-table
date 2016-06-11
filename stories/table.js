import React from "react";
import {storiesOf, action} from "@kadira/storybook";
import Table from '../src/index';
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
        for (let i = 0; i < 1000; i++) {
            data.push(
                [faker.random.arrayElement(names), faker.random.arrayElement(emails), faker.address.zipCode()]
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

        return (
            <Table columns={columns} data={data} liveResize={false}/>
        )
    });