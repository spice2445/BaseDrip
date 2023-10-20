// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * You can earn extra bDRIP by recruiting others to join your teams. Receive 5% of referrals deposits, and 2.5% of their compounds. Build and incentivize users to join your team with airdrops.
    Picking a Buddy Address
    By simply connecting their wallets to our Dapp, users are automatically linked to the dev wallet. Some investors will feel more comfortable supporting the dev wallet. However, we would like to note that there will be no airdrop incentive for doing so. Instead, we encourage everyone to join someone else’s buddy address for potential airdrops and team-building activities. 
    Simply enter your team leader’s wallet address in the team section and approve the transaction. Once you use a buddy address, you are on that person's team. 
    If you are not happy with your Buddy, you can switch teams by paying a fee of 0.05 ETH.  In order to switch teams, you must enter and approve a new buddy address. The fee allows users some flexibility but also prohibits the bad behavior of frequently switching teams. 
    Claiming Referral Rewards
    Referral commissions will be sent to your rewards wallet located inside the Team tab of our Dapp. Users will have two options on what to do with their pending rewards. 
        1. Compound rewards into an existing Garden(s) using its ID
        2. Withdraw rewards to your Metamask or Wallet Connect less a 30% tax for doing so.
    To qualify for referral rewards & airdrops, Garden Holders accounts must be in Net Positive standing. NET DEPOSIT VALUE = ( Deposits + Airdrops + Compounds ) - Claims*
 */

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

interface IFaucet {
    function deposit(uint faucetId, address user, uint amount) external;
}
interface IERC20 {
    function approve(address spender, uint amount) external returns (bool);
}

contract Teams is Ownable {

    uint    public changeReferralFee = 0.05 ether;
    address public ownerReferralAddress;
    address public gardenContractAddress;
    address public faucetContractAddress;
    address public bDripContractAddress;

    mapping(address user => Referrals) public referrals;

    struct Referrals {
        address referralAddress;
        uint    claimableAmount;
        uint    amountClaimed;
        uint    lastClaim;
    }

    event ReferralAmountAdded(address indexed user, uint amount);
    event ReferralClaimed    (address indexed user, uint amount);
    event ReferralChanged    (address indexed user, address referral);

    error WrongETHForReferralFee();
    error OnlyGarden();
    error NothingToClaim();
    error NotYourReferral();

    modifier onlyGarden() {
        if(msg.sender != gardenContractAddress) revert OnlyGarden();
        _;
    }

    /**
     * @dev remember to set gardenContractAddress, faucetContractAddress, bDripContractAddress manually
     * @param _ownerReferralAddress address of the owner referral
     */
    constructor (address _ownerReferralAddress) Ownable(msg.sender) {
        ownerReferralAddress = _ownerReferralAddress;
    }

    /**
     * @dev set the garden contract address
     * @param _gardenContractAddress address of the garden contract
     */
    function setgardenContractAddress(address _gardenContractAddress) external onlyOwner {
        gardenContractAddress = _gardenContractAddress;
    }
    
    /**
     * 
     * @param _faucetContractAddress address of the faucet contract
     */
    function setFaucetContractAddress(address _faucetContractAddress) external onlyOwner {
        faucetContractAddress = _faucetContractAddress;
    }

    /**
     * 
     * @param _bDripContractAddress address of the bDrip contract
     */
    function setbDripContractAddress(address _bDripContractAddress) external onlyOwner {
        bDripContractAddress = _bDripContractAddress;
    }

    /**
     * 
     * @param fee uint fee to change referral
     */
    function setReferralFee(uint fee) external onlyOwner {
        changeReferralFee = fee;
    }

    /**
     * @dev set the referral amount from Garden contract
     * @notice the garden will check if the user has the correct referral address, otherwise will not call this function
     * @param _user address of the user
     * @param _amount uint amount to set
     */
    function setReferralAmount(address _user, uint _amount) external onlyGarden {
        Referrals storage referral = referrals[_user];
        referral.claimableAmount += _amount;
        emit ReferralAmountAdded(_user, _amount);
    }

    /**
     * @dev change referral address
     * @notice will ignore all previous storage
     * @param _referral address of the new referral
     */
    function setReferral(address _referral) external payable {
        Referrals storage referral = referrals[msg.sender];
        if(referral.referralAddress != address(0) && msg.value != changeReferralFee) revert WrongETHForReferralFee();

        referral.referralAddress = _referral;
        emit ReferralChanged(msg.sender, _referral);
    }

    /**
     * @dev compound referral amount
     * @notice will call the faucet contract to deposit the amount
     * @param _user address of the user
     * @param faucetId uint id of the faucet
     */
    function compoundReferral(address _user, uint faucetId) external {
        Referrals storage referral = referrals[_user];
        uint amount                = referral.claimableAmount;
        address referralAddress    = referral.referralAddress;

        if(referralAddress == address(0)) revert WrongETHForReferralFee();
        if(referralAddress != msg.sender) revert NotYourReferral();
        if(amount          == 0)          revert NothingToClaim();

        referral.claimableAmount = 0;
        referral.amountClaimed  += amount;
        referral.lastClaim      = block.timestamp;

        // call faucet contract to claim
        // all the checks & revert are handled by the faucet contract
        IERC20(bDripContractAddress).approve(faucetContractAddress, amount);
        IFaucet(faucetContractAddress).deposit(faucetId, msg.sender, amount);
        emit ReferralClaimed(msg.sender, amount);
    }

    /**
     * @dev get the current referral address
     * @param _user address of the user
     * @return address of the referral
     */
    function getCurrentReferral(address _user) external view returns(address) {
        return referrals[_user].referralAddress;
    }
}