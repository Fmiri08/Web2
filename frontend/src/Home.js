import { useEffect, useState } from "react";
import axios from "axios";
import BoardGameCard from "./BoardGameCard";

const Home = () => {
  //a játék nevének State-je, ezt használja a keresés
  const [gameName, setGameName] = useState("");
  //a lekért játékok változója
  const [games, setGames] = useState([]);
  //ez a változó jelzi az effectnek, hogy leállhat
  const [doDownload, setDoDownload] = useState(false);

  const [init, setInit] = useState(false)

  /* ez a függvény akkor hívódik meg, ha keresni akarunk egy adott játékra,
  működése ugyanaz, mint a useEffect download függvénye, csak nem kell
  a doDownload State */
  async function downloadData() {
    try {
      /*itt történik a letöltés, a name=${gameName} adja meg azt, 
      hogy milyen szöveget tartalmazzon a játék neve*/
      const { data } = await axios.get(
        `http://localhost:3001/items/${gameName}`);

      setGames(
        data.game.map((game) => (
          <BoardGameCard
            key={game.name}
            id={game.name}
          />
        ))
      );
    } catch (e) {
      console.log(e);
    }
  }

  function setName(event) {
    setGameName(event.target.value);
  }
  /* Az oldal megynitásakor fut le */
  useEffect(() => {
    const download = async () => {
      try {
        /* itt történik a letöltés */
        const { data } = await axios.get(
            `http://localhost:3001/items`);
        /*itt hozza létre a program a megjelenített társasjáték listát */
        setGames(
          data.game.map((gameItem) => (
            <BoardGameCard
              key={gameItem.name}
              id={gameItem.name}
              imageURL={gameItem.imageURL}
            />
          ))
        );
        /* első futásra valamiért undefined jön vissza,
         ha már nem undefined az érték, akkor leállhat a useEffect */
        if (games !== undefined) {
          setDoDownload(true);
        }
      } catch (e) {
        console.log(e);
      }
    };
    download();
  }, [doDownload]);

  useEffect(() => {
    const initialize = async () => {
      if(window.localStorage.getItem('token') !== null) {
        const token = window.localStorage.getItem('token')
        axios.defaults.headers.authorization = `Bearer ${token}`
        setInit(true)
        const {
          data: { csrfToken },
        } = await axios.get('http://localhost:3001/csrf-protection')
        axios.defaults.headers.post['X-CSRF-TOKEN'] = csrfToken
      }
      if (!init) {
        initialize()
      }
    }
  })

  return (
    <div>
      <div className="searchField">
        <input
          value={gameName.value}
          onChange={setName}
          className="input"
        ></input>
        <button onClick={downloadData} className="button">
          Search
        </button>
      </div>
      <div className="cardDiv">{doDownload && games}</div>
    </div>
  );
};

export default Home;
