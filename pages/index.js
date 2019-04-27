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

import axios from 'axios';
import { withSSR } from "koa-nextjs/react";
import Cart from '../app/components/Cart.vue';
import { VueWrapper } from 'vuera';
import '../app/styles.scss';
import elementPicker from '../app/element-picker';
import Style from '../components/Style';
import Humanize from 'humanize-plus';
import Link from 'next/link'

class Index extends React.Component {
  state = {
    currentElement: '',
    showToast: false,
    addToCartClick: ['showPopup'],
    showOnPage: ['productPage'],
    continueShoppingClick: ['closePopup'],
    customUrl: '',
    popupOptions: ['showGoToCartButton'],
    addToCartButtonProductPage: '#AddToCart',
    addToCartButtonCollectionPage: '#AddToCart',
    addToCartButtonHomePage: '#AddToCart',
    style: {
      header: {
        backgroundColor: '#ffffff',
        size: '10'
      },
      title: {
        color: '#000000',
        fontSize: '18',
        fontFamily: '',
        fontStyle: [''],
        fontWeight: [''],
        textDecoration: ['']
      },
      desc: {
        color: '#a0a0a0',
        fontSize: '12',
        fontFamily: '',
        fontStyle: [''],
        fontWeight: [''],
        textDecoration: ['']
      },
      product_title: {
        color: '#000000',
        fontSize: '12',
        fontFamily: '',
        fontStyle: [''],
        fontWeight: [''],
        textDecoration: ['']
      },
      close_popup_button: {
        size: '14',
        color: '#a7a7a7',
        top: 15,
        right: 15
      },
      product_delete_button: {
        size: '14',
        color: '#a7a7a7',
      },
      continue_shopping_arrow: {
        size: '13',
        color: '#a7a7a7',
      },
      product_image: {
        width: '75',
        height: '75',
      },
      product_price: {
        color: '#000000',
        fontSize: '12',
        fontFamily: '',
        fontStyle: [''],
        fontWeight: [''],
        textDecoration: ['']
      },
      product_quantity: {
        color: '#000000',
        fontSize: '12',
        fontFamily: '',
        fontStyle: [''],
        fontWeight: [''],
        textDecoration: ['']
      },
      subtotal: {
        color: '#000000',
        fontSize: '12',
        fontFamily: '',
        fontStyle: [''],
        fontWeight: [''],
        textDecoration: ['']
      },
      subtotal_value: {
        color: '#000000',
        fontSize: '12',
        fontFamily: '',
        fontStyle: [''],
        fontWeight: [''],
        textDecoration: ['']
      },
      continue_shopping: {
        color: '#000000',
        fontSize: '12',
        fontFamily: '',
        fontStyle: [''],
        fontWeight: [''],
        textDecoration: ['']
      },
      quantity_buttons: {
        size: '26',
        borderColor: '#c4c4c4',
        borderWidth: '1',
        borderRadius: 0,
        color: '#a7a7a7',
        fontSize: 11
      },
      checkout_button: {
        backgroundColor: '#136857',
        buttonWidth: '25',
        buttonHeight: '10',
        borderColor: '#ffffff',
        borderWidth: '1',
        borderRadius: 0,
        color: '#ffffff',
        fontSize: 12,
        fontFamily: '',
        fontStyle: [''],
        fontWeight: ['bold'],
        textDecoration: ['']
      },
      go_to_cart_button: {
        backgroundColor: '#ffffff',
        buttonWidth: '25',
        buttonHeight: '10',
        borderColor: '#ffffff',
        borderWidth: '1',
        borderRadius: 0,
        color: '#00122f',
        fontSize: 12,
        fontFamily: '',
        fontStyle: [''],
        fontWeight: ['bold'],
        textDecoration: ['']
      }
    }
  };
  shop = '';

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.setState(this.props.shop);
    if (this.props.shop) {
      this.shop = this.props.shop.domain;
    }
    this.initElementPicker();
  }

  initElementPicker() {
    elementPicker.init({
      onClick: (element) => {
        this.initElementPicker();
        const elementName = element.dataset.editable;
        const settings = this.state.style[elementName];
        this.setState({currentStyle: settings});
        this.setState({currentElement: elementName});
      },
      target: '#rapid-checkout-desktop'
    });
  }

  render() {
    const {
      showToast,
      addToCartClick,
      showOnPage,
      continueShoppingClick,
      customUrl,
      popupOptions,
      addToCartButtonProductPage,
      addToCartButtonCollectionPage,
      addToCartButtonHomePage
    } = this.state;
    const elementName = Humanize.capitalize(this.state.currentElement.replace(/_/g, ' '));
    const sampleCart = {
      "token":"8e11b206e2af095bd9972d478dd746b8",
      "note":null,
      "attributes":{},
      "original_total_price":36000,
      "total_price":36000,
      "total_discount":0,
      "total_weight":0.0,
      "item_count":10,
      "items":[
        {
          "id":882594919,
          "properties":null,
          "quantity":3, "variant_id":882594919, "key":"882594919:6d4b6655c0f1f08ffbc936739032ad9a",
          "title":"Awesome Sneakers - Test \/ Test",
          "price":12000,
          "original_price":12000,
          "discounted_price":12000,
          "line_price":36000,
          "original_line_price":36000,
          "total_discount":0,
          "discounts":[],
          "sku":null,
          "grams":0,
          "vendor":"Tets",
          "taxable":true,
          "product_id":376291227,
          "gift_card":false,
          "url":"\/products\/awesome-sneakers?variant=882594919",
          "image":"https:\/\/cdn.shopify.com\/s\/files\/1\/0665\/1477\/products\/ni313171_600_thum1_10_674_17041.jpeg?v=1412590673",
          "handle":"awesome-sneakers",
          "requires_shipping":true,
          "product_type":"kicks",
          "product_title":"Awesome Sneakers",
          "variant_title":"Test \/ Test",
          "variant_options":["Test", "Test"]
        }
      ],
      "requires_shipping":true,
      "currency":"USD"
    }
    const toastMarkup = showToast ? (
      <Toast content="Setting saved" onDismiss={this.toggleToast} />
    ) : null;
    return (
      <Page>
        <PageActions
          primaryAction={{
            content: 'Save',
            onAction: async () => {
              await axios.put('/shops/' + this.shop, this.state);
              this.toggleToast();
            }
          }}
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
        <Card title="1-click ordering conditions" sectioned>
          <ChoiceList
            title={'Click on "Add to cart" button:'}
            choices={[
              {label: 'Show popup with added items', value: 'showPopup'},
              {label: 'Skip the cart page and go straight to checkout page', value: 'redirectToCheckout'}
            ]}
            selected={addToCartClick}
            onChange={this.handleAddToCartClickChange}
          />
          <br />
          <ChoiceList
            title={'Apply 1-click ordering feature on:'}
            choices={[
              {label: 'A product page', value: 'productPage'},
              {label: 'A collection page', value: 'collectionPage'},
              {label: 'The homepage', value: 'homePage'}
            ]}
            selected={showOnPage}
            onChange={this.handleShowOnPageChange}
            allowMultiple={true}
          />
        </Card>

        <Card title="Popup settings" sectioned>
          <ChoiceList
            title={'Click on "Continue shopping" button:'}
            choices={[
              {label: 'Close popup and stay on the same page', value: 'closePopup'},
              {label: 'Redirect customers to the homepage', value: 'redirectToHomepage'},
              {label: 'Redirect customers to product collection page', value: 'redirectToProductCollectionPage'},
              {
                label: 'Redirect to custom page',
                value: 'redirectToCustomPage',
                renderChildren: (isSelected) => {
                  return (
                    isSelected && (
                      <TextField
                        label="Custom Url"
                        labelHidden
                        onChange={this.handleCustomUrlChange}
                        value={customUrl}
                      />
                    )
                  );
                },
              }
            ]}
            selected={continueShoppingClick}
            onChange={this.handleContinueShoppingClickChange}
          />
          <br />
          <ChoiceList
            title={'Popup options:'}
            choices={[
              {label: 'Show "Go to Cart" button', value: 'showGoToCartButton'},
              {label: 'Open popup by Cart icon click', value: 'openPopupByCartIcon'}
            ]}
            selected={popupOptions}
            onChange={this.handlePopupOptionsChange}
            allowMultiple={true}
          />
        </Card>

        <Card title="Required settings" sectioned>
          <TextField
            label="Add to cart button selection on a product page:"
            onChange={this.handleAddToCartButtonProductPageChange}
            value={addToCartButtonProductPage}
          >
          </TextField>
          <br />
          <TextField
            label="Add to cart button selection on a collection page:"
            onChange={this.handleAddToCartButtonCollectionPageChange}
            value={addToCartButtonCollectionPage}
          >
          </TextField>
          <br />
          <TextField
            label="Add to cart button selection on the homepage:"
            onChange={this.handleAddToCartButtonHomePageChange}
            value={addToCartButtonHomePage}
          >
          </TextField>
          <br />
        </Card>
        <br />
        <Layout>
          <Layout.Section>
            <Card title="Popup design settings" sectioned>
                <div id="rapid-checkout-desktop">
                  <VueWrapper
                    component={Cart}
                    cart={sampleCart}
                    config={this.state}
                  ></VueWrapper>
                </div>
            </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <Style style={this.state.currentStyle} onChange={this.handleStyleChange} heading={elementName} />
          </Layout.Section>
        </Layout>
        {toastMarkup}
      </Page>
    );
  }

  handleAddToCartClickChange = (value) => {
    this.setState({addToCartClick: value})
  }
  handleShowOnPageChange = (value) => {
    this.setState({showOnPage: value})
  }
  handleContinueShoppingClickChange = (value) => {
    this.setState({continueShoppingClick: value})
  }
  handleCustomUrlChange = (value) => {
    this.setState({customUrl: value})
  }
  handlePopupOptionsChange = (value) => {
    this.setState({popupOptions: value})
  }
  handleAddToCartButtonProductPageChange = (value) => {
    this.setState({addToCartButtonProductPage: value})
  }
  handleAddToCartButtonCollectionPageChange = (value) => {
    this.setState({addToCartButtonCollectionPage: value})
  }
  handleAddToCartButtonHomePageChange = (value) => {
    this.setState({addToCartButtonHomePage: value})
  }
  handleStyleChange = (value) => {
    this.setState({currentStyle: value});
    const style = this.state.style;
    style[this.state.currentElement] = value;
    this.setState({style});
  }
  toggleToast = () => {
    this.setState(({showToast}) => ({showToast: !showToast}));
  };
}

export default withSSR()(Index);
