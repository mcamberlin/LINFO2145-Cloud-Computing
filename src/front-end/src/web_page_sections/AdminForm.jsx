import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import ProductService from '../interfaces/ProductService'

class AdminForm extends Component {
    componentWillMount() {
        this.state = {
            catalog: {},
            categories: [],
            products: [],     
            selectedProd: undefined,
            selectedCate: undefined,
            selectedFile: undefined,
            logOut: false,
            proService: new ProductService(),
            // New Category field
            new_category: '',
            // New Product fields
            name: '',
            price: '',
            category: '',
            quantity: '',
            image: ''
        }
        this.state.proService.setHandlers(
            (products) => { this.setState({ catalog: products }) },               // setCatalog
            (categories) => { this.setState({ categories: categories }) },         // setCategories    
            (productsMap) => { this.setState({ productsMap: productsMap }) }       // setProductsMap
            )

        this.state.proService.fetchProducts()

        this.state.proService.fetchCategories((errorMessage) => {
            if (errorMessage) {
                console.error(errorMessage);
                this.props.createFlashMessage(errorMessage, 'error');
            }
        })
    }

    constructor(props) {
        super(props)
        this.renderCategories = this.renderCategories.bind(this)
        this.renderProducts = this.renderProducts.bind(this)
        this.renderProductInfo = this.renderProductInfo.bind(this)
        this.logOut = this.logOut.bind(this)
        this.handleProductChange = this.handleProductChange.bind(this)
    }

    renderCategories() {
        const categoryIds = Object.keys(this.state.categories)

        return categoryIds.map((categoryId) => {
            const categoryName = this.state.categories[categoryId]
            return (<a id={categoryId} key={categoryId}
                onClick={(e) => { this.renderProducts(e) }}>{categoryName}</a>)
        })
    }

    renderProducts(e) {
        let categoryId = e.target.id
        this.setState({ selectedCate: categoryId })

        let categoryName = this.state.categories[categoryId]
        var products = this.state.catalog[categoryName]
        if(products == undefined){
            this.setState({products: []})
            return;
        }
        var prodIds = Object.keys(products)
        
        this.setState({
            products: prodIds.map((productId) => {
                var productName = products[productId].name
                return (<a key={productId} id={productId}
                    onClick={(ev) => { 
                                        let categoryName = this.state.categories[categoryId];
                                        this.state.catalog[categoryName][productId]["categoryName"] = categoryName;
                                        this.renderProductInfo(ev, categoryId, productId) }}>
                    {productName}
                </a>)
            })
        })
    }

    renderProductInfo(e, categoryId, productId) {
        this.setState({ selectedProd: productId})

        let categoryName = this.state.categories[categoryId]
        let product = this.state.catalog[categoryName][productId]

        let p = (<fieldset>
            <h1 className='welcome'>{`${product.name}`}</h1>

            Price:<br />
            <input style={{ width: '100%' }} type='text' name='price'
                value={product.price} onChange={this.handleProductChange.bind(this, productId, categoryId, 'price')} /><br />

            Category:<br />
            <input style={{ width: '100%' }} type='text' name='category'
                value={product.categoryName} onChange={this.handleProductChange.bind(this, productId, categoryId, 'categoryName')} /><br />

            Quantity:<br />
            <input style={{ width: '100%' }} type='text' name='quantity'
                value={product.quantity} onChange={this.handleProductChange.bind(this, productId, categoryId, 'quantity')} />

            Image URL:<br />
            <input style={{ width: '100%' }} type='text' name='image'
                value={product.image} onChange={this.handleProductChange.bind(this, productId, categoryId, 'image')} />
            <img style={{ width: '50%' }} src={product.image} alt={product.name} />

            
            <input style={{ width: '100%' }} type='file' name='image'
                onChange={this.handleProductChange.bind(this, productId, categoryId, 'image')}
            /> <br />

            <div className='form-group'>
                <div className='col-md-offset-2 col-md-10'>

                    <button
                        type='submit'
                        className='btn btn-success'
                        onClick={this.onUpdateProduct.bind(this, productId, categoryId)}
                    >Update </button>
                    <button className='btn btn-primary'
                        onClick={this.onRemoveProduct.bind(this, productId, categoryId)}
                    > Remove </button>

                </div>
            </div>
        </fieldset>)
        this.setState({
            selectedProd: p
        })
    }

    handleProductChange(productId, categoryId, tag, e) {
        const target = e.target
        let categoryName = this.state.categories[categoryId];
        let updateCatalog = this.state.catalog
        if (target.name === 'image') {
            // convert the image to data string
            var reader = new FileReader()
            reader.onload = function (e) {
                updateCatalog[categoryName][productId][tag] = e.target.result;
                this.setState({catalog: updateCatalog})
            }.bind(this)
            reader.readAsDataURL(target.files[0])
        }
        else {
            updateCatalog[categoryName][productId][tag] = e.target.value;
            this.setState({catalog: updateCatalog})
        }
        this.renderProductInfo(e, categoryId, productId) 
    }

    handleInputChange(tag, event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const field = target.name
        if (target.name === 'image') {
            // convert the image to data string
            var reader = new FileReader()
            reader.onload = function (e) {
                                            this.setState({ image: e.target.result })
                                        }.bind(this)
            reader.readAsDataURL(target.files[0])
            // this.setState({ 'image': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=" })
        } else {
            this.setState({ [field]: value })
        }
    }

    logOut(e) {
        this.props.logoutUser(e)
        this.props.setAuthStatus(false, false, false)
        this.props.setAdminStatus(false, false)
        this.setState({
            logOut: true
        })
        e.preventDefault()
    }

    onRemoveCategory(event) {
        event.preventDefault()
        let categoryId = this.state.selectedCate
        if (this.state.categories[categoryId] === "Miscellaneous") {
            this.props.createFlashMessage("'Miscellaneous' is a special category that cannot be removed.", 'error')
            return;
        }


        this.state.proService.deleteCategory(categoryId, (errorMessage) => {
            if (errorMessage) {
                console.log(errorMessage)
                this.props.createFlashMessage(errorMessage, 'error')
            }
        })

        const categoryName = this.state.categories[categoryId]

        // update categories
        let updateCategories = this.state.categories;

        // update catalog
        let updateCatalog = this.state.catalog;
        let oldCategory = updateCatalog[categoryName]; // category to remove to place inside Miscellaneous category
        let miscCategory = updateCatalog["Miscellaneous"];
        let newMiscalleneous = { ...oldCategory, ...miscCategory }

        delete updateCategories[categoryId]
        delete updateCatalog[categoryName]
        updateCatalog = { ...updateCatalog, "Miscellaneous": newMiscalleneous }


        this.setState({ catalog: updateCatalog, categories: updateCategories, selectedCate: undefined, selectedProd: undefined }, () => {
            this.renderCategories();
            this.props.createFlashMessage(`Category ${categoryName} correctly removed.`);
        })

    }

    onAddCategory(event) {
        event.preventDefault()

        let categoryInfo = { 'name': this.state.new_category }
        this.state.proService.addCategory(categoryInfo, (errorMessage) => {
            if (errorMessage) {
                console.log(errorMessage)
                this.state.props.createFlashMessage(errorMessage, 'error')
            }
        })
        .then((categoryId) => {

            // update categories
            let updateCategories = this.state.categories;
            updateCategories[categoryId] = this.state.new_category;

            //update catalog
            let updateCatalog = this.state.catalog;
            updateCatalog[this.state.new_category] = {};
            
            let new_category = this.state.new_category;
            this.setState({ catalog: updateCatalog, categories: updateCategories, new_category: '' }, () => {
                this.renderCategories();
                this.props.createFlashMessage(`Category ${new_category} correctly added.`);
            })

        })
    }

    onAddProduct(event) {
        event.preventDefault()

        var categoryName = this.state.category;
        var categoryId;
        let found = false;
        // check if categoryName already exists
        for (const [cId, cVal] of Object.entries(this.state.categories)) {
            if(cVal === categoryName){
                found = true;
                categoryId = cId;
            }
        }

        // new Category
        if(!found){
            this.state.proService.addCategory({"name": categoryName}, (errorMessage) => {
                if (errorMessage) {
                    console.log(errorMessage)
                    this.props.createFlashMessage(errorMessage, 'error')                }
            })
            .then ( (cId) => {
                categoryId = cId;
                var productInfo = {
                    'name': this.state.name, 'price': Number(this.state.price),
                    'category': categoryId, 'quantity': Number(this.state.quantity),
                    'image': this.state.image
                }
                
                this.state.proService.addProduct(productInfo, (errorMessage) => {
                    if (errorMessage) {
                        console.log(errorMessage)
                        this.props.createFlashMessage("The image is too big.", 'error')
                    }
                })
                .then((pId) => {
                    
                    productInfo["_id"] = pId;

                    // update categories
                    let updateCategories = this.state.categories;
                    updateCategories[categoryId] = categoryName;

                    //update catalog
                    let updateCatalog = this.state.catalog; 
                    updateCatalog[categoryName]={};
                    updateCatalog[categoryName][pId]= productInfo;
                    
                    this.setState({ catalog: updateCatalog, categories: updateCategories, name: '', price: '', category: '', quantity:'', image:'' }, () => {
                        this.renderCategories();
                        this.props.createFlashMessage(`Product ${productInfo.name} correctly added.`);
                    })
                })
            })
        }
        else{
            var productInfo = {
                'name': this.state.name, 'price': Number(this.state.price),
                'category': categoryId, 'quantity': Number(this.state.quantity),
                'image': this.state.image
            }
            
            this.state.proService.addProduct(productInfo, (errorMessage) => {
                if (errorMessage) {
                    console.log(errorMessage)
                    this.props.createFlashMessage("The image is too big.", 'error')
                }
            })
            .then(pId =>{
                productInfo["_id"] = pId;

                // update categories
                let updateCategories = this.state.categories;
                updateCategories[categoryId] = categoryName;

                //update catalog
                let updateCatalog = this.state.catalog;
                updateCatalog[categoryName][pId] = productInfo;

                this.setState({ catalog: updateCatalog, categories: updateCategories, name: '', price: '', category: '', quantity:'', image:'' }, () => {
                    this.renderCategories();
                    this.props.createFlashMessage(`Product ${productInfo.name} correctly added.`);
                })
            })
            
        }
    }

    onClearProduct(event) {
        event.preventDefault()
        this.setState({ name: '', price: '', category: '', quantity: '', image: '' })
    }

    onUpdateProduct(productId, categoryId, e) {
        e.preventDefault()
        let categoryName = this.state.categories[categoryId];
        let updatedCategoryName = this.state.catalog[categoryName][productId]["categoryName"];
        let updatedProduct = this.state.catalog[categoryName][productId];
        let updatedCatalog = this.state.catalog;

        // if category has changed
        if(updatedCategoryName !== categoryName){

            // check if categoryName already exists
            let found = false;
            for (const [cId, cVal] of Object.entries(this.state.categories)) {
                if(cVal === updatedCategoryName){
                    found = true;
                    //update product
                    updatedProduct["category"] = cId;
                    //delete updatedProduct["categoryName"];
                    //update catalog
                    delete updatedCatalog[categoryName][productId];
                    updatedCatalog[updatedCategoryName][productId] = updatedProduct;
                    break;
                }
            }
            
            // the new category does not exist yet
            if(!found){
                this.props.createFlashMessage("The provided new category does not exist yet: Add this new category first",'error')
                return;
            }
        }

        var productInfo = {
            'name': updatedProduct["name"], 'price': Number(updatedProduct["price"]),
            'category': String(updatedProduct["category"]), 'quantity': Number(updatedProduct["quantity"]),
            'image': updatedProduct["image"]
        }

        this.state.proService.updateProduct(productId, productInfo, (errorMessage) => {
            if (errorMessage) {
                console.log(errorMessage)
                this.props.createFlashMessage(errorMessage, 'error')
            }
        })
        .then(()=>{
            this.setState({ catalog: updatedCatalog }, () => {
                this.props.createFlashMessage(`Product ${productInfo.name} correctly modified.`);
            })
        })
    }

    onRemoveProduct(productId, categoryId, e) {
        e.preventDefault()

        this.setState({ selectedProd: undefined })
        this.state.proService.deleteProduct(productId, (errorMessage) => {
            if (errorMessage) {
                console.log(errorMessage)
                this.props.createFlashMessage(errorMessage, 'error')
            }
        })
        
        let categoryName = this.state.categories[categoryId]
        let updateCatalog = this.state.catalog
        delete updateCatalog[categoryName][productId]
        this.setState({ catalog: updateCatalog, selectedCate: undefined, products: [] }, () => {
            this.props.createFlashMessage(`Product correctly removed.`)
        })
    }

    render() {
        const { products, selectedProd, logOut, name, price, category, quantity, new_category } = this.state
        return logOut ? <Redirect to='/' /> : <div >
            <header>
                <div className='container'>
                    <h1 className='welcome' >Administrator's page</h1>
                    <h3 className='blank-space' />
                    <button className='btn btn-primary'
                        onClick={this.logOut}>Log out</button>
                </div>
            </header>


            <br />
            <div className='smaller-container'>
                <div className='checkout-container-l'>

                    <div className='vertical-menu'>
                        <a className='active'>Categories</a>
                        {this.renderCategories()}

                        <div className='form-group'>
                            <div className='col-md-offset-2 col-md-10'>
                                &nbsp;
                                <button
                                    type='submit'
                                    className='btn btn-primary'
                                    onClick={this.onRemoveCategory.bind(this)}
                                >Remove </button>
                            </div>
                        </div>

                    </div>

                    <h3 className='blank-space' />

                    { /* ===== NEW CATEGORY ====== */}
                    <div className='vertical-menu'>
                        <a className='active'>New Category</a>
                        <form className='form-horizontal'>
                            <fieldsetcategory>
                                Name:<br />
                                <input style={{ width: '100%' }} type='text' name='new_category'
                                    value={new_category} onChange={this.handleInputChange.bind(this, 'new_category')}
                                /> <br />
                            </fieldsetcategory>
                        </form>
                        <div className='form-group'>
                            <div className='col-md-offset-2 col-md-10'>
                                &nbsp;
                                <button
                                    type='submit'
                                    className='btn btn-success'
                                    onClick={this.onAddCategory.bind(this)}
                                >Add </button>
                            </div>
                        </div>
                    </div>

                    <h3 className='blank-space' />

                    { /* ===== NEW PRODUCT ====== */}
                    <div className='vertical-menu'>
                        <a className='active'>New Product</a>

                        <form className='form-horizontal'>
                            <fieldsetproduct>
                                Name:<br />
                                <input style={{ width: '100%' }} type='text' name='name'
                                    value={name} onChange={this.handleInputChange.bind(this, 'name')}
                                /> <br />

                                Price:<br />
                                <input style={{ width: '100%' }} type='text' name='price'
                                    value={price} onChange={this.handleInputChange.bind(this, 'price')}
                                /> <br />

                                Category:<br />
                                <input style={{ width: '100%' }} type='text' name='category'
                                    value={category} onChange={this.handleInputChange.bind(this, 'category')}
                                /> <br />

                                Quantity:<br />
                                <input style={{ width: '100%' }} type='text' name='quantity'
                                    value={quantity} onChange={this.handleInputChange.bind(this, 'quantity')}
                                /> <br />

                                Image:<br />
                                <input style={{ width: '100%' }} type='file' name='image'
                                    onChange={this.handleInputChange.bind(this, 'image')}
                                /> <br />
                            </fieldsetproduct>
                        </form>
                        <div className='form-group'>
                            <div className='col-md-offset-2 col-md-10'>
                                &nbsp;
                                <button
                                    type='submit'
                                    className='btn btn-success'
                                    onClick={this.onAddProduct.bind(this)}
                                >Add</button>
                                <button className='btn btn-primary'
                                    onClick={this.onClearProduct.bind(this)}
                                > Clear
                                </button>
                            </div>
                        </div>

                    </div>

                    <h3 className='blank-space' />

                    <div className='vertical-menu'>
                        <a className='active'>Products</a>
                        {products}
                    </div>

                    { /* eslint-disable*/}
                    <form >{
                        !selectedProd
                            ? <fieldset><h1 style={{ width: '50%' }} className='welcome'>Products details</h1></fieldset>
                            : selectedProd
                    }</form>

                </div>
            </div>
        </div>
    }
}

export default AdminForm
