// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import { BaseDrip } from "../contracts/BaseDrip.sol";
import { Presale } from "../contracts/Presale.sol";
import { Faucet } from "../contracts/Faucet.sol";
import { Teams } from "../contracts/Teams.sol";
import { IERC20Errors } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";


contract TestPresale is Test {
    address  public deployer               = 0xAd844b2EfB384Eb2fbE795F99B3c5dE22c5446fD;
    address  public user                   = 0x96Aa80d7781BA1a509bB4D0B9b0b533978f37a05;
    uint[2]  public limitsWH               = [0.3 ether, 1 ether];
    uint[2]  public limitsPU               = [0.3 ether, 2 ether];
    uint     public amountToFund           = 3_000_000 ether;
    uint     public tokensPerETH           = 100 ether;

    BaseDrip public bDrip;
    Presale  public presale;
    Faucet   public faucet;
    Teams    public teams;

    event JoinedPresale(address indexed user, uint amount, uint amountETH);
    event LeftPresale  (address indexed user, uint amountETH);
    event ClaimedTokens(address indexed user, uint amount);

    function setUp() public {
    // create BaseChain fork
        /* uint blockToFork = 4086687;
        uint _chain      = vm.createFork("https://rpc.ankr.com/base", blockToFork);
        vm.selectFork(_chain); */
    // fund users
        vm.deal(deployer, 100 ether);
        vm.deal(user, 100 ether);
    // impersonate deployer
        vm.startPrank(deployer,deployer);

    // deploy contracts
        bDrip = new BaseDrip({
            _feeReceiver: deployer
        });
        presale = new Presale({
            _token: address(bDrip)
        });
        teams = new Teams({
            _ownerReferralAddress: deployer
        });
        faucet  = new Faucet({
            _bDRIPToken: address(bDrip),
            _feeReceiver: deployer,
            _presaleContract: address(presale),
            _teamContract: address(teams)
        });
    // fund presale
        bDrip.transfer(address(presale), amountToFund);
    // set date
        presale.setTime({
            _start : block.timestamp + 1 days,
            _end   : block.timestamp + 2 days
        });
    // set faucetContract on presale
        presale.setFaucetContract(address(faucet));
    // enable whitelist
        presale.setWhitelist(true);

    // label all the addresses
        vm.label(deployer, "deployer");
        vm.label(user, "user");
        vm.label(address(bDrip), "bDrip");
        vm.label(address(presale), "presale");
    // exit deployer
        vm.stopPrank();
    }

// ████████╗███████╗███████╗████████╗███████╗
// ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔════╝
//    ██║   █████╗  ███████╗   ██║   ███████╗
//    ██║   ██╔══╝  ╚════██║   ██║   ╚════██║
//    ██║   ███████╗███████║   ██║   ███████║
//    ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚══════╝

    function test_deposit() public {
    // presale must have the funds
        assertEq(bDrip.balanceOf(address(presale)), amountToFund);

        uint amountToDeposit    = limitsWH[0];
        uint maxAmountToDeposit = limitsWH[1];
        uint amountToGet        = presale.getContributionRatio(amountToDeposit);
    // the amount to get must be equal to the amount to deposit * tokensPerETH / 1 ether
        assertEq(amountToGet, amountToDeposit * tokensPerETH / 1 ether);
        vm.startPrank(user);

    // user cannot deposit before presale opening
        vm.expectRevert(Presale.PresaleNotStartedYet.selector);
        presale.joinPresale{value: amountToDeposit}();

    // skip 1 day
        vm.warp(block.timestamp + 1 days);

    // user cannot deposit without whitelist
        vm.expectRevert(Presale.NotWhitelisted.selector);
        presale.joinPresale{value: amountToDeposit}();

    // whitelist user
        vm.stopPrank();
        vm.prank(deployer);
        presale.setUserWhitelist(user, true);
        vm.startPrank(user);

    // user cannot deposit less then min amount
        vm.expectRevert(Presale.MinContributionNotReached.selector);
        presale.joinPresale{value: amountToDeposit - 1}();

    // user cannot deposit more than max amount
        vm.expectRevert(Presale.MaxContributionReached.selector);
        presale.joinPresale{value: maxAmountToDeposit + 1}();

    // user can deposit min amount
        vm.expectEmit(address(presale));
        emit JoinedPresale(user, amountToGet, amountToDeposit);
        presale.joinPresale{value: amountToDeposit}();

    // check userInfo
        (bool claimed,
        bool isWhitelisted,
        uint totalEthSpent,
        uint totalTokensBought) = presale.userInfo(user);
        assertEq(isWhitelisted, true);
        assertEq(totalEthSpent, amountToDeposit);
        assertEq(totalTokensBought, amountToGet);

    // user can deposit again
        vm.expectEmit(address(presale));
        emit JoinedPresale(user, amountToGet, amountToDeposit);
        presale.joinPresale{value: amountToDeposit}();

    // check userInfo
        (,,totalEthSpent,
        totalTokensBought) = presale.userInfo(user);
        assertEq(totalEthSpent, amountToDeposit * 2);
        assertEq(totalTokensBought, amountToGet * 2);

    // disable whitelist
        vm.stopPrank();
        vm.prank(deployer);
        presale.setWhitelist(false);

    // get public limits
        (uint min, uint max) = presale.getCurrentLimits();
        assertEq(min, limitsPU[0]);
        assertEq(max, limitsPU[1]);
        
    }

    function test_fill_presale() public {
    // disable this tests to enable forks

    // skip 1 day
        vm.warp(block.timestamp + 1 days);
    // disable whitelist
        vm.prank(deployer);
        presale.setWhitelist(false);
        
        uint amountToDeposit = limitsPU[0];
    // calculate the remaning ETH and users to fill the presale
        uint remainingUsers = (presale.hardCap() - address(presale).balance) / limitsPU[0];
        uint startingAccount = 1000000000;
        address _tempUser;
        
    // spawn each user, fund it and let him deposit
        for(uint i = 0; i < remainingUsers;i++) {
            _tempUser = vm.addr(startingAccount + i);
            vm.deal(_tempUser, amountToDeposit);
            vm.prank(_tempUser);
            presale.joinPresale{value: amountToDeposit}();
        }
    // hardcap reached
        vm.deal(_tempUser, limitsPU[0]);
        vm.prank(_tempUser);
        vm.expectRevert(Presale.HardCapReached.selector);
        presale.joinPresale{value: limitsPU[0]}();

    // skip to end date
        vm.warp(block.timestamp + 31 days);

    // claim as user
        uint tokensToReceive = presale.getContributionRatio(amountToDeposit);
        uint faucetBalanceBefore = bDrip.balanceOf(address(faucet));
        vm.expectEmit(address(presale));
        emit ClaimedTokens(_tempUser, tokensToReceive);
        vm.prank(_tempUser);
        presale.claimTokens();

    // check faucet balance
        assertEq(bDrip.balanceOf(address(faucet)), faucetBalanceBefore + tokensToReceive);

    // check faucet data
        uint faucetId = 1;
        (
            uint depositedAmount,
            uint claimedAmount,
            uint lastClaimed,
            uint createdAt
        ) = faucet.faucets(faucetId);

        assertEq(faucetId, 1);
        assertEq(createdAt, block.timestamp);
        assertEq(depositedAmount, tokensToReceive);
        assertEq(claimedAmount, 0);
        assertEq(lastClaimed, block.timestamp);

    // check faucet ownership
        assertEq(faucet.faucetOwner(1), _tempUser);
    }

    /* function test_withdraw_eth() public {
        uint amountToDeposit    = limitsPU[0];
        vm.startPrank(user);

    // user cannot withdraw before the presale is started
        vm.expectRevert(Presale.PresaleNotStartedYet.selector);
        presale.claimBackETH();

    // skip in time to start presale
        vm.warp(block.timestamp + 1 days);

    // user cannot withdraw if he didn't deposit ETH
        vm.expectRevert(Presale.NeverContribuited.selector);
        presale.claimBackETH();

    // whitelist user
        vm.stopPrank();
        vm.prank(deployer);
        presale.setUserWhitelist(user, true);
        vm.startPrank(user);
    // user can deposit
        presale.joinPresale{value: amountToDeposit}();

    // user cannot withdraw before the presale is ended
        vm.expectRevert(Presale.PresaleNotEndedYet.selector);
        presale.claimBackETH();

    // skip in time to end presale

        vm.warp(block.timestamp + 1 days);

    // withdraw ETH as the presale failed
        vm.expectEmit(address(presale));
        emit LeftPresale(user, amountToDeposit);
        presale.claimBackETH();

    // cannot claim again
        vm.expectRevert(Presale.AlreadyClaimed.selector);
        presale.claimBackETH();
    } */

    function test_claim() public {
        uint amountToDeposit    = limitsPU[0];
        uint amountToGet        = presale.getContributionRatio(amountToDeposit);
        vm.startPrank(user);

    // user cannot claim before the presale is started
        vm.expectRevert(Presale.PresaleNotStartedYet.selector);
        presale.claimTokens();

    // skip in time to start presale
        vm.warp(block.timestamp + 1 days);

    // user cannot claim if he didn't deposit ETH
        vm.expectRevert(Presale.NeverContribuited.selector);
        presale.claimTokens();

    // whitelist user
        vm.stopPrank();
        vm.prank(deployer);
        presale.setUserWhitelist(user, true);
        vm.startPrank(user);
    // user can deposit
        presale.joinPresale{value: amountToDeposit}();

    // user cannot claim before the presale is ended
        vm.expectRevert(Presale.PresaleNotEndedYet.selector);
        presale.claimTokens();

    // skip in time to end presale
        vm.warp(block.timestamp + 1 days);

    // user cannot claim if the presale failed
        vm.expectRevert(Presale.SoftCapNotReached.selector);
        presale.claimTokens();

    // override the softCap
        vm.stopPrank();
        vm.prank(deployer);
        presale.setCaps({
            _soft: amountToDeposit,
            _hard: amountToDeposit+1
        });
        vm.startPrank(user);

        vm.expectEmit(address(presale));
        emit ClaimedTokens(user, amountToGet);
        presale.claimTokens();
        // check if the Faucet has been created for the user
        uint faucetId = 1;
        (
            uint depositedAmount,
            uint claimedAmount,
            uint lastClaimed,
            uint createdAt
        ) = faucet.faucets(faucetId);

        assertEq(faucetId, 1);
        assertEq(createdAt, block.timestamp);
        assertEq(depositedAmount, amountToGet);
        assertEq(claimedAmount, 0);
        assertEq(lastClaimed, block.timestamp);

    // cannot claim again
        vm.expectRevert(Presale.AlreadyClaimed.selector);
        presale.claimTokens();
    }

    function test_setters() public {
        vm.startPrank(deployer);
    // setTime
        presale.setTime({
            _start : block.timestamp + 1 days,
            _end   : block.timestamp + 2 days
        });
        assertEq(presale.startTime(), block.timestamp + 1 days);
        assertEq(presale.endTime()  , block.timestamp + 2 days);
    // setLimits
        presale.setLimits({
            _index: 0,
            _min  : 0.1 ether,
            _max  : 1 ether
        });
        (uint min, uint max) = presale.limits(0);
        assertEq(min, 0.1 ether);
        assertEq(max, 1 ether);
        presale.setLimits({
            _index: 1,
            _min  : 0.1 ether,
            _max  : 2 ether
        });
        (min, max) = presale.limits(1);
        assertEq(min, 0.1 ether);
        assertEq(max, 2 ether);
    // setCaps
        presale.setCaps({
            _soft: 1 ether,
            _hard: 2 ether
        });
        assertEq(presale.softCap(), 1 ether);
        assertEq(presale.hardCap(), 2 ether);
    // setWhitelist
        assertEq(presale.whitelistEnabled(), true);
        presale.setWhitelist(false);
        assertEq(presale.whitelistEnabled(), false);
    // setUserWhitelist
        (,bool isWhitelisted,,) = presale.userInfo(user);
        assertEq(isWhitelisted, false);
        presale.setUserWhitelist(user, true);
        (,isWhitelisted,,) = presale.userInfo(user);
        assertEq(isWhitelisted, true);
    // setMultipleUsersWhitelist
        address[] memory users = new address[](2);
        users[0] = user;
        users[1] = deployer;
        presale.setMultipleUsersWhitelist(users, true);
        (,isWhitelisted,,) = presale.userInfo(user);
        assertEq(isWhitelisted, true);
        (,isWhitelisted,,) = presale.userInfo(deployer);
        assertEq(isWhitelisted, true);
        presale.setMultipleUsersWhitelist(users, false);
        (,isWhitelisted,,) = presale.userInfo(user);
        assertEq(isWhitelisted, false);
        (,isWhitelisted,,) = presale.userInfo(deployer);
        assertEq(isWhitelisted, false);
    // withdrawETH
        presale.setUserWhitelist(user, true);
        presale.setCaps({
            _soft: 0.1 ether,
            _hard: 0.2 ether
        });
        // start sale
        vm.warp(block.timestamp + 1 days);

        presale.joinPresale{value: 0.1 ether}();
        assertEq(address(presale).balance, 0.1 ether);

        uint balanceBefore = deployer.balance;
        presale.withdrawETH();
        assertEq(address(presale).balance, 0);
        assertEq(deployer.balance, balanceBefore + 0.1 ether);
        
        /* // end sale
        vm.warp(block.timestamp + 1 days);

        // cannot claim if softCap reached
        vm.expectRevert(Presale.SoftCapReached.selector);
        presale.claimBackETH();

        // override the softCap
        presale.setCaps({
            _soft: 0.5 ether,
            _hard: 1 ether
        });
        vm.expectEmit(address(presale));
        emit LeftPresale(deployer, 0.1 ether);
        presale.claimBackETH();
        assertEq(address(presale).balance, 0); */
    // withdrawTokens
        assertEq(bDrip.balanceOf(address(presale)), amountToFund); // 10 eth = amount bought before
        presale.withdrawTokens();
        assertEq(bDrip.balanceOf(address(presale)), 0);
    // getCurrentLimits
        (min, max) = presale.getCurrentLimits();
        assertEq(min, 0.1 ether);
        assertEq(max, 2 ether);
        presale.setWhitelist(true);
        (min, max) = presale.getCurrentLimits();
        assertEq(min, 0.1 ether);
        assertEq(max, 1 ether);
    }

    function test_setFaucetContract() public {
        // target of the test:
        // owner should be able to set faucet contract

        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user));
        presale.setFaucetContract(user);

        // check current value
        assertEq(presale.faucetContract(), address(faucet));

        vm.prank(deployer);
        presale.setFaucetContract(user);

        // check current value
        assertEq(presale.faucetContract(), user);
    }

    function test_specific_presale_with_random_amounts(uint amount) public {
        // target of the test
        // test 256 random presale with specific accounts

        // bind amount to whitelist min/max deposits
        amount = bound(amount, limitsWH[0],limitsWH[1]);
        address randomUser;
        uint totalContribution;
        uint totalUsers;

        // skip 1 day to start presale and disable whitelist
        vm.prank(deployer);
        presale.setWhitelist(false);
        vm.warp(block.timestamp + 1 days);
        uint presaleHardCap = presale.hardCap();
        
        // create 300 users and join presale
        address[] memory users = new address[](300);
        for(uint i = 0; i < 300; i++) {
            users[i] = vm.addr(1000000000 + i);

            // fund it with 5 ETH
            vm.deal(users[i], 5 ether);
            // if the hardcap is not reached, join presale
            if(address(presale).balance + amount < presaleHardCap) {
                vm.prank(users[i]);
                presale.joinPresale{value: amount}();
            // otherwise, test a fail tx and break the loop
            } else if(address(presale).balance + amount == presaleHardCap) {
                    vm.prank(users[i]);
                    presale.joinPresale{value: amount}();
            } else {
                vm.prank(users[i]);
                vm.expectRevert(Presale.HardCapReached.selector);
                presale.joinPresale{value: amount}();
                break;
            }
            randomUser = users[i];
            totalContribution += amount;
            totalUsers++;
        }
        
        // check user ETH, he should have less then 5 ETH - amount
        assertEq(randomUser.balance, 5 ether - amount);
        // check presale ETH, it should be equal to the totalContribution
        assertEq(address(presale).balance, totalContribution);
        
        // skip to end date
        vm.warp(block.timestamp + 31 days);

        // claim tokens for each user that joined
        for(uint i = 0; i < totalUsers; i++) {
            randomUser = users[i];
            vm.prank(randomUser);
            presale.claimTokens();
        }

        // check faucet balance
        assertEq(bDrip.balanceOf(address(faucet)), totalContribution * tokensPerETH / 1 ether);
    }
}
