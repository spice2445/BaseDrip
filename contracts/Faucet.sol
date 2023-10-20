// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/** token logics description
bDRIP Faucet - a set of smart contracts that dish out 1% daily returns for 365 days of bDRIP tokens you stake here. It's like an account where you can earn daily rewards on your staked bDRIP!
We've got 5,000 Faucet accounts up for grabs, and you can open one by depositing 10 bDRIP tokens at the start. 
Once you've open your Faucet account and staked your bDRIP tokens, they're locked in for good. But don't worry, because from that moment on, your Faucet will churn out 1% returns daily, up to an amazing 365% in total!
Each Faucet can generate up to 36,500 bDRIP tokens before it runs dry. If you want to boost your daily returns even more, you can compound your earnings or add up to 10k bDRIP tokens to your Faucet. But remember, once you hit the maximum payout, you can't add anymore tokens. Which means your faucet has gone dry and you will need to open a new faucet
When you make claims and withdraw some bDRIP tokens, the locked amount in your Faucet decreases accordingly.
Want more Faucets? No problem! There's no limit to how many Faucets you can have per wallet address. And if you're feeling adventurous, you can even sell your accounts on the marketplace, getting back what you invested and cashing out. The buyer will then enjoy your Faucet and its daily returns.
With only 5,000 Faucet accounts available, FOMO kicks in, creating excitement and growth for the possibility of future accounts. So, get in on the action, stake your bDRIP, and let the Faucet flow with rewards!
 */

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 }  from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Faucet is Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    uint    public faucetLastCreatedId;
    uint    public totalFeeCollected;
    uint    public totalFeeClaimed; // to avoid claiming user's tokens by the owner
    address public bDRIPToken;
    address public feeReceiver;
    address public presaleContract;
    address public teamContract;

    Fees public faucetFees = Fees({
        depositFee:  10,
        claimFee:    10
    });

    struct FaucetAccount {
        uint    depositedAmount;
        uint    claimedAmount;
        uint    lastClaimed;
        uint    createdAt;
    }

    struct Fees {
        uint    depositFee;
        uint    claimFee;
    }

    struct UserFaucets {
        EnumerableSet.UintSet faucetsOwnedByUser;
    }

    //mapping(address user => mapping(uint faucetId => FaucetAccount faucet)) public faucetAccounts;
    mapping(uint faucetId => FaucetAccount faucet) public faucets;
    mapping(uint faucetId => address user) public faucetOwner;
    mapping(address user => UserFaucets) private _userFaucets;
    
    event FaucetDeposit   (address indexed user, uint faucetId, uint amount);
    event FaucetClaim     (address indexed user, uint amount);
    event FeeCollected    (address indexed from, address indexed to, uint amount);
    event FaucetCreated   (address indexed user, uint faucetId);

    error AllFaucetsAreCreated();
    error NoFaucetAccount();
    error MaxRewardReached();
    error NotEnoughTokensInFaucet();
    error MinimumDepositNotReached();
    error MaxDepositReached();
    error InvalidUser();
    error NotYourFaucet();
    error InvalidFaucet();
    error ERC20TransferFailed();
    error InvalidFees();

    constructor(address _bDRIPToken, address _feeReceiver, address _presaleContract, address _teamContract) Ownable(msg.sender) {
        bDRIPToken = _bDRIPToken;
        feeReceiver = _feeReceiver;
        presaleContract = _presaleContract;
        teamContract = _teamContract;
    }

    // owner functions

    /**
     * @notice - set the fees for deposit and claim
     * @param depositFee - fee for deposit in %
     * @param claimFee   - fee for claim in %
     */
    function setFees(uint depositFee, uint claimFee) external onlyOwner {
        faucetFees.depositFee = depositFee;
        faucetFees.claimFee   = claimFee;
        if(depositFee > 30 || claimFee > 30) revert InvalidFees();
    }

    /**
     * @notice - set the address of the fee receiver
     * @param _feeReceiver - address of the fee receiver
     */
    function setFeeReceiver(address _feeReceiver) external onlyOwner {
        feeReceiver = _feeReceiver;
    }

    /**
     * @notice - set the address of the presale contract
     * @param _presaleContract - address of the presale contract
     */
    function setPresaleContract(address _presaleContract) external onlyOwner {
        presaleContract = _presaleContract;
    }

    /**
     * @notice - set the address of the team contract
     * @param _teamContract - address of the team contract
     */
    function setTeamContract(address _teamContract) external onlyOwner {
        teamContract = _teamContract;
    }

    /**
     * @notice - withdraw bDRIP tokens from the contract
     * @param amount - amount of bDRIP tokens to withdraw
     */
    function emergencyWithdraw(uint amount) external onlyOwner {
        IERC20(bDRIPToken).transfer(msg.sender, amount);
    }

    // user functions

    /**
     * @notice - create a new Faucet for the user
     * @param user - address of the user
     */
    function createFaucet(address user) public {
        uint MAX_FAUCET_COUNT      = 5_000;
        // only the presale contract or team contract can deposit tokens for users
        if(msg.sender != presaleContract && msg.sender != teamContract) {
            // only the user can create faucet for himself
            if(msg.sender != user) revert InvalidUser();
        }
        if(faucetLastCreatedId     == MAX_FAUCET_COUNT) revert AllFaucetsAreCreated();
        // create faucet incrementing the id
        uint newId                 = ++faucetLastCreatedId;
        faucets[newId].createdAt   = block.timestamp;
        faucets[newId].lastClaimed = block.timestamp;
        faucetOwner[newId]         = user;
        _userFaucets[user].faucetsOwnedByUser.add(newId);
        emit FaucetCreated(user, newId);
    }

    /**
     * @notice         - deposit bDRIP tokens to create a new Faucet or add tokens to an existing Faucet
     * @notice         - if the user doesn't have a Faucet, the contract will create one
     * @param faucetId - id of the faucet
     * @param user     - address of the user
     * @param amount   - amount of bDRIP tokens to deposit
     */
    function deposit(uint faucetId, address user, uint amount) external {
        uint MAX_FAUCET_COUNT      = 5_000;
        uint MAX_FAUCET_TOKENS     = 10_000 * 10 ** 18;
        uint MIN_DEPOSIT           = 10 * 10 ** 18;
        // 0 fees for the presale contract
        uint feeAmount;
        
        FaucetAccount storage userFaucet = faucets[faucetId];
        // create faucet if it doesn't exist
        if (userFaucet.createdAt == 0 || faucetId == 0) {
            createFaucet(user);
        }
        if(faucetId == 0) {
            // get the first available user faucet
            faucetId                = _userFaucets[user].faucetsOwnedByUser.at(0);
            userFaucet              = faucets[faucetId];
        }

        address _faucetOwner        = faucetOwner[faucetId];
        // only the presale contract or teams contract can deposit tokens for users
        if(msg.sender != presaleContract && msg.sender != teamContract) {
            // only the user can deposit tokens for himself
            if(msg.sender != user)         revert NotYourFaucet();
            if(msg.sender != _faucetOwner) revert InvalidUser();
            
            // TODO: team contract shall pass here with fees??
            feeAmount               = amount * faucetFees.depositFee / 100;
        }


        uint amountToDeposit        = amount - feeAmount;

        if(amount                   > MAX_FAUCET_TOKENS) revert MaxDepositReached();
        if(faucetLastCreatedId      == MAX_FAUCET_COUNT) revert AllFaucetsAreCreated();
        if(amount                   < MIN_DEPOSIT)       revert MinimumDepositNotReached();
        
        userFaucet.depositedAmount  += amountToDeposit;

        if(!IERC20(bDRIPToken).transferFrom(msg.sender, address(this), amount)) revert ERC20TransferFailed();
        // if the fees are not collected by the contract, send them to the feeReceiver
        if(feeReceiver              != address(this) && feeAmount != 0) {
            // send tokens to fee receiver
            if(!IERC20(bDRIPToken).transfer(feeReceiver, feeAmount)) revert ERC20TransferFailed();
            emit FeeCollected(user, feeReceiver, feeAmount);
            totalFeeCollected++;
        }
        emit FaucetDeposit(user, faucetId, amountToDeposit);
    }

    /**
     * @notice - claim bDRIP tokens from a Faucet
     * @param faucetId - id of the faucet
     */
    function claim(uint faucetId) external {
        uint MAX_FAUCET_REWARDS              = 36_500 * 10 ** 18;
        FaucetAccount storage userFaucet     = faucets[faucetId];
        if(faucetOwner[faucetId]             != msg.sender) revert InvalidUser();
        if(userFaucet.depositedAmount        == 0) revert NoFaucetAccount();
        if(userFaucet.claimedAmount          >= MAX_FAUCET_REWARDS) revert MaxRewardReached();

        // fees are applied in calculateClaimAmount
        (uint amountToClaim, uint feeAmount) = calculateClaimAmount(faucetId);
        userFaucet.claimedAmount             += amountToClaim;
        userFaucet.lastClaimed               = block.timestamp;

        if(!IERC20(bDRIPToken).transfer(msg.sender, amountToClaim)) revert ERC20TransferFailed();
        // if the fees are not collected by the contract, send them to the feeReceiver
        if(feeReceiver != address(this)) {
            // send tokens to fee receiver
            if(!IERC20(bDRIPToken).transfer(feeReceiver, feeAmount)) revert ERC20TransferFailed();
            emit FeeCollected(msg.sender, feeReceiver, feeAmount);
            totalFeeCollected++;
        }
        emit FaucetClaim(msg.sender, amountToClaim);
    }

    /**
     * @notice - calculate the amount of bDRIP tokens to claim
     * @notice - faucet generates 1% daily returns for 365 days
     * @param faucetId - id of the faucet
     * @return amountToClaim - amount of bDRIP tokens to claim
     */
    function calculateClaimAmount(uint faucetId) public view returns(uint amountToClaim, uint feeAmount) {
        uint MAX_FAUCET_REWARDS          = 36_500 * 10 ** 18;
        FaucetAccount storage userFaucet = faucets[faucetId];
        uint daysPassed                  = (block.timestamp - userFaucet.lastClaimed) / 1 days;
        amountToClaim                   = userFaucet.depositedAmount * daysPassed / 100;
        // apply claim fee
        feeAmount                       = amountToClaim * faucetFees.claimFee / 100;
        amountToClaim -= feeAmount;
        if(amountToClaim  > MAX_FAUCET_REWARDS) {
            amountToClaim = MAX_FAUCET_REWARDS;
        }
        return (amountToClaim, feeAmount);
    }

    /**
     * @notice - get the list of faucets owned by a user
     * @param user - address of the user
     * @return faucetsOwned - array of faucet ids
     */
    function getFaucetsOwnedByUser(address user) external view returns(uint[] memory) {
        uint[] memory faucetsOwned = new uint[](_userFaucets[user].faucetsOwnedByUser.length());
        for (uint i = 0; i < _userFaucets[user].faucetsOwnedByUser.length(); i++) {
            faucetsOwned[i] = _userFaucets[user].faucetsOwnedByUser.at(i);
        }
        return faucetsOwned;
    }

}
