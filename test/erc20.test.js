// erc20.test.js

const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ERC20 = artifacts.require('ERC20Token');

contract('ERC20', function (accounts) {
    const _name = 'ALYRA';
    const _symbol = 'ALY';
    const _initialsupply = new BN(1000);
    const _decimals = new BN(18);
    const owner = accounts[0];
    const recipient = accounts[1];
    const recipient2 = accounts[2];

    beforeEach(async function () {
        this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
    });

    it('a un nom', async function () {
        expect(await this.ERC20Instance.name()).to.equal(_name);
    });

    it('a un symbole', async function () {
        expect(await this.ERC20Instance.symbol()).to.equal(_symbol);
    });

    it('a une valeur décimal', async function () {
        expect(await this.ERC20Instance.decimals()).to.be.bignumber.equal(_decimals);
    });

    it('vérifie la balance du propriétaire du contrat', async function (){
        let balanceOwner = await this.ERC20Instance.balanceOf(owner);
        let totalSupply = await this.ERC20Instance.totalSupply();
        expect(balanceOwner).to.be.bignumber.equal(totalSupply);
    });

    it('vérifie si un transfer est bien effectué', async function (){
        let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
        let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
        let amount = new BN(10);
        await this.ERC20Instance.transfer(recipient, amount, {from: owner});
        let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
        let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
    
        expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
        expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
    });

    it("vérifie l'approve", async function() {
        let amount = new BN(10);

        await this.ERC20Instance.approve(recipient, amount, {from:owner});

        let allowanceAfter1 = await this.ERC20Instance.allowance(owner, recipient);

        expect(allowanceAfter1).to.be.bignumber.equal(amount);

        let amount2 = new BN(100);

        await this.ERC20Instance.approve(recipient, amount2, {from:owner});

        let allowanceAfter2 = await this.ERC20Instance.allowance(owner, recipient);

        expect(allowanceAfter2).to.be.bignumber.equal(amount2);
    });

    it("vérifie le transferForm", async function() {
        let balanceOwnerBefore = await this.ERC20Instance.balanceOf(owner);
        let balanceRecipientBefore = await this.ERC20Instance.balanceOf(recipient2);
        let amount = new BN(20);

        await this.ERC20Instance.approve(recipient, amount, {from:owner});
        await this.ERC20Instance.transferFrom(owner, recipient2, amount, {from: recipient});

        let balanceOwnerAfter = await this.ERC20Instance.balanceOf(owner);
        let balanceRecipientAfter = await this.ERC20Instance.balanceOf(recipient2);
    
        expect(balanceOwnerAfter).to.be.bignumber.equal(balanceOwnerBefore.sub(amount));
        expect(balanceRecipientAfter).to.be.bignumber.equal(balanceRecipientBefore.add(amount));
    });
});