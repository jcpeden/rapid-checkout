import {
  Button,
  Card,
  ChoiceList,
  Layout,
  Page,
  PageActions,
  TextField,
  Toast
} from '@shopify/polaris';

import { Component } from 'react';
import { withSSR } from "koa-nextjs/react";
import React from 'react';
import Link from 'next/link';

import '../app/styles.scss';

class Support extends Component {
  render() {
    return (
      <Page>
        <PageActions
          secondaryActions={[
            {
              content: 'Settings',
              url: "/"
            },
            {
              content: 'Support',
              url: "/support"
            },
          ]}
        />
        <Card sectioned>
          Documentation: <a target="_blank" href="https://getrapidcheckout.com/documentation/">https://getrapidcheckout.com/documentation/</a>
          <br />
          FAQ: <a target="_blank" href="https://getrapidcheckout.com/faq/">https://getrapidcheckout.com/faq/</a>
          <br />
          Contact Us: <a target="_blank" href="https://getrapidcheckout.com/contact-us/">https://getrapidcheckout.com/contact-us/</a>
        </Card>
      </Page>
    )
  }
}
import { from } from 'zen-observable';

export default withSSR()(Support);
