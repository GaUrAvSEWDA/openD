import React, { useEffect, useState } from "react";
import { BrowserRouter , Route, Switch } from 'react-router-dom';
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
// import AuthComponent from "./auth/AuthComponent";
import Item from "./Item";
import Minter from "./Minter";
import Register from "./Register";
import Home from "./Home";
import Login from "./login";
function App() {
  // const NFTID = "rrkah-fqaaa-aaaaa-aaaaq-cai";
  const [apiRes, setApiRes] = useState('');

  useEffect(() => {
    fetch("http://localhost:7001/testAPI")
      .then(res => res.text())
      .then(res => setApiRes(res))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      {/* <Header /> */}
      <p>{apiRes}</p>
      {/* <Register /> */}

      <BrowserRouter>
        <Switch>
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/' component={Home} />
        </Switch>
      </BrowserRouter>
      {/* <Minter /> */}
      {/* <Item id={NFTID} /> */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
