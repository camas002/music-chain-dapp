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
        const networkData = Kryptomuz.networks[networkId]

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
                <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
                    <div className='navbar-brand col-sm-3 col-md-3 mr-0' style={{color:'white'}}>
                        Kryptomuz NFT's
                    </div>
                    <ul className='navbar-nav px-3'>
                        <l className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                            <small className='text-white'>
                                {this.state.account}
                            </small>
                        </l>
                        
                    </ul>
                </nav>
                <br></br><br></br>
                <h1>NFT Marketplace</h1>
            </div>
        )
    }
}

export default App;