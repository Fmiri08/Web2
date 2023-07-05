import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Cart = () => {

    const [cartMap, setCartMap] = useState([])
    const [gamesMap, setGamesMap] = useState([])
    const [contentList, setContentList] = useState([])
    const [cost, setCost] = useState(0)
    
    const tempCartMap = new Map(Object.entries(JSON.parse(localStorage.getItem("cart"))))


    useEffect(() =>{

        const games = []
        const tempContentList = []
        let tempCost = 0
        setCartMap(tempCartMap)

        const download = async () =>{
            for (const [gameName, count] of tempCartMap) {
                    try {
                    const { data } = await axios.get(
                        `http://localhost:3001/item/${gameName}`
                    );
                    console.log(data.game.price)
                    games[data.game.name] = data.game.price

                    tempContentList.push(<div>
                        <p><div>Item name: {data.game.name}</div> <div>Item count: {count}</div> <div>Item total price: {count*data.game.price}</div> <button onClick={() => deleteFromCart(data.game.name)}>Delete from cart</button></p>
                    </div>)
                        tempCost = tempCost+count*data.game.price
                    } catch (e) { 
                        console.log(e);
                    }
                }
              setGamesMap(games)
              setContentList(tempContentList)
              setCost(tempCost)
        };
        download();
    }, [gamesMap.length == 0])

    const deleteFromCart = (deleteItem) =>{
        console.log(deleteItem)
        tempCartMap.delete(deleteItem)
        console.log(tempCartMap)

        localStorage.setItem("cart", JSON.stringify(Object.fromEntries(tempCartMap)))
        window.location.reload(false);
    }

    const checkout = async() => {
        let cartArray = []
        for (const [gameName, count] of tempCartMap) {
            cartArray.push(gameName)
            cartArray.push(count)
        }

        await axios.post(`http://localhost:3001/checkout`, {
            games: cartArray,
            userID: localStorage.getItem("id"),
            cost: cost
        })

        localStorage.setItem("cart", JSON.stringify({}))
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