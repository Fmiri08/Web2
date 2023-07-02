import axios from 'axios'
import { useState } from 'react'

const Login = () => {

const [username, setUsername] = useState(' ')
const [password, setPassword] = useState(' ')

// backend hívás, 
const login = async () => {
    const { data } = await axios.post(`http://localhost:3001/login`, {
      username: username,
      password: password,
    })
    axios.defaults.headers.authorization = `Bearer ${data.token}`
    window.localStorage.setItem('token', data.token)
    window.localStorage.setItem('id', data.id)
    console.log(data)
  }

    return (
        <div className="login">
            <div>Username</div>
            <input onChange={(e) => setUsername(e.target.value)}></input>
            <div>Password</div>
            <input onChange={(e) => setPassword(e.target.value)} type="password"></input>
            <div><button onClick={login}>Login</button></div>
        </div>
    )
}

export default Login