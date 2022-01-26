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
        console.log(this.state.account)

        // create a constant js variable networkId which is set to the blockchain (ganache) network id
        const networkId = await web3.eth.net.getId()

        //check to see if the networkId is setData (working)
        const networkData = Kryptomuz.networks[networkId]

        //check to see if we are hooked up correctly
        if(networkData){
            const abi = Kryptomuz.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address)
            this.setState({contract})
            console.log(this.state.contract);

            // call the total supply of our Krypto Muz
            // grab the total supply on the front end and log results
            // go to web3 doc and read up on methods and call

        } else {
            window.alert('Smart contract not deployed')
        }
    }

    constructor(props){
        super(props);
        this.state = {
            account:'',
            contract:null,
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
                        <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                            <small className='text-white'>
                                {this.state.account}
                            </small>
                        </li>
                        
                    </ul>
                </nav>
                <br></br><br></br>
                <h1>NFT Marketplace</h1>
            </div>
        )
    }
}

export default App;