import React, { Component } from 'react'
import Counter from './Counter'

class Product extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedProduct: {},
            quickViewProduct: {},
            product: {
                image: this.props.image,
                name: this.props.name,
                price: this.props.price,
                id: this.props.id,
                category: this.props.category,
                quantity: 1,
                quantityLeft: this.props.quantity
            },
            buttonLabel: 'ADD TO CART'
        }
        this.updateQuantity = this.updateQuantity.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            product: {
                image: nextProps.image,
                name: nextProps.name,
                price: nextProps.price,
                id: nextProps.id,
                category: nextProps.category,
                quantity: this.state.product.quantity,
                quantityLeft: nextProps.quantity
            }
        });
    }

    addToCart() {
        this.props.addToCart(this.state.product)
        this.setState({
            buttonLabel: '✔ ADDED'
        }, function () {
            setTimeout(() => {
                this.setState({ buttonLabel: 'ADD TO CART' })
            }, 1000)
        })
    }
    quickView() {
        this.setState({
            quickViewProduct: {
                image: this.props.image,
                name: this.props.name,
                price: this.props.price,
                quantity: this.props.quantity,
                id: this.props.id,
            }
        }, function () {
            this.props.openModal(this.state.quickViewProduct)
        })
    }
    updateQuantity(quantity) {
        this.setState({
            product: {
                image: this.props.image,
                name: this.props.name,
                price: this.props.price,
                id: this.props.id,
                category: this.props.category,
                quantity: quantity,
                quantityLeft: this.props.quantity
            }
        })
    }

    render() {
        let { image, name, price, quantityLeft } = this.state.product
        return (
            <div className='product'>
                <h4 className='product-name'>{name}<br />{quantityLeft} left at {price} €/kg</h4>
                <div className='product-image'>
                    <img src={image} alt={name}
                        onClick={this.quickView.bind(this)} />
                </div>
                <Counter updateQuantity={this.updateQuantity} />
                <div className='product-action'>
                    <button type='button' className={this.props.authenticated ? 'search-button' : 'disable-button'}
                        onClick={this.addToCart.bind(this)}>
                        {this.state.buttonLabel}
                    </button>
                </div>
            </div>
        )
    }
}

export default Product
