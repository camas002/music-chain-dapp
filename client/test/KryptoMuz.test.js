const {assert} = require('chai')

const KryptoMuz = artifacts.require('./KryptoMuz');

// check for chai
require('chai')
.use(require('chai-as-promised'))
.should()

contract('KryptoMuz', (accounts) => {
    let contract
    // before tells our tests to run this first before anything else 
    before( async () => {
    contract = await KryptoMuz.deployed() 
    })

    // testing container - describe 

    describe('deployment', async() => {
        // test samples with writing it 
        it('deploys successfuly', async() => {
            const address = contract.address;
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
            assert.notEqual(address, 0x0)
        })
        it('has a name', async() => {
            const name = await contract.name()
            assert.equal(name, 'KryptoMuz')
        })
        it('has a symbol', async() => {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'KMUZ')
        })
    })

    describe('minting', async ()=> {
        it('creates a new token', async () => {
            const result = await contract.mint('https...1')
            const totalSupply = await contract.totalSupply()
            //Success
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args
            assert.equal(event._from, '0x0000000000000000000000000000000000000000', 'from the contract')
            assert.equal(event._to, accounts[0], 'to is msg.sender')

            //Failure
            await contract.mint('https...1').should.be.rejected;
        })
    })

    describe('indexing', async ()=> {
        it('lists KryptoMuz', async() => {
            // Mint three new tokens
            await contract.mint('https...2')
            await contract.mint('https...3')
            await contract.mint('https...4')
            const totalSupply = await contract.totalSupply()
            // Loop through list and grab KMUZ from list
            let result = []
            let KryptoMuz
            for(i = 1; i <= totalSupply; i++) {
                KryptoMuz = await contract.kryptoMuz(i - 1)
                result.push(KryptoMuz)
            }
        })
    })
}) 