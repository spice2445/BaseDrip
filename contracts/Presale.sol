// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;
import  { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
// import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IFaucet {
    function deposit(uint faucetId, address user, uint amount) external;
}

contract Presale is Ownable {
    address public token;
    address public faucetContract;

    uint    public tokensPerETH       = 100 ether; // proce 1t 0.01 ETH.
    uint    public softCap            = 75 ether;
    uint    public hardCap            = 100 ether;
    uint    public totalTokensBought;
    uint    public totalEth;
    uint    public startTime;
    uint    public endTime;

    bool    public whitelistEnabled;

    struct Limits {
        uint min;
        uint max;
    }
    struct User {
        bool claimed;
        bool isWhitelisted;
        uint totalEthSpent;
        uint totalTokensBought;
    }
    
    mapping(address => User)   public userInfo;
    mapping(uint    => Limits) public limits;

    event JoinedPresale(address indexed user, uint amount, uint amountETH);
    event LeftPresale  (address indexed user, uint amountETH);
    event ClaimedTokens(address indexed user, uint amount);

    error InvalidIndex();
    error InvalidNumber();
    error MinContributionNotReached();
    error MaxContributionReached();
    error NotWhitelisted();
    error HardCapReached();
    error CannotWithdrawETH();
    error PresaleNotStartedYet();
    error PresaleEnded();
    error PresaleNotEndedYet();
    error NeverContribuited();
    error AlreadyClaimed();
    error SoftCapNotReached();
    error SoftCapReached();
    error CannotApproveToken();

    constructor (
        address _token
    ) Ownable(msg.sender) {
        token         = _token;
        limits[0].min = 0.3 ether; // whitelist
        limits[0].max = 1 ether; // whitelist
        limits[1].min = 0.3 ether; // public
        limits[1].max = 2 ether; // public
    }
    modifier checkTimer() {
        if(block.timestamp < startTime) revert PresaleNotStartedYet();
        if(block.timestamp > endTime)   revert PresaleEnded();
        _;
    }

    // owner functions

    function setTime(uint _start, uint _end) external onlyOwner {
        startTime = _start;
        endTime = _end;
    }

    function setLimits(uint _index, uint _min, uint _max) external onlyOwner {
        if(_index > 1)   revert InvalidIndex();
        if(_min > _max) revert InvalidNumber();
        if(_min == 0)    revert InvalidNumber();
        if(_max == 0)    revert InvalidNumber();
        limits[_index].min = _min;
        limits[_index].max = _max;
    }

    function setCaps(uint _soft, uint _hard) external onlyOwner {
        if(_soft > _hard) revert InvalidNumber();
        if(_soft == 0)    revert InvalidNumber();
        if(_hard == 0)    revert InvalidNumber();
        softCap = _soft;
        hardCap = _hard;
    }

    function setFaucetContract(address _faucetContract) external onlyOwner {
        faucetContract = _faucetContract;
    }

    function setWhitelist(bool enabled) external onlyOwner {
        whitelistEnabled = enabled;
    }

    function setUserWhitelist(address _user, bool _enabled) external onlyOwner {
        userInfo[_user].isWhitelisted = _enabled;
    }

    function setMultipleUsersWhitelist(address[] calldata _users, bool _enabled) external onlyOwner {
        uint length = _users.length;
        for(uint i = 0; i < length;) {
            userInfo[_users[i]].isWhitelisted = _enabled;
            unchecked {
                ++i;
            }
        }
    }

    function withdrawETH() external onlyOwner {
        (bool success,) = owner().call{value: address(this).balance}("");
        if(!success) revert CannotWithdrawETH();
    }

    function withdrawTokens() external onlyOwner {
        IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
    }

    // user functions

    function joinPresale() external payable checkTimer {
        User storage user = userInfo[msg.sender];
        uint min;
        uint max;

        if(whitelistEnabled) {
            if(!user.isWhitelisted) revert NotWhitelisted();
            min = limits[0].min;
            max = limits[0].max;
        } else {
            min = limits[1].min;
            max = limits[1].max;
        }

        uint amountBought = getContributionRatio(msg.value);
        totalEth += msg.value;
        totalTokensBought += amountBought;

        user.totalEthSpent += msg.value;
        user.totalTokensBought += amountBought;

        if(user.totalEthSpent < min) revert MinContributionNotReached();
        if(user.totalEthSpent > max) revert MaxContributionReached();
        if(totalEth > hardCap) revert HardCapReached();

        emit JoinedPresale(msg.sender, amountBought, msg.value);
    }

    function claimTokens() external {
        User storage user = userInfo[msg.sender];
        if(block.timestamp < startTime) revert PresaleNotStartedYet();
        if(user.totalEthSpent == 0)     revert NeverContribuited();
        if(block.timestamp < endTime)   revert PresaleNotEndedYet();
        if(totalEth < softCap)          revert SoftCapNotReached();
        if(user.claimed)                revert AlreadyClaimed();

        user.claimed = true;
        if(!IERC20(token).approve(faucetContract, user.totalTokensBought)) revert CannotApproveToken();
        IFaucet(faucetContract).deposit(0,msg.sender, user.totalTokensBought);
        emit ClaimedTokens(msg.sender, user.totalTokensBought);
    }

    /* function claimBackETH() external nonReentrant {
        User storage user = userInfo[msg.sender];
        if(block.timestamp < startTime) revert PresaleNotStartedYet();
        if(user.totalEthSpent == 0)     revert NeverContribuited();
        if(block.timestamp < endTime)   revert PresaleNotEndedYet();
        if(totalEth        >= softCap)  revert SoftCapReached();
        if(user.claimed)                revert AlreadyClaimed();

        uint amount = user.totalEthSpent;

        user.claimed = true;

        (bool success,) = msg.sender.call{value: amount}("");
        if(!success) revert CannotWithdrawETH();
        emit LeftPresale(msg.sender, amount);
    } */

    // views

    function getContributionRatio(uint amountETH) public view returns (uint) {
        return amountETH * tokensPerETH / 1 ether;
    }

    function getCurrentLimits() external view returns(uint min, uint max) {
        if(whitelistEnabled) {
            min = limits[0].min;
            max = limits[0].max;
        } else {
            min = limits[1].min;
            max = limits[1].max;
        }
    }
}
