<template>
	<div class="rapid-checkout-popup rapid-checkout-popup-desktop rapid-checkout-template-3" data-editable="popup" data-rapid-checkout="popup">
		<header class="rapid-checkout-header" data-editable="header">
			<div class="rapid-checkout-title">
				<div data-editable="title" data-text-editable="title" v-bind:style="getStyle(config.style.title)">
					Cart Summary </div>
			</div>
			<div class="rapid-checkout-desc">
				<div data-editable="desc" data-text-editable="subtitle" v-bind:style="getStyle(config.style.desc)">
					Complete your purchase by clicking "Checkout" button </div>
			</div>
			<svg @click="$emit('close')" data-editable="close_popup_button" data-rapid-checkout="close-popup" class="rapid-checkout-close-popup-button" viewBox="0 0 20 20" focusable="false" aria-hidden="true" v-bind:style="getStyle(config.style.close_popup_button)">
				<path data-rapid-checkout="close-popup" d="M11.414 10l6.293-6.293a.999.999 0 1 0-1.414-1.414L10 8.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L8.586 10l-6.293 6.293a.999.999 0 1 0 1.414 1.414L10 11.414l6.293 6.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z" fill-rule="evenodd">
				</path>
			</svg>
		</header>
		<article class="rapid-checkout-body">
			<table class="rapid-checkout-products-list">
				<tbody>
					<tr v-for="item in cart.items" class="rapid-checkout-product-row" data-rapid-checkout="product-container">
						<td class="rapid-checkout-product-cell rapid-checkout-product-image">
							<a v-bind:href="item.url">
								<img data-editable="product_image" v-bind:src="item.image" v-bind:style="getStyle(config.style.product_image)">
							</a>
						</td>
						<td class="rapid-checkout-product-cell rapid-checkout-product-name">
							<div data-editable="product_title" v-bind:style="getStyle(config.style.product_title)">
								{{ item.title }}</div>
						</td>
						<td class="rapid-checkout-product-cell rapid-checkout-product-quantity">
							<div class="num-input">
								<div @click="changeQuantity(item, -1)" class="ni-button ni-button-left" data-rapid-checkout="quantity-minus" data-editable="quantity_buttons" v-bind:style="getStyle(config.style.quantity_buttons)">
									− </div>
								<input type="number" class="rapid-checkout-quantity" min="1" v-model="item.quantity" @change="updateItem(item, item.quantity)" data-editable="product_quantity" data-rapid-checkout="quantity" v-bind:style="getStyle(config.style.product_quantity)">
                <div @click="changeQuantity(item, 1)" class="ni-button ni-button-right" data-rapid-checkout="quantity-plus" data-editable="quantity_buttons" v-bind:style="getStyle(config.style.quantity_buttons)">
									+ </div>
							</div>
						</td>
						<td class="rapid-checkout-product-cell rapid-checkout-product-price">
							<div data-rapid-checkout="price-total" data-editable="product_price" v-bind:style="getStyle(config.style.product_price)">
								{{ formatCurrency(item.line_price / 100, cart.currency) }}</div>
						</td>
						<td class="rapid-checkout-product-cell rapid-checkout-product-delete">
							<svg @click="removeItem(item)" data-editable="product_delete_button" data-rapid-checkout="remove-button" viewBox="0 0 20 20" focusable="false" aria-hidden="true" v-bind:style="getStyle(config.style.product_delete_button)">
								<path data-rapid-checkout="remove-button" d="M11.414 10l6.293-6.293a.999.999 0 1 0-1.414-1.414L10 8.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L8.586 10l-6.293 6.293a.999.999 0 1 0 1.414 1.414L10 11.414l6.293 6.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z" fill-rule="evenodd">
								</path>
							</svg>
						</td>
					</tr>
				</tbody>
			</table>
		</article>
		<footer class="rapid-checkout-footer">
			<div class="rapid-checkout-subtotal-row">
				<div class="rapid-checkout-subtotal-label">
					<div data-editable="subtotal" data-text-editable="subtotal" v-bind:style="getStyle(config.style.subtotal)">
						Subtotal: </div>
				</div>
				<div class="rapid-checkout-subtotal-price">
					<div data-rapid-checkout="price-subtotal" data-editable="subtotal_value" v-bind:style="getStyle(config.style.subtotal_value)">
						{{ formatCurrency(cart.total_price / 100, cart.currency) }} </div>
				</div>
			</div>
			<div class="rapid-checkout-actions-row">
				<div class="rapid-checkout-continue-shopping">
					<div data-rapid-checkout="continue-shopping">
						<svg data-editable="continue_shopping_arrow" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" v-bind:style="getStyle(config.style.continue_shopping_arrow)">
							<path fill-rule="evenodd" d="M14 20.001a.994.994 0 0 1-.747-.336l-8-9a.999.999 0 0 1 0-1.328l8-9a.999.999 0 1 1 1.494 1.328l-7.41 8.336 7.41 8.336A.999.999 0 0 1 14 20.001z">
							</path>
						</svg>
						<span @click="continueShoppingClicked()" data-editable="continue_shopping" data-text-editable="continue-shopping" v-bind:style="getStyle(config.style.continue_shopping)">
							Continue Shopping </span>
					</div>
				</div>
				<div class="rapid-checkout-go-to-cart">
					<a v-if="showGoToCartButton()" href="/cart/" class="rapid-checkout-button" data-editable="go_to_cart_button" v-bind:style="getStyle(config.style.go_to_cart_button)"> <span data-text-editable="go-to-cart"> Go to Cart </span> </a>
				</div>
				<div class="rapid-checkout-checkout">
					<a href="/checkout/" class="rapid-checkout-button" data-editable="checkout_button" data-rapid-checkout="checkout" name="checkout" v-bind:style="getStyle(config.style.checkout_button)">
						<span data-text-editable="checkout">
							Checkout </span>
					</a>
				</div>
			</div>
		</footer>
	</div>
</template>

<script>
import axios from 'axios';
export default {
	name: 'Cart',
	props: {
		cart: {},
    config: {
      style: {
        title: {
          color: '#000000',
          fontSize: '18',
          fontFamily: '',
          fontStyle: [''],
          fontWeight: [''],
          textDecoration: ['']
        },
      }
    }
	},
	methods: {
		formatCurrency(number, currency) {
			return new Intl.NumberFormat('en-US', { style: 'currency', currency}).format(number);
		},
		async removeItem(item) {
			return await this.updateItem(item, 0);
		},
		async updateItem(item, quantity) {
			const formData = new FormData();
			formData.set('id', item.id);
			formData.set('quantity', quantity);
			const response = await axios.post('/cart/change.js', formData);
			this.cart = response.data;
		},
		async changeQuantity(item, quantity) {
			return await this.updateItem(item, item.quantity + quantity);
		},
		continueShoppingClicked() {
			if (this.config.continueShoppingClick[0] === "closePopup") {
				this.$emit('close');
			} else if (this.config.continueShoppingClick[0] === "redirectToHomepage") {
				window.location.href = "/";
			} else if (this.config.continueShoppingClick[0] === "redirectToProductCollectionPage") {
				window.location.href = "/collection/all";
			} else if (this.config.continueShoppingClick[0] === "redirectToCustomPage") {
				window.loation.href = this.config.customUrl;
			}
		},
		showGoToCartButton() {
			return this.config.popupOptions.includes("showGoToCartButton");
		},
    getStyle(style) {
      const result = {};
      for (const key in style) {
        if (style.hasOwnProperty(key)) {
          if (key == 'size' || key == 'fontSize' || key == 'width' || key == 'height' || key == 'borderWidth') {
            result[key] = style[key] + 'px';
          } else if (key == 'buttonWidth') {
            result['paddingLeft'] = style[key] + 'px';
            result['paddingRight'] = style[key] + 'px';
          } else if (key == 'buttonHeight') {
            result['paddingTop'] = style[key] + 'px';
            result['paddingBottom'] = style[key] + 'px';
          } else {
            result[key] = style[key];
          }
        }
      }
      return result;
    }
	}
}
</script>
