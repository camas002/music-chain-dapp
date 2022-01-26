import React, { Component } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Kryptomuz from '../abis/Kryptomuz.json'

class App extends Component {

    async componentDidMount(){
        await this.loadWeb3();
        await this.loadBlockchainData();    
    }

    // detect ethereum provider
    async loadWeb3() {
        const provider = await detectEthereumProvider();

        if(provider) {
            console.log('ethereum wallet is connected')
            window.web3 = new Web3(provider)
        } else {
            console.log('no ethereum wallet detected')
        }
    }

    // view blockchain account data
    async loadBlockchainData(){
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        this.setState({account:accounts})

        // create a constant js variable networkId which is set to the blockchain (ganache) network id
        const networkId = web3.eth.net.getId()

        //check to see if the networkId is setData (working)
        const networkData = KryptoBird.networks[networkId]

        //check to see if we are hooked up correctly
        if(networkData){
            
        }
    }

    constructor(props){
        super(props);
        this.state = {
            account:''
        }
    }

    render() {
        return (
            <div>
                <h1>NFT Marketplace</h1>
            </div>
        )
    }
}

export default App;