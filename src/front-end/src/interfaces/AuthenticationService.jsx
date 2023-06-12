import axios from 'axios' // axios = library used for HTTP client
// you can overwrite the URI of the authentication microservice with this environment variable
const url = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://192.168.64.13:3001'
//
class AuthenticationService {
    // setters
    setHandlers(onSucc, setAuthStatus, changeRoute, setAdminStatus) {
        this.onSucc = onSucc
        this.setAuthStatus = setAuthStatus      // (auth) => { this.setState({ authenticated: auth }) }
        this.changeRoute = changeRoute
        this.setAdminStatus = setAdminStatus    // (isAdmin, showAdmin) => {this.setState({ isAdmin: isAdmin, showAdmin: showAdmin})}
    }

    // POST /user
    // ${data} is a JSON object with the fields username=[string] and [password]. 
    // These fields matches the specification of the POST call
    registerUser(data, onErr) {
        window.localStorage.setItem('username', JSON.stringify(data.username))
        axios.post(`${url}/user`, data)
            .then((res) => {
                // we keep the authentication token
                window.localStorage.setItem('authToken', JSON.stringify(res.data.token))
                this.setAuthStatus(true)
                this.onSucc(`Successful registration of user [${data.username}]!`)
                this.changeRoute('/')

            })
            .catch((error) => {
                console.error(error.message)
                var msg = `Registration of user [${data.username}] failed.`
                onErr(`${msg} Error: ${error.msg}`)
            })
    }

    // GET /user/:username/:password
    loginUser(data, onErr) {
        window.localStorage.setItem('username', JSON.stringify(data.username))
        axios.get(`${url}/user/${data.username}/${data.password}`)
            .then((res) => {
                window.localStorage.setItem('authToken', JSON.stringify(res.data.token))
                this.setAuthStatus(true)
                this.onSucc(`Welcome back [${data.username}]!`)
                this.changeRoute('/')
            })
            .catch((error) => {
                console.error(error.message)
                onErr(`User [${data.username}] is not registered or his credentials are incorrect.`)
            })
    }

    loginAdmin(data, onErr) {
        window.localStorage.setItem('username', JSON.stringify(data.username))
        axios.get(`${url}/user/${data.username}/${data.password}`)
            .then((res) => {
                window.localStorage.setItem('authToken', JSON.stringify(res.data.token))
                if (res.data.isAdmin) {
                    this.setAuthStatus(true)
                    this.onSucc(`Logged in as [${data.username}]!`)
                    this.changeRoute('/')
                    this.setAdminStatus(true, true)
                } else {
                    this.setAuthStatus(true)
                    onErr(`[${data.username}] is not the admin account!`)
                    this.changeRoute('/')
                }
            })
            .catch((error) => {
                console.error(error.message)
                onErr(`User [${data.username}] is not registered or his credentials are incorrect.`)
            })
    }
}

export default AuthenticationService
