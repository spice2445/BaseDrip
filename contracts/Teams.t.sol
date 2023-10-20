// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import { BaseDrip } from "../contracts/BaseDrip.sol";
import { Presale } from "../contracts/Presale.sol";
import { Faucet } from "../contracts/Faucet.sol";
import { Teams } from "../contracts/Teams.sol";
import { Garden } from "../contracts/Garden.sol";
import { IERC20Errors } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";


contract TestTeams is Test {
    address  public deployer               = 0xAd844b2EfB384Eb2fbE795F99B3c5dE22c5446fD;
    address  public user                   = 0x96Aa80d7781BA1a509bB4D0B9b0b533978f37a05;

    BaseDrip public bDrip;
    Presale  public presale;
    Faucet   public faucet;
    Teams    public teams;
    Garden   public garden;

    event ReferralChanged    (address indexed user, address referral);
    event ReferralAmountAdded(address indexed user, uint amount);
    event ReferralClaimed    (address indexed user, uint amount);

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
            _feeReceiver: address(123)
        });
        presale = new Presale({
            _token: address(bDrip)
        });
        teams   = new Teams({
            _ownerReferralAddress: deployer
        });
        faucet  = new Faucet({
            _bDRIPToken: address(bDrip),
            _feeReceiver: address(123),
            _presaleContract: address(presale),
            _teamContract: address(teams)
        });
        garden  = new Garden({
            _buyBackFeeReceiver: address(123),
            _referralsFeeReceiver: address(123),
            _rewardPoolFeeReceiver: address(123),
            _bDrip: address(bDrip),
            _teamsContractAddress: address(teams)
        });
    // set garden contract on teams
        teams.setgardenContractAddress(address(garden));
    // set faucet contract on teams
        teams.setFaucetContractAddress(address(faucet));
    // set teams contract on faucet
        faucet.setTeamContract(address(teams));
    // set teams contract on garden
        garden.setTeamsContractAddress(address(teams));
    // set bDrip contract on teams
        teams.setbDripContractAddress(address(bDrip));
    // set date
        presale.setTime({
            _start : block.timestamp + 1 days,
            _end   : block.timestamp + 2 days
        });
    // set faucetContract on presale
        presale.setFaucetContract(address(faucet));
    // enable whitelist

    // label all the addresses
        vm.label(deployer, "deployer");
        vm.label(user, "user");
        vm.label(address(bDrip), "bDrip");
        vm.label(address(presale), "presale");
        vm.label(address(faucet), "faucet");
        vm.label(address(teams), "teams");
    // exit deployer
        vm.stopPrank();
    }

// ████████╗███████╗███████╗████████╗███████╗
// ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔════╝
//    ██║   █████╗  ███████╗   ██║   ███████╗
//    ██║   ██╔══╝  ╚════██║   ██║   ╚════██║
//    ██║   ███████╗███████║   ██║   ███████║
//    ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚══════╝

    function test_teams() public {
        // target of the test
        // earn 5% of deposited user by referral

        // send 10_000 pDrip to user
        vm.prank(deployer);
        bDrip.transfer(user, 10_000 ether);
        // send 10_000 pDrip to teams
        vm.prank(deployer);
        bDrip.transfer(address(teams), 10_000 ether);

        // impersonate user
        vm.startPrank(user);

        // set deployer address as referral on teams
        vm.expectEmit(address(teams));
        emit ReferralChanged(user, deployer);
        teams.setReferral(deployer);

        bDrip.approve(address(garden), 10_000 ether);
        // deposit in garden
        vm.expectEmit(address(teams));
        // amount expected is 5% of deposit (10_000 ether)
        emit ReferralAmountAdded(user, 500 ether);
        garden.deposit(10_000 ether);

        // deployer can compound his rewards in teams contract
        vm.stopPrank();

        /* // cannot compound on id 0 or without Faucet
        vm.expectRevert(Teams.WrongETHForReferralFee.selector);
        teams.compoundReferral(user, 0);
        vm.expectRevert(Teams.WrongETHForReferralFee.selector);
        teams.compoundReferral(user, 1);

        // create faucet
        faucet.createFaucet(deployer); */
        
        // user cannot claim deployer's referral amount
        vm.expectRevert(Teams.NotYourReferral.selector);
        vm.prank(user);
        teams.compoundReferral(user, 0);


        vm.expectEmit(address(teams));
        emit ReferralClaimed(deployer, 500 ether);
        vm.prank(deployer);
        teams.compoundReferral(user, 0);


        // check faucet 1 data
        (
        uint    depositedAmount,
        uint    claimedAmount,
        uint    lastClaimed,
        uint    createdAt
        ) = faucet.faucets(1);
        assertEq(depositedAmount, 500 ether);
        assertEq(claimedAmount, 0 ether);
        assertEq(lastClaimed, 1);
        assertEq(createdAt, block.timestamp);

        // cannot claim referral if nothing to claim
        vm.expectRevert(Teams.NothingToClaim.selector);
        vm.prank(deployer);
        teams.compoundReferral(user, 0);
    }
}
