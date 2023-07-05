import "./styles.css";
import Router from "./Router";

export default function App() {
  if (localStorage.getItem("cart") === null) {
    localStorage.setItem("cart", JSON.stringify({}));
  }
  return (
    <div className="App">
      <div className="App">
        {/* itt hívódik meg a router, ami megjeleníti a 
        weboldalt */}
        <Router />
      </div>
    </div>
  );
}