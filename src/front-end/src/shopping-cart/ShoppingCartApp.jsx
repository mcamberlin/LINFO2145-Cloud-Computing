import React, { Component } from 'react'
import Header from './components/Header'
import Products from './components/Products'
import RecommendedProducts from './components/RecommendedProducts'
import QuickView from './components/QuickView'
import Checkout from './components/Checkout'
import ProductsService from '../interfaces/ProductService';
import PurchasesService from '../interfaces/PurchaseService';
import RecommendationsService from '../interfaces/RecommendationsService';

class ShoppingCartApp extends Component {

    componentWillMount() {
        this.initialiseState(true)
    }

    constructor(props) {
        super(props)
        this.handleCategory = this.handleCategory.bind(this)
        this.handleAddToCart = this.handleAddToCart.bind(this)
        this.sumTotalItems = this.sumTotalItems.bind(this)
        this.sumTotalAmount = this.sumTotalAmount.bind(this)
        this.checkProduct = this.checkProduct.bind(this)
        this.handleRemoveProduct = this.handleRemoveProduct.bind(this)
        this.handleClearCart = this.handleClearCart.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.endCheckout = this.endCheckout.bind(this)
        this.handleCheckout = this.handleCheckout.bind(this)
        this.makePurchase = this.makePurchase.bind(this)
        this.automaticUpdate = this.automaticUpdate.bind(this)
    }

    initialiseState(firstCall) {
        if (firstCall) {
            this.state = {
                products: [],
                recommendedProducts: [],
                cart: [],
                totalItems: 0,
                totalAmount: 0,
                term: '',
                category: '',
                cartBounce: false,
                quickViewProduct: {},
                modalActive: false,
                doCheckout: false,
                purchaseId: null,
                oldPurchases: [],
                purService: new PurchasesService(),
                proService: new ProductsService(),
                recomService: new RecommendationsService()
            }
            this.state.purService.setHandlers(
                (hist) => { this.setState({ oldPurchases: hist }) },    // setPurHistory
                (c) => {
                    // As setState is async, we need to call the calculations function after the state is updated
                    this.setState({ cart: c }, () => {
                        this.sumTotalItems(this.state.cart)
                        this.sumTotalAmount(this.state.cart)
                    })
                })
            this.state.proService.setHandlers(
                (list) => { this.setState({ products: list }) },                        // setProducts
                (categories) => { this.setState({ categories: categories }) },          // setCategories
                (productsMap) => { this.setState({ productsMap: productsMap }) }        // setProductsMap
            )

            this.state.recomService.setHandlers(
                (productIds) => { this.setState({ recommendedProducts: productIds }) }   // setRecommendedProducts
            )

        }
        else {
            this.setState({
                products: [],
                recommendedProducts: [],
                cart: [],
                totalItems: 0,
                totalAmount: 0,
                term: '',
                category: '',
                cartBounce: false,
                quickViewProduct: {},
                modalActive: false,
                doCheckout: false,
                purchaseId: null,
                oldPurchases: []
            })
        }
        this.state.proService.fetchProducts((errorMessage) => {
            if (errorMessage) {
                console.log(errorMessage)
                this.props.createFlashMessage(errorMessage, 'error')
            }
        })
        this.state.purService.fetchHistory()

    }

    componentDidMount() {
        this.automaticUpdate()
    }

    automaticUpdate() {
        this.state.proService.fetchProducts()
        if (this.props.authenticated) {
            this.state.recomService.fetchRecommendations();
            this.state.purService.getCart()
        }
        setTimeout(this.automaticUpdate, 5000)
    }


    handleCategory(event) { // Filter by Category
        this.setState({ category: event.target.value })
        console.log(this.state.category)
    }

    // ${chosenProduct} is a JSON object with the fields 
    // category=[string], id=[string], image=[string], name=[string], price=[int] and quantity=[int].
    handleAddToCart(chosenProduct) {
        let myCart = this.state.cart
        let productID = chosenProduct.id
        let productQty = chosenProduct.quantity
        this.props.logItemAddedToCart(productID, productQty)

        if (this.checkProduct(productID)) {
            let index = myCart.findIndex(x => x.id === productID)
            myCart[index].quantity = Number(myCart[index].quantity) + Number(productQty)
        } else {
            myCart.push(chosenProduct)
        }
        this.setState({
            cart: myCart,
            cartBounce: true
        })
        setTimeout(function () {
            this.setState({ cartBounce: false })
        }.bind(this), 1000)
        this.sumTotalItems(this.state.cart)
        this.sumTotalAmount(this.state.cart)
        this.state.purService.postProduct(chosenProduct)
    }

    handleRemoveProduct(id, e) {
        let cart = this.state.cart
        let index = cart.findIndex(x => x.id === id)
        this.props.logItemRemovedFromCart(id)
        this.state.purService.rmProduct(this.state.cart[index])
        cart.splice(index, 1)
        this.setState({
            cart: cart
        })
        this.sumTotalItems(this.state.cart)
        this.sumTotalAmount(this.state.cart)
        e.preventDefault()
    }

    async handleClearCart() {
        await this.state.purService.delCart()
        this.setState({
            cart: []
        })
        this.sumTotalItems(this.state.cart)
        this.sumTotalAmount(this.state.cart)
    }

    // Check if the product with product id ${productID} is already in the cart
    checkProduct(productID) {
        let cart = this.state.cart
        return cart.some(function (item) {
            return item.id === productID
        })
    }

    sumTotalItems() {
        let total = 0
        let cart = this.state.cart
        total = cart.length
        this.setState({
            totalItems: total
        })
    }

    sumTotalAmount() {
        let total = 0
        let cart = this.state.cart
        for (var i = 0; i < cart.length; i++) {
            // eslint-disable-next-line
            total += cart[i].price * parseInt(cart[i].quantity)
        }
        this.setState({
            totalAmount: Number((total).toFixed(2))
        })
    }

    openModal(product) {
        this.setState({
            quickViewProduct: product,
            modalActive: true
        })
        if (this.props.authenticated) {
            this.props.logItemViewed(product.id)
        }
    }

    closeModal() {
        this.setState({
            modalActive: false
        })
    }

    handleCheckout(e) {
        e.preventDefault()
        this.setState({ doCheckout: true })
    }

    endCheckout() {
        console.log('END of CHECKOUT')
        this.initialiseState(false)
        this.setState({ doCheckout: false })
    }

    makePurchase(purs, items) {
        this.state.purService.postPurchase(purs, items).then((id) => {
            this.state.purService.getCart()
            this.state.purService.fetchHistory()
        })
    }

    /* eslint-disable */
    render() {
        const { doCheckout } = this.state
        const { isAuthenticated } = this.props.authenticated
        return (
            <div>
                {doCheckout ?
                    <Checkout
                        id={this.state.purchaseId}
                        purchase={this.state.cart}
                        oldPurchases={this.state.oldPurchases}
                        endCheckout={this.endCheckout}
                        postPurchase={this.makePurchase}
                        clearCart={this.handleClearCart}
                        logCartCheckedOut={this.props.logCartCheckedOut}
                    />
                    : <div>
                        <Header
                            cartBounce={this.state.cartBounce}
                            total={this.state.totalAmount}
                            totalItems={this.state.totalItems}
                            cartItems={this.state.cart}
                            removeProduct={this.handleRemoveProduct}
                            handleCategory={this.handleCategory}
                            categoryTerm={this.state.category}
                            handleCheckout={this.handleCheckout}
                            setAuthStatus={this.props.setAuthStatus}
                            authenticated={this.props.authenticated}
                            logoutUser={this.props.logoutUser}
                        />

                        <RecommendedProducts
                            productsList={this.state.products}
                            productsMap={this.state.productsMap}
                            recommendedProducts={this.state.recommendedProducts}
                            searchTerm={this.state.term}
                            addToCart={this.handleAddToCart}
                            openModal={this.openModal}
                            authenticated={this.props.authenticated}
                        />

                        <Products
                            productsList={this.state.products}
                            searchTerm={this.state.term}
                            addToCart={this.handleAddToCart}
                            openModal={this.openModal}
                            authenticated={this.props.authenticated}
                        />
                        <QuickView
                            product={this.state.quickViewProduct}
                            openModal={this.state.modalActive}
                            closeModal={this.closeModal}
                            logItemViewed={this.props.logItemViewed} />
                    </div>
                }
            </div>
        )
    }
}

export default ShoppingCartApp
