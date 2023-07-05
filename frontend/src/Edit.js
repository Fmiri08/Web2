import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Edit = () =>{

    const [game, setGame] = useState([])

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    const [imageURL, setImageURL] = useState("")

    let { id } = useParams();

    useEffect( () => {
        const download = async () => {
            if(id !== undefined){
                try {
                    const { data } = await axios.get(
                      `http://localhost:3001/item/${id}`
                    );
                    setGame(data.game);
                    setName(data.game.name);
                    setDescription(data.game.description);
                    setPrice(data.game.price);
                    setImageURL(data.game.imageURL);
                } catch (e) {
                    console.log(e);
                  }
            }else{
                setGame([]);
                setName("");
                setDescription("");
                setPrice(0);
                setImageURL("");
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
        console.log(imageURL)
        if(id !== undefined){
            if(game.name !== name || game.description !== description || game.price !== price || game.imageURL !== imageURL){
                console.log("asdasd")
                axios.put(`http://localhost:3001/modifyItem/${id}`, {
                    userId: getUserId(),
                    newName : name,
                    newPrice: price,
                    newDescription: description,
                    newImageURL : imageURL
                })
                navigate(`/`)
            }
        }
        else{
            if( "" !== name && "" !== description && "" !== price && "" !== imageURL && undefined !== name &&undefined !== description && undefined !== price && undefined !== imageURL){
                axios.post(`http://localhost:3001/addItem`, {
                    userId: getUserId(),
                    name: name,
                    price: price,
                    description: description,
                    imageURL: imageURL
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
    const checkAndSetImageURL = (value) =>{
        if(value == "" || value == null){
            setImageURL(game.imageURL)
        }
        else{
            setImageURL(value)
        }
    }

    return(<div>
        <div className="game">
            <div>
      <input className="imageURL" placeholder={game.imageURL} title="ImageURL" onChange={(e) => {checkAndSetImageURL(e.target.value)}}></input>
            </div>
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