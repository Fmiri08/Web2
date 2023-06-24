import React, { useContext, useEffect, useReducer, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Game = () => {

  const navigate = useNavigate()
  //a paraméternek kapott játék name
  let { id } = useParams();
  //a visszakapott játék object
  const [game, setGame] = useState([]);
  //ez a változó jelzi az effectnek, hogy leállhat
  const [doDownload, setDoDownload] = useState(false);
  //a kocsiban van-e a item
  const [added, setAdded] = useState(false);
    //a kocsiban van-e a item
  const [count, setCount] = useState(' ');
  //a kedvenc lista
  const [list, dispatch] = useReducer(reducer, {
    list: localStorage.getItem("cart")
  });
  //a kedvenc gomb szövege
  const buttonTextContext = React.createContext("Add to cart");
  const buttonText = useContext(buttonTextContext);

  //reducer, ez határozza meg, hogy milyen akció hajtódjon végre
  //ha megnyomják a kosárhoz adés gombot
  function reducer(state, action) {
    switch (action) {
      case "add":
        return addToCart(state.list);
      default:
        throw new Error();
    }
  }

  function isAdded() {
    let list = localStorage.getItem("cart");
    setAdded(list !== "null" && list.includes(id + ","));
  }
  function addToCart(state) {
    if (state === "null" || state === null) {
      state = "";
    }
    state = state + id + ","+count+",";
    localStorage.setItem("cart", state);
    isAdded();
    return { list: state };
  }


  function click() {
    dispatch("add");
  }

  const deleteGame = async() => {
     
    await axios.delete(`http://localhost:3001/deleteItem`,
   {data: {name: game.name}})

    navigate(`/`)
  }


  /* Az oldal megynitásakor fut le, működési elve megegyezik a Home-ban találhatóéval */

  useEffect(() => {
    setAdded(isAdded);
    const download = async () => {
      /* itt történik a letöltés 
       */
      try {
        const { data } = await axios.get(
          `http://localhost:3001/item/${id}`
        );
        setGame(data.game);
        if (game !== undefined) {
          setDoDownload(true);
        }
      } catch (e) {
        console.log(e);
      }
    };
    download();
  }, [doDownload]);
  return (
    <div className="game">
      <div className="gameName">Name: {doDownload && game.name}</div><br/>
      <div className="gameDesc">
        Description: {doDownload && game.description.toString()}
      </div><br/>
      <div className="gameDesc">
        Price: {doDownload && game.price.toString()}
      </div>
      <div>
      Quantity <input disabled={added} type="number" min="1" step="1" onChange={(e) => setCount(e.target.value)} 
      onKeyDown={ (event) => {event.preventDefault()}}/>
      <div>
      <button className="gameButton" disabled={added} onClick={click}>{buttonText}</button>
      </div>
      <div>
      <Link to={`/editItem/${game.name}`}>Edit game</Link>
      </div><br/>
      <button className="gameButton"  onClick={deleteGame}>Delete game</button>
      </div>
    </div>
  );
};

export default Game;
