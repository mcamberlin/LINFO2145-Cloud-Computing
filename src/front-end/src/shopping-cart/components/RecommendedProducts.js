import React, { Component } from 'react'
import Product from './Product'

class RecommendedProducts extends Component {

    render() {
        let auth = this.props.authenticated
        let productsData = []

        if (auth) {
            productsData.push(
                <div key='recommended_products' className='container'>
                    <h1> You Might Also Like </h1>
                    <hr />
                </div>
            )


            for (let index = 0; index < this.props.recommendedProducts.length; index++) {
                const id = this.props.recommendedProducts[index]
                let recom = this.props.productsMap[id];
                productsData.push(
                    <Product key={recom.id} price={recom.price} name={recom.name}
                        image={recom.image} id={recom.id} category={recom.category} quantity={recom.quantity}
                        addToCart={this.props.addToCart} openModal={this.props.openModal}
                        authenticated={this.props.authenticated}
                    />
                )
            };
        }

        // Empty and Loading States
        let view
        if (!auth) {
            return (<div className='products-wrapper'> </div>);
        } else {
            view = <div className='products'> {productsData} </div>
        }
        return (
            <div className='products-wrapper'>
                {view}
            </div>
        )
    }
}

export default RecommendedProducts
