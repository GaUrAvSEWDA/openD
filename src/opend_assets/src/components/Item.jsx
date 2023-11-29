import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
// import { idlFactory } from "../../../declarations/nft";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import Button from "./button";
import { opend } from "../../../declarations/opend";
function Item(props) {
  const [name, setName] = useState();
  const [ownerName, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPrinceInput] = useState();
  const [loaderHidden,setLoaderHidden] = useState(true);
  const [blurr,setBlurr] = useState();
  const [sellStatus , setSellStatus ] =  useState("");
  // taking hold of id using props 
  const id = props.id;
  // in order to access the nft canister we need to run a http command/local dfx on local computer

  const localhost = "http://127.0.0.1:8000/";
  // now creating a HTTP agent using agent module

  const agent = new HttpAgent({ host: localhost });
  // if deploy live remove below linee 
  agent.fetchRootKey();
  let NFTActor;
  async function loadNFT() {

    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });
    console.log("actor is " + NFTActor);
    const Name = await NFTActor.getName();
    const ownername = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }))
    setName(Name);
    setOwner(ownername.toText());
    setImage(image);
    
    // check whether it is already listed or not
    const nftIsListed = await opend.isListed(props.id);
    console.log(nftIsListed);
    if(nftIsListed){
      setOwner("OpenD");
      setBlurr({ filter : "blur(4px"});
      setSellStatus("Listed");
    }else{
      setButton(<Button handleClick={handleSell} text={"Sell"} />)
    }
  };
  // now we need to load nft only once so we will use useEffect hook for that
  useEffect(() => {
    loadNFT();
  }, []);
  // price varible 
  let price;
  function handleSell() {
    console.log("sell clicked");
    setPrinceInput(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => price = e.target.value}
      />
    );
    // after the first time button is pressed it take input value from the user
    // next time we need again rerender the button to make submit 
    // so again calling state 
    // and instead of calling handleClick again we need another function say sellItem 
    // once we click confirm button 
    setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  }

  async function sellItem() {
    setBlurr({ filter : "blur(4px"});
    // set loader hidden false
    setLoaderHidden(false);
    //  setButton(<Button hidden={false} text={"Processing"}/>);

    // price is passed as a string so it shows a error in frontend 
    // we need to pass a number so instead we will do Number(price)

    const listingResult = await opend.listItem(props.id, Number(price));
    console.log("Listing : " + listingResult);
    if (listingResult == "Success") {
      // now we wil transfer the ownership of the nft to the other new owner 
      // call the transfer ownership function from the backend
      console.log("hey");
      const openDiD = await opend.getOpenDCannisterID();
      const transferResult = await NFTActor.transferOwnerShip(openDiD);
      console.log(transferResult);
      if(transferResult=="Success"){
        // hide loader and button ans price input too 
        setLoaderHidden(true);
        setButton();
        setPrinceInput();
        // set owner name to OpenD
        setOwner("openD");
        setSellStatus("Listed");
      }
    }
  }
  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blurr}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus} </span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {ownerName}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
