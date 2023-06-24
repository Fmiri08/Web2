import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Register = () => {

    const [username, setUsername] = useState(' ')
    const [password, setPassword] = useState(' ')

    const navigate = useNavigate()
    
    const register = async () => {
        const {data} = await axios.post(`http://localhost:3001/register`, {
          username: username,
          password: password,
        })
        console.log(data)
        navigate(`/`)
      }


      return (
        <div className="login">
            <div>Username</div>
            <input onChange={(e) => setUsername(e.target.value)}></input>
            <div>Password</div>
            <input onChange={(e) => setPassword(e.target.value)} type="password"></input>
            <div><button onClick={register}>Register</button></div>
        </div>
    )

}

export default Register