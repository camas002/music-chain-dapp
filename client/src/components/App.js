import React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoMuz from "../abis/KryptoMuz.json";
import axios from 'axios';
import homeLogo from '../logo/homeLogo.png';

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
} from "mdb-react-ui-kit";

import "./App.css";

//class Component
class App extends Component {
  //constructor
  constructor(props) {
    super(props);
    this.state = {
      account: "No Account Available",
      accountDisplay: "Not Connected",
      contract: "",
      totalSupply: 0,
      kryptoMuz: [],
      nftName: "",
      collectionName: "",
      PNG: null,
      Audio: null,
      automaticSwitch: "off"
    };
  }

  async componentDidMount(){
    if(this.state.automaticSwitch === "on"){
      this.connectWallet()
    }else{
      return
    }
  }

  onChangeTextfield = (e) =>{
    let field = e.target.name;
    let value = e.target.value;
    this.setState({
      [field]: value,
    });

    console.log(`${field} : ${value}`)
  }

 onChangeUploadPNG = (e) =>{

    // if (value.size > 1024){
    //   alert(`Error: File ${field} size too big`)
    // }else{
      this.setState({
        PNG: e.target.files[0],
        loaded: 0,
      })

      console.log(e.target.files[0])
    }

  onChangeUploadAudio = (e) =>{
      this.setState({
        Audio: e.target.files[0],
        loaded: 0,
      })
  
      console.log(e.target.files[0])
      }
  //}

//  onChangeAudio=event=>{
//     this.setState({
//       selectedAudio: event.target.files[0],
//       loaded: 0,
//     })
//   }

  //detect ethereum provider in browser
  async loadWeb3() {
    //get ethereum provider in browser
    const provider = await detectEthereumProvider();

    //modern browsers
    //if there is a provider then let's log that it's working
    //and access the window from dom to set Web3 to the provider
    if (provider) {

      // Request user to connect their wallet.
      await provider.request({method: 'eth_requestAccounts'});  
      console.log("ethereum wallet connected");

      //creating new instance of web3
      window.web3 = new Web3(provider);
      // document.location.reload();
      
    } else {
      //if there is no ethereum provider
      console.log("no ethereum wallet detected");
    }
  }

  async loadBlockchainData() {
    //refactoring window.web3 to web3 (optional)
    const web3 = window.web3;
    //get account connected on metamask
    const accounts = await web3.eth.getAccounts();

    //set the account property in state
    if(accounts){
      this.setState({
        account: accounts[0],
        accountDisplay: "Connected"
      });
    }else{
      this.setState({
        accountDisplay: "Not Connected"
      })
    }
    

    //get the network id to which metamask is connected
    const networkId = await web3.eth.net.getId();

    //check whether KryptoMuz contract is deployed to
    //network with same network id to which metamask is connected
    //KryptoMuz.networks = '5777' : {address:'', data:''}
    //networkId is a key inside 'networks' property
    //networkId key contains a value as object with property address, transaction hash and events
    // "networks": {
    //     "5777": {
    //         "events": {},
    //         "links": {},
    //         "address": "0x99161b9611B6F9d96c7e55736895AE1aa61AA102",
    //             "transactionHash": "0xdbf53eb4f35e33de22025d95e0bf41e1675052842a8f174fde4cb15b51f923a1"
    //     }
    const networkData = KryptoMuz.networks[networkId];

    //check whether the network id is same
    if (networkData) {
      //KryptoMuz.networks = '5777' : {address:'', data:''}
      //networkId is a key inside networks property
      //networkId contains a value as object with property ad
      // "networks": {
      //     "5777": {
      //         "events": {},
      //         "links": {},
      //         "address": "0x99161b9611B6F9d96c7e55736895AE1aa61AA102",
      //             "transactionHash": "0xdbf53eb4f35e33de22025d95e0bf41e1675052842a8f174fde4cb15b51f923a1"
      //     }

      //get abi of contract from abi property
      const abi = KryptoMuz.abi;

      //get network address from networkId property
      const address = networkData.address;

      //creating a new instance contract
      const contract = await new web3.eth.Contract(abi, address);

      this.setState({ contract });
      // console.log(this.state.contract);

      //call the total supply of Krypto Muz
      //grab the total supply on the front end and log the results
      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply });
      console.log(this.state.totalSupply);

      //set up an array to keep track of tokens
      //load kryptoMuz

      for (let i = 1; i <= totalSupply; i++) {
        let KryptoMuz = await contract.methods.kryptoMuz(i - 1).call();

        //how should we handle the state on the front end?
        //store the tokens minted so far
        this.setState({
          kryptoMuz: [...this.state.kryptoMuz, KryptoMuz],
        });
      }

      //console.log(this.state.kryptoMuz);
    }
    
    else {
    //if network id of metamask does not match to the network id
    //of the network to which contract is deployed
      window.alert("ERROR: Network id of metamask does not match the network id of the network to which you wish to deploy contracts to. Please make sure to connect to the right network.");
    }
  }

  //with minting we are sending information and we need to specify the account
  mint = (kryptoMuz) => {
    this.state.contract.methods
      .mint(kryptoMuz)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({
          kryptoMuz: [...this.state.kryptoMuz, KryptoMuz],
        });
      });
  };


  connectWallet = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    this.setState({
      automaticSwitch: "on",
    })
  }


  onClickHandler = async (e) => {
    e.preventDefault();
    const data = new FormData() 
    data.append('collectionName', this.state.collectionName)
    data.append('nftName', this.state.nftName)
    data.append('PNG', this.state.PNG)
    data.append('Audio', this.state.Audio)

    console.log(data)
    await axios.post("http://localhost:3001/upload", data)
      .then(res => { 
        console.log(res)
      }).catch((err) => alert("File Upload Error"));

  }




  //render component
  //JSX
  render() {
    return (
      <div className="container-filled">
        
        {console.log(this.state.kryptoMuz)}

        {/* Nav bar */}
        <nav className="navbar navbar-dark fixed-top bg-orange flex-md-nowrap p-0" style={{height: "3.5rem", width: "100%"}}>
      
          <div
            style={{ color: "white", display: "contents"}}
          >
           <div style={{paddingLeft: "5rem", fontSize: "23px", display: "inline-flex", alignItems: "center"}}><img src={homeLogo} className="customHomeLogo" alt="" loading="lazy"/> <b>DApollo</b> </div> <div><h4 style={{paddingLeft: "7rem"}}>NFT Marketplace</h4></div>
          
          
          <ul className="navbar-nav px-3">
            <ul className="ul-style">
              <li className="ul-category" > <b>Wallet:</b> {this.state.accountDisplay === "Connected" ? <p style={{color:"green", display: "contents" }}><b>{this.state.accountDisplay}</b></p> : <p style={{color:"red", display: "contents" }}><b>{this.state.accountDisplay}</b></p>}
                <ul className="ul-hidelist ul-style">
                  <li className="ul-accountlabel">Account: {this.state.account}</li>
                </ul>
              </li>
            </ul>
          </ul>
          </div>
        </nav>
        
        <div className="container-fluid mt-1">
          <div className="head-bord row">
            <main role="main" className="outerContainer">
              <div className="content mr-auto ml-auto" style={{ opacity: "0.8", display: "inline-flex", flexDirection: "column", flexWrap: "nowrap", alignItems: "center" }}>

                {/* Main Title */}
                {/* <h1 style={{ color: "black", padding: "0px", display: "inline-flex"}}>
                  Mint your song
                </h1> */}

              <div className="separateContainers">

                {/* STEP 1 Container */}
                <div className="coverterContainer leftContainer">
                  <h2 className="coverterTitle">STEP 1</h2>
                  <h5><b>Connect to MetaMask</b></h5>

                  <br/>

                  <div style={{display: "inline-flex", height: "calc(14rem)", flexDirection: "column", justifyContent: "space-around"}}>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        this.connectWallet();
                      }}
                    >
                      <div className="containerDescription">
                        <p> Download the MetaMask Extension to your browser</p>
                        <a href="https://metamask.io/download/" target="blank">MetaMask Extension</a>
                      </div>
                      
                      <br/><br/><h5><b>THEN</b></h5><br/>

                      {/* CONNECT WALLET (SUBMIT) */}
                      <div className="containerDescription">
                        <p> Connect your wallet to MetaMask</p>
                        <button style={{ margin: "0.5rem" }} type="submit" className="btn btn-primary btn-black">
                          CONNECT WALLET
                        </button>
                      </div>
                      {this.state.accountDisplay === "Connected" ? <p style={{color:"green" }}><b>{this.state.accountDisplay}</b></p> : <p style={{color:"red" }}><b>{this.state.accountDisplay}</b></p>}
                    </form>
                  </div>
                </div>

                {/* STEP 2 Container */}
                <div className="coverterContainer">
                  <h2 className="coverterTitle">STEP 2</h2>
                  <h5><b>Instructions</b></h5>

                  <br/>

                  <div>
                    <form 
                      onSubmit={
                        this.onClickHandler
                      }
                    >
                      {/* Name of Collection */}
                      <p> Instructions </p>
                      <input 
                        type="text"
                        placeholder="add collection name"
                        className="mb-1"
                        name="collectionName"
                        onChange={this.onChangeTextfield}
                        value={this.state.collectionName}
                        style={{textAlignLast:"center"}}
                      />

                      {/* Name of NFT */}
                      <p> Instructions </p>
                      <input 
                        type="text"
                        placeholder="add NFT name"
                        className="mb-1"
                        name="nftName"
                        onChange={this.onChangeTextfield}
                        value={this.state.nftName}
                        style={{textAlignLast:"center"}}
                      />

                      {/* Add PNG file */}
                      <p> Instructions </p>
                      <div class="file-upload-wrapper">
                      <input 
                        type="file"
                        placeholder="add PNG file"
                        className="mb-1 file-upload"
                        id="input-file-now"
                        name="PNG"
                        onChange={this.onChangeUploadPNG}
                        style={{textAlignLast:"center"}}
                      />
                      </div>
                      
                      {/* Add WAV or MP3 file */}
                      <p> Instructions </p>
                      <input 
                        type="file"
                        placeholder="add audio file"
                        className="mb-1"
                        name="Audio"
                        onChange={this.onChangeUploadAudio}
                        style={{textAlignLast:"center"}}
                      />

                      <br/>

                      {/* MINT BUTTON(SUBMIT) */}
                      <input
                        style={{ margin: "1rem" }}
                        type="submit"
                        value="CONVERT"
                        className="btn btn-primary btn-black"
                      />
                      
                    </form>
                  </div>
                </div>

                {/* STEP 3 Container */}
                <div className="coverterContainer rightContainer">
                  <h2 className="coverterTitle">STEP 3</h2>
                  <h5><b>Upload image URL to Mint</b></h5>

                  <br/>

                  <div>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const kryptoMuz = this.kryptoMuz.value;
                        this.mint(kryptoMuz);
                      }}
                    >
                      {/* Add file location */}
                      <p> Instructions </p>
                      <input
                        type="text"
                        placeholder="add file location"
                        className="mb-1"
                        ref={(input) => (this.kryptoMuz = input)}
                        style={{textAlignLast:"center"}}
                      />
{/* <UploadFiles /> */}
                      <br/>

                      {/* MINT BUTTON(SUBMIT) */}
                      <input
                        style={{ margin: "1rem" }}
                        type="submit"
                        value="MINT"
                        className="btn btn-primary btn-black"
                      />
                      
                    </form>
                  </div>
                </div>
                </div>
              </div>
            </main>
          </div>

          <hr/>

          {/*  if map is successful than renturn the following */}
          <div className="row text-center">
            {this.state.kryptoMuz.map((kryptoMuz, key) => {
              return (
                <div>
                  <div>
                    <MDBCard
                      className="token img"
                      style={{ maxWidth: "22rem" }}
                    >
                      <MDBCardImage
                        src={kryptoMuz}
                        position="top"
                        height="250rem"
                        style={{ marginRight: "4px" }}
                      />
                      <MDBCardBody>
                        <MDBCardTitle>KryptoMuz</MDBCardTitle>
                        <MDBCardText>
                        The KryptoMuz are one of kind individually created KMUZ from the Special Collection.
                         Each music has just one copy, and each music may only be held by one person.
                         {" "}
                        </MDBCardText>
                        <MDBBtn href={kryptoMuz}>Download</MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  }
}

export default App;
