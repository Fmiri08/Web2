import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Edit = () =>{

    const [game, setGame] = useState([])

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)

    let { id } = useParams();

    useEffect( () => {
        const download = async () => {
            console.log(id)
            if(id !== undefined){
                try {
                    const { data } = await axios.get(
                      `http://localhost:3001/item/${id}`
                    );
                    setGame(data.game);
                    setName(data.game.name);
                    setDescription(data.game.description);
                    setPrice(data.game.price);
                  } catch (e) {
                    console.log(e);
                  }
            }else{
                setGame([]);
                setName("");
                setDescription("");
                setPrice(0);
              }
            /* itt történik a letöltés */
            
          };
          download();
    }, [id]
        
    )
    const navigate = useNavigate()

    const getUserId = () => {
        return localStorage.getItem("id")
    }

    const click = async () => {
        if(id !== undefined){
            if(game.name !== name || game.description !== description || game.price !== price){
                axios.put(`http://localhost:3001/modifyItem/${id}`, {
                    userId: getUserId(),
                    newName : name,
                    newPrice: price,
                    newDescription: description
                })
                navigate(`/`)
            }
        }
        else{
            if( "" !== name && "" !== description && "" !== price && undefined !== name &&undefined !== description && undefined !== price){
                axios.post(`http://localhost:3001/addItem`, {
                    userId: getUserId(),
                    name: name,
                    price: price,
                    description: description
                })
                navigate(`/`)
            }
        }
    }

    const checkAndSetName = (value) =>{
        if(value == "" || value == null){
            setName(game.name)
        }
        else{
            setName(value)
        }
    }

    const checkAndSetPrice = (value) =>{
        if(value == "" || value == null){
            setPrice(game.price)
        }
        else{
            setPrice(parseInt(value))
        }
    }

    const checkAndSetDescription = (value) =>{
        if(value == "" || value == null){
            setDescription(game.description)
        }
        else{
            setDescription(value)
        }
    }

    return(<div>
        <div className="game">
            <div>
      <input className="gameName" placeholder={game.name} title="Name" onChange={(e) => {checkAndSetName(e.target.value)}}></input>
            </div>
            <div>
      <input placeholder={game.description} title="Description" className="gameDesc" onChange={(e) => checkAndSetDescription(e.target.value)}></input>
            </div>
        <div>
      <input placeholder={game.price} title="Price" type="number" min="1" step="1" onChange={(e) => checkAndSetPrice(e.target.value)}/>
        </div>
        <div>
        <button onClick={click}>Save game</button>
        </div>
      </div>
    </div>)

}
export default Edit