import { Link } from "react-router-dom";

//a listákban megtalálható elemeket kirajzoló függvény
const BoardGameCard = ({id, imageURL}) => {
  return (
    <Link to={`/id/${id}`}>
      <div className="gamecard">
        <div>
          <img src={imageURL} alt="" className="image" />
        </div>
        {id}
      </div>
    </Link>
  );
};

export default BoardGameCard;
