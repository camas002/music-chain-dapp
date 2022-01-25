import React, { Component } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Kryptomuz from '../abis/Kryptomuz.json'

class App extends Component {

    async componentDidMount(){
        await this.loadWeb3;
    }

    // detect ethereum provider
    async loadWeb3() {

        const provider = await detectEthereumProvider();

        // if there is a provider, log that it is working
        if(provider) {
            console.log('ethereum wallet is connected')
            window.web3 = new Web3(provider)
        } else {
            console.log('no ethereum wallet detected')
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