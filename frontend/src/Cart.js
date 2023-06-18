import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Cart = () => {

    const [cartMap, setCartMap] = useState([])
    const [gamesMap, setGamesMap] = useState([])
    const [contentList, setContentList] = useState([])
    const [cost, setCost] = useState(0)
    
    const cart = localStorage.getItem("cart")
    const cartArray = cart.split(',')


    useEffect(() =>{

        const tempCartMap = []
        const games = []
        const tempContentList = []
        let tempCost = 0

        for(let i = 0; i<cartArray.length; i=i+2){
            tempCartMap[cartArray[i]] =  cartArray[i+1]
        }
        tempCartMap.pop()
        setCartMap(tempCartMap)

        const download = async () =>{
            for (const [key, value] of Object.entries(tempCartMap)) {
                if(key !==""){
                    try {
                    const { data } = await axios.get(
                        `http://localhost:3001/item/${key}`
                    );
                    games[data.game.name] = data.game.price

                    tempContentList.push(<div>
                        <p><div>Item name: {data.game.name}</div> <div>Item count: {tempCartMap[data.game.name]}</div> <div>Item total price: {tempCartMap[data.game.name]*data.game.price}</div> <button onClick={() => deleteFromCart(data.game.name)}>Delete from cart</button></p>
                    </div>)
                        tempCost = tempCost+tempCartMap[data.game.name]*data.game.price
                    } catch (e) { 
                        console.log(e);
                    }
              }}
              setGamesMap(games)
              setContentList(tempContentList)
              setCost(tempCost)
        };
        download();
    }, [gamesMap.length == 0])

    const deleteFromCart = (deleteItem) =>{
        const oldCartArray = localStorage.getItem("cart").split(',')
        let newCartString = ''
console.log(oldCartArray)
        for(let i = 0; i<oldCartArray.length-1; i=i+2){
            if(oldCartArray[i]!==deleteItem){
                console.log(i)
                newCartString=newCartString+oldCartArray[i]+","+oldCartArray[i+1]+","
            }
        }
        localStorage.setItem("cart", newCartString)
        window.location.reload(false);
    }

    const checkout = async() => {
        

        await axios.post(`http://localhost:3001/checkout`, {
            games: localStorage.getItem("cart").slice(0,localStorage.getItem("cart").length-1).split(','),
            userID: localStorage.getItem("id"),
            cost: cost
        })

        localStorage.setItem("cart", "")
    }



    return(
        <div className="cart">
    <div>{contentList}</div>
    <div>Cost: {cost}</div>
    { localStorage.getItem("token") !== null ? <Link to='/Home'  onClick={checkout}>Checkout</Link> : <p>Please login to checkout!</p>}
    </div>
    )


}

export default Cart