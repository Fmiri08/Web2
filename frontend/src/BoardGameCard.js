import { Link } from "react-router-dom";

//a listákban megtalálható elemeket kirajzoló függvény
const BoardGameCard = ({id}) => {
  return (
    <Link to={`/id/${id}`}>
      <div className="gamecard">
        {id}
      </div>
    </Link>
  );
};

export default BoardGameCard;
