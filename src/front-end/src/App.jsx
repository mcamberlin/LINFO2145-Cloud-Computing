import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import AdminForm from './web_page_sections/AdminForm'
import LoginForm from './web_page_sections/LoginForm'
import LoginFormAdmin from './web_page_sections/LoginFormAdmin'
import RegisterForm from './web_page_sections/RegisterForm'
import ShoppingCartApp from './shopping-cart/ShoppingCartApp'
import FlashMessages from './web_page_sections/FlashMessages'
import AuthenticationService from './interfaces/AuthenticationService'
import LogService from './interfaces/LogService'

import './shopping-cart/scss/style.css'

class App extends Component {
    componentWillMount() {
        window.localStorage.clear()
        this.state = {
            showRegis: false,
            authenticated: false, 
            showLogin: false,
            isAdmin: false,
            showAdmin: false,
            saved: [],
            flashMessages: [],
            authService: new AuthenticationService(),
            logService: new LogService()
        }
        this.state.authService.setHandlers(
            (msg, msgType) => { this.createFlashMessage(msg, msgType) },                        // onSucc  
            (auth) => { this.setState({ authenticated: auth }) },                               // setAuthStatus
            (route) => { this.props.history.push(route) },                                      // changeRoute
            (isAdmin, showAdmin) => {this.setState({ isAdmin: isAdmin, showAdmin: showAdmin})}  // setAdminStatus
        )
    }

    constructor(props) {
        super(props)
        this.logoutUser = this.logoutUser.bind(this)
        this.deleteFlashMessage = this.deleteFlashMessage.bind(this)
        this.createFlashMessage = this.createFlashMessage.bind(this)
        this.loginUser = this.loginUser.bind(this)
        this.loginAdmin = this.loginAdmin.bind(this)
        this.registerUser = this.registerUser.bind(this)
        this.setAuthStatus = this.setAuthStatus.bind(this)
        this.setAdminStatus = this.setAdminStatus.bind(this)
        this.logItemViewed = this.logItemViewed.bind(this)
        this.logItemAddedToCart = this.logItemAddedToCart.bind(this)
        this.logItemRemovedFromCart = this.logItemRemovedFromCart.bind(this)
        this.logCartCheckedOut = this.logCartCheckedOut.bind(this)
    }

    // <FlashMessages /> banner with some informative messages
    createFlashMessage(text, type = 'success') {
        const message = { text, type }
        this.setState({
            flashMessages: [...this.state.flashMessages, message]
        })
    }

    deleteFlashMessage(index) {
        if (index > 0) {
            this.setState({
                flashMessages: [
                    ...this.state.flashMessages.slice(0, index),
                    ...this.state.flashMessages.slice(index + 1)
                ]
            })
        } else {
            this.setState({
                flashMessages: [...this.state.flashMessages.slice(index + 1)]
            })
        }
    }

    registerUser(userData, callback) {
        this.state.authService.registerUser(userData, callback)
    }

    loginAdmin(userData, callback) {
        this.state.authService.loginAdmin(userData, callback)
    }

    loginUser(userData, callback) {
        this.state.authService.loginUser(userData, callback)
    }

    logItemViewed(itemId, callback) {
        this.state.logService.logUserActivity({ eventType: "ItemViewed", details: { itemId } }, callback)
    }

    logItemAddedToCart(itemId, quantity, callback) {
        this.state.logService.logUserActivity({ eventType: "ItemAddedToCart", details: { itemId, quantity } }, callback)
    }

    logItemRemovedFromCart(itemId, callback) {
        this.state.logService.logUserActivity({ eventType: "ItemRemovedFromCart", details: { itemId } }, callback)
    }

    logCartCheckedOut(items, callback) {
        this.state.logService.logUserActivity({ eventType: "CartCheckedOut", details: { items } }, callback)
    }

    logoutUser(e) {
        e.preventDefault()
        this.setAuthStatus(false, false, false)
        this.setAdminStatus(false, false)
        this.props.history.push('/')
        this.createFlashMessage('You are now logged out')
    }

    setAuthStatus(auth, showRegis, showLogin) {
        this.setState({
            showRegis: showRegis,
            authenticated: auth,
            showLogin: showLogin
        })
    }

    setAdminStatus(isAdmin,showAdmin) {
        this.setState({
            isAdmin: isAdmin,
            showAdmin: showAdmin
        })
    }

    render() {
        const { flashMessages, showRegis, authenticated, showLogin, isAdmin, showAdmin} = this.state
        return (
            <div >
                <FlashMessages
                    deleteFlashMessage={this.deleteFlashMessage}
                    messages={flashMessages}
                />
                <br />
                <Switch>

                    <Route exact path='/register' render={() => {
                        return <RegisterForm
                            createFlashMessage={this.createFlashMessage}
                            setAuthStatus={this.setAuthStatus}
                            registerUser={this.registerUser} />
                    }}
                    />

                    <Route exact path='/login' render={() => {
                        return <LoginForm
                            createFlashMessage={this.createFlashMessage}
                            setAuthStatus={this.setAuthStatus}
                            loginUser={this.loginUser} />
                    }}
                    />

                    <Route exact path='/login/admin' render={() => {
                        return <LoginFormAdmin
                            createFlashMessage={this.createFlashMessage}
                            setAuthStatus={this.setAuthStatus}
                            setAdminStatus={this.setAdminStatus}
                            loginAdmin={this.loginAdmin} />
                    }}
                    />

                    <Route exact path='/admin' render={() => {
                        if (isAdmin){
                            return <AdminForm
                                createFlashMessage={this.createFlashMessage}
                                setAuthStatus={this.setAuthStatus}
                                setAdminStatus={this.setAdminStatus}
                                logoutUser={this.logoutUser}/>   
                        }
                        else {
                            return <Redirect to='/login/admin' />
                        }
                    }}
                    />

                    <Route exact path='/' render={() => {
                        if (showAdmin) {
                            return <Redirect to='/admin' /> 
                        }else if (authenticated) {
                            return <ShoppingCartApp
                                    setAuthStatus={this.setAuthStatus}
                                    authenticated={authenticated}
                                    logoutUser={this.logoutUser}
                                    logItemViewed={this.logItemViewed}
                                    logItemAddedToCart={this.logItemAddedToCart}
                                    logItemRemovedFromCart={this.logItemRemovedFromCart}
                                    logCartCheckedOut={this.logCartCheckedOut} />
                        } else if (showRegis) {
                            return <Redirect to='/register' />
                        } else if (showLogin) {
                            return <Redirect to='/login' />
                        }else {
                            return <ShoppingCartApp
                                setAuthStatus={this.setAuthStatus}
                                authenticated={authenticated} />
                        }
                    }}
                    />
                    <Redirect to='/' />
                </Switch>

            </div>
        )
    }
}

export default App
