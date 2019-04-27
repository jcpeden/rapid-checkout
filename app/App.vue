<template>
	<div id="rapid-checkout-desktop">
		<modals-container></modals-container>
	</div>
</template>

<script>
import Cart from './components/Cart.vue'
import axios from 'axios';
import MobileDetect from 'mobile-detect';
import './styles.scss';

export default {
	name: 'rapid-checkout',
	replace: false,
	data() {
		return {
		}
	},
	components: {
		Cart
	},
	methods: {
		async getStoreConfig(shop) {
			const response = await axios.get(process.env.BASE_URL + '/shops/' + shop);
      if (typeof response.data.style == 'string') {
        try {
          response.data.style = JSON.parse(response.data.style);
        } catch (e) {
        }
      }
			this.data = response.data;
		},
		getCurrentPage() {
			const parts = window.location.pathname.split("/");
			if (parts[0] === 'products') {
				return 'products';
			} else if (parts[0] === 'collection') {
				return 'collection';
			} else {
				return 'index';
			}
		},
		getAddToCartSelector() {
			switch (this.getCurrentPage()) {
				case 'products':
					return this.data.addToCartButtonProductPage;
				case 'collection':
					return this.data.addToCartButtonCollectionPage;
				case 'index':
					return this.data.addToCartButtonHomePage;
			}
		},
		getAddToCartForm() {
			return $('form[action="/cart/add"]');
		},
		getAddToCartData() {
			const $form = this.getAddToCartForm();
			const unindexedArray = $form.serializeArray();
			const indexedArray = {};

			$.map(unindexedArray, function(n, i){
				indexedArray[n['name']] = n['value'];
			});

			return indexedArray;
		},
		async addProduct(formData) {
			await axios.post('/cart/add.js', formData);
			await this.showPopup();
		},
		async showPopup() {
      const md = new MobileDetect(window.navigator.userAgent);
      if (md.phone()) {
        window.location.href = '/checkout';
      } else if (this.data.addToCartClick.includes("showPopup")) {
        const response = await axios.get('/cart.js');
        const cart = response.data;
        this.$modal.show(Cart, {cart, config: this.data}, {
          height: 'auto',
          scrollable: true
        });
      } else if (this.data.addToCartClick.includes("redirectToCheckout")) {
        window.location.href = '/checkout';
      }
		},
		cloneAddToCartButton() {
			const oldButton = $(this.getAddToCartSelector());
      if (oldButton.length) {
        const newButton = oldButton.clone();
        newButton.insertBefore(oldButton);
        oldButton.hide();
        newButton.click((event) => {
          event.preventDefault();
          event.stopPropagation();
          this.addProduct(this.getAddToCartData());
        });
      } else {
        console.log('Cannot find add to cart button, please reconfigure Rapid Checkout');
      }
		},
		setupCartIcon() {
			if (this.data.popupOptions.includes("openPopupByCartIcon")) {
				$('a[href="/cart"]').click((event) => {
					event.preventDefault();
					event.stopPropagation();
					this.showPopup();
				});
			}
    },
	},
	async mounted () {
		const shop = window.location.host;
		await this.getStoreConfig(shop);
		this.cloneAddToCartButton();
		this.setupCartIcon();
	}

}
</script>
