import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import Game from "./Game";
import Login from "./Login";
import Header from "./Header";
import Edit from "./Edit";
import Cart from "./Cart";
import Register from "./Register";

const Router = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Header className="header" />
        </div>
        <Routes>
          {/*azért exact, mivel ha magában a path lenne, akkor mindegyik 
          út megfelelne ennek.*/}
          <Route exact path="/"  element={<Home/>}/>
          <Route path="/login"  element={<Login/>}/>
          <Route path="/register"  element={<Register/>}/>
          <Route path="/cart"  element={<Cart/>}/>
          <Route path="/editItem/:id"  element={<Edit/>}/>
          <Route path="/editItem"  element={<Edit/>}/>
          <Route path="/id/:id" element={<Game />}/>
          {/*Bármilyen nem létező út a home-ra vezet vissza */}
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
