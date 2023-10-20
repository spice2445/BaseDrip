// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import { BaseDrip } from "../contracts/BaseDrip.sol";
import { Faucet } from "../contracts/Faucet.sol";
import { IERC20Errors } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Presale } from "../contracts/Presale.sol";
import { Teams } from "../contracts/Teams.sol";

interface Router {
    function WETH() external view returns(address);
    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    )
        external
        payable
        returns (uint amountToken, uint amountETH, uint liquidity);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline)
        external;
    function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory amounts);
}
interface Pair {
    function sync() external;
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

contract TestFaucet is Test {
    address public deployer           = 0xAd844b2EfB384Eb2fbE795F99B3c5dE22c5446fD;
    address public user               = 0x96Aa80d7781BA1a509bB4D0B9b0b533978f37a05;
    address public user1              = 0x8b6C8fd93d6F4CeA42Bbb345DBc6F0DFdb5bEc73;

    uint    public depositFee         = 10;
    uint    public claimFee           = 10;
    uint    public MAX_FAUCET_REWARDS = 36_500 * 10 ** 18;

    BaseDrip public bDrip;
    Faucet   public faucet;
    Presale  public presale;
    Teams    public teams;

    Router   public router            = Router(0xaaa3b1F1bd7BCc97fD1917c18ADE665C5D31F066);

    event FaucetDeposit   (address indexed user, uint faucetId, uint amount);
    event FaucetClaim     (address indexed user, uint amount);
    event FeeCollected    (address indexed from, address indexed to, uint amount);
    event FaucetCreated   (address indexed user, uint faucetId);
    function setUp() public {
    // create BaseChain fork
        uint blockToFork = 4086687;
        uint _chain      = vm.createFork("https://rpc.ankr.com/base", blockToFork);
        vm.selectFork(_chain);
    // fund users
        vm.deal(deployer, 100 ether);
        vm.deal(user, 100 ether);
    // impersonate deployer
        vm.startPrank(deployer,deployer);

    // deploy contracts
        bDrip  = new BaseDrip({
            _feeReceiver: deployer
        });
        presale = new Presale({
            _token: address(bDrip)
        });
        teams = new Teams({
            _ownerReferralAddress: deployer
        });
        faucet = new Faucet({
            _bDRIPToken: address(bDrip),
            _feeReceiver: deployer,
            _presaleContract: address(presale),
            _teamContract: address(teams)
        });

    // label all the addresses
        vm.label(deployer, "deployer");
        vm.label(user, "user");
    // exit deployer
        vm.stopPrank();
    }

// ████████╗███████╗███████╗████████╗███████╗
// ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔════╝
//    ██║   █████╗  ███████╗   ██║   ███████╗
//    ██║   ██╔══╝  ╚════██║   ██║   ╚════██║
//    ██║   ███████╗███████║   ██║   ███████║
//    ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚══════╝

    function test_deposit_faucet() public {
        // target of the test:
        // user deposit 10_000 bDRIP tokens to the faucet
        uint depositAmount = 10_000 ether;
        uint faucetId = 1;

        vm.prank(deployer);
        // send 10_000 bDRIP tokens to the user
        bDrip.transfer(user, depositAmount);
        // save deployer balance
        uint deployerBalance = bDrip.balanceOf(deployer);

        vm.startPrank(user);

        // approve faucet to spend 10_000 bDRIP tokens
        bDrip.approve(address(faucet), depositAmount);
        // deposit 10_000 bDRIP tokens to the faucet
        faucet.deposit(faucetId, user, depositAmount);
        // get user faucet data
        (uint depositedAmount,
        uint claimedAmount,
        uint lastClaimed,
        uint createdAt) = faucet.faucets(faucetId);
        // checks after deposit

        // Faucet balance should be equal to the amount deposited - fee
        assertEq(bDrip.balanceOf(address(faucet)), depositAmount - (depositAmount * depositFee / 100));
        // deployer balance should be equal to the fee
        assertEq(bDrip.balanceOf(deployer), deployerBalance + (depositAmount * depositFee / 100));
        // user balance should be equal to 0
        assertEq(bDrip.balanceOf(user), 0);
        // faucetId should be equal to 1
        assertEq(faucetId, 1);
        // depositedAmount should be equal to 9_000 ether
        assertEq(depositedAmount, depositAmount - (depositAmount * depositFee / 100));
        // claimedAmount should be equal to 0
        assertEq(claimedAmount, 0);
        // lastClaimed should be equal to the current block timestamp
        assertEq(lastClaimed, block.timestamp);
        // createdAt should be equal to the current block timestamp
        assertEq(createdAt, block.timestamp);
        // check if the faucet has been created
        uint[] memory faucetIds = faucet.getFaucetsOwnedByUser(user);
        assertEq(faucetIds[0], faucetId);
    }

    function test_claim_faucet() public {
        // target of the test:
        // user claim 1_000 bDRIP tokens from the faucet
        uint depositAmount = 10_000 ether;
        uint faucetId = 1;

        vm.prank(deployer);
        // send 10_000 bDRIP tokens to the user
        bDrip.transfer(user, depositAmount);

        vm.startPrank(user);
        // approve faucet to spend 10_000 bDRIP tokens
        bDrip.approve(address(faucet), depositAmount);
        // deposit 10_000 bDRIP tokens to the faucet
        faucet.deposit(faucetId, user, depositAmount);

        // skip 1 day in time
        vm.warp(block.timestamp + 1 days);
        // save deployer balance
        uint deployerBalance = bDrip.balanceOf(deployer);

        // claim 1_000 bDRIP tokens from the faucet
        faucet.claim(faucetId);
        // get user faucet data
        (uint depositedAmount,
        uint claimedAmount,
        uint lastClaimed,
        uint createdAt) = faucet.faucets(faucetId);
        // amount to claim should be equal to deposit * 1% of the amount deposited
        // amount deposited is 9_000 ether
        // we apply the claim fee of 10% so the amount to claim is 9_000 * 1% = 90 ether
        uint fee = (9_000 ether * 1 / 100 * claimFee / 100);
        uint amountToClaim = (9_000 ether * 1 / 100) - fee;

        // checks after claim
        // user balance should be equal to the amount to claim
        assertEq(bDrip.balanceOf(user), amountToClaim);
        // faucet balance should be equal to the amount deposited - amount to claim
        assertEq(bDrip.balanceOf(address(faucet)), 9_000 ether - amountToClaim - fee);
        // deployer balance should be equal to the amount to claim
        assertEq(bDrip.balanceOf(deployer), deployerBalance + fee);
        // faucetId should be equal to 1
        assertEq(faucetId, 1);
        // depositedAmount should be equal to 9_000 ether
        assertEq(depositedAmount, 9_000 ether);
        // claimedAmount should be equal to the amount to claim
        assertEq(claimedAmount, amountToClaim);
        // lastClaimed should be equal to the current block timestamp
        assertEq(lastClaimed, block.timestamp);
        // createdAt should be equal to the current block timestamp - 1 days
        assertEq(createdAt, block.timestamp - 1 days);
    }

    function test_claim_timeWarp() public {
        // target of the test
        // user can claim bDRIP tokens from the faucet after 1 day for 1 year
        // user can claim 365% of the amount deposited
        uint amountToFund = MAX_FAUCET_REWARDS;
        uint faucetId = 1;
        uint _claimedAmount;
        vm.prank(deployer);
        bDrip.transfer(address(faucet), amountToFund);

        uint depositAmount = 10_000 ether;

        vm.prank(deployer);
        // send 10_000 bDRIP tokens to the user
        bDrip.transfer(user, depositAmount);

        vm.startPrank(user);
        // approve faucet to spend 10_000 bDRIP tokens
        bDrip.approve(address(faucet), depositAmount);
        // deposit 10_000 bDRIP tokens to the faucet
        faucet.deposit(faucetId, user, depositAmount);

        // skip 1 day in time
        vm.warp(block.timestamp + 1 days);
        // save deployer balance
        uint deployerBalance = bDrip.balanceOf(deployer);

        // claim 1_000 bDRIP tokens from the faucet
        faucet.claim(faucetId);
        // get user faucet data
        (uint depositedAmount,
        uint claimedAmount,
        uint lastClaimed,
        uint createdAt) = faucet.faucets(faucetId);
        // amount to claim should be equal to deposit * 1% of the amount deposited
        // amount deposited is 9_000 ether
        // we apply the claim fee of 10% so the amount to claim is 9_000 * 1% = 90 ether
        uint fee = (9_000 ether * 1 / 100 * claimFee / 100);
        uint amountToClaim = (9_000 ether * 1 / 100) - fee;
        _claimedAmount += amountToClaim;

        // checks after claim
        // user balance should be equal to the amount to claim
        assertEq(bDrip.balanceOf(user), amountToClaim);
        // faucet balance should be equal to the amount deposited - amount to claim
        assertEq(bDrip.balanceOf(address(faucet)), amountToFund + (9_000 ether - amountToClaim - fee));
        // deployer balance should be equal to the amount to claim
        assertEq(bDrip.balanceOf(deployer), deployerBalance + fee);
        // faucetId should be equal to 1
        assertEq(faucetId, 1);
        // depositedAmount should be equal to 9_000 ether
        assertEq(depositedAmount, 9_000 ether);
        // claimedAmount should be equal to the amount to claim
        assertEq(claimedAmount, amountToClaim);
        // lastClaimed should be equal to the current block timestamp
        assertEq(lastClaimed, block.timestamp);
        // createdAt should be equal to the current block timestamp - 1 days
        assertEq(createdAt, block.timestamp - 1 days);

        // skip 30 days in time
        vm.warp(block.timestamp + 30 days);
        // save user balance
        uint userBalance = bDrip.balanceOf(user);

        // claim bDrip tokens from the faucet
        faucet.claim(faucetId);
        // get user faucet data
        (depositedAmount,
        claimedAmount,
        lastClaimed,
        createdAt) = faucet.faucets(faucetId);

        // amount to claim should be equal to deposit * 1% of the amount deposited
        // amount deposited is 9_000 ether
        fee = (9_000 ether * 30 / 100 * claimFee / 100);
        amountToClaim = (9_000 ether * 30 / 100) - fee;
        _claimedAmount += amountToClaim;

        // faucet balance should be equal to the amount deposited - amount to claim
        // subtract 1 day of rewards from the previous claim
        assertEq(bDrip.balanceOf(address(faucet)), amountToFund + (9_000 ether - amountToClaim - fee) - 90 ether);
        // faucetId should be equal to 1
        assertEq(faucetId, 1);
        // depositedAmount should be equal to 9_000 ether
        assertEq(depositedAmount, 9_000 ether);
        // claimedAmount should be equal to the amount to claim
        assertEq(claimedAmount, _claimedAmount);
        // lastClaimed should be equal to the current block timestamp
        assertEq(lastClaimed, block.timestamp);
        // createdAt should be equal to the current block timestamp - 31 days
        assertEq(createdAt, block.timestamp - 31 days);

        // checks after claim
        // user balance should be equal to the amount to claim
        // we subtract the amount claimed in the first claim
        assertEq(bDrip.balanceOf(user) - userBalance, amountToClaim);
    }

    function test_claim_hit_max() public {
        // target of the test
        // user can claim bDRIP tokens from the faucet after 1 day but not more then MAX_FAUCET_REWARDS
        uint amountToFund = MAX_FAUCET_REWARDS;
        uint faucetId = 1;
        uint _claimedAmount;
        vm.prank(deployer);
        bDrip.transfer(address(faucet), amountToFund);

        uint depositAmount = 10_000 ether;
        vm.prank(deployer);
        // send 10_000 bDRIP tokens to the user
        bDrip.transfer(user, depositAmount);

        vm.startPrank(user);
        // approve faucet to spend 10_000 bDRIP tokens
        bDrip.approve(address(faucet), depositAmount);

        // deposit 10_000 bDRIP tokens to the faucet
        faucet.deposit(faucetId, user, depositAmount);

        // skip 600 day in time
        vm.warp(block.timestamp + 600 days);
        // save user balance
        uint userBalance = bDrip.balanceOf(user);

        // claim bDrip tokens from the faucet
        faucet.claim(faucetId);
        // get user faucet data
        (uint depositedAmount,
        uint claimedAmount,
        uint lastClaimed,
        uint createdAt) = faucet.faucets(faucetId);

        // users should have claimed only MAX_FAUCET_REWARDS
        _claimedAmount = MAX_FAUCET_REWARDS;

        assertEq(bDrip.balanceOf(user) - userBalance, MAX_FAUCET_REWARDS);
    }

    /* function test_withdraw_faucet() public {
        // target of the test:
        // user withdraw 10_000 bDRIP tokens from the faucet after 1 year

        vm.prank(deployer);
        // send 10_000 bDRIP tokens to the user
        bDrip.transfer(user, 10_000 ether);

        vm.startPrank(user);
        // approve faucet to spend 10_000 bDRIP tokens
        bDrip.approve(address(faucet), 10_000 ether);
        // deposit 10_000 bDRIP tokens to the faucet
        faucet.deposit(10_000 ether);

        // skip 1 year in time
        vm.warp(block.timestamp + 365 days);
        // save deployer balance
        uint deployerBalance = bDrip.balanceOf(deployer);

        // withdraw 9_000 bDRIP tokens from the faucet - 10% fee on deposit
        faucet.withdraw(9_000 ether);
        // get user faucet data
        (uint faucetId,
        uint depositedAmount,
        uint claimedAmount,
        uint lastClaimed,
        uint createdAt) = faucet.faucetAccounts(user);
        
        // amount to withdraw should be equal to deposit - 10% fee on deposit
        // amount deposited is 9_000 ether
        // we apply the claim fee of 10% so the amount to withdraw is 9_000 - 10% = 8_100 ether
        uint fee = (9_000 ether * 10 / 100);
        uint amountToWithdraw = (9_000 ether) - fee;

        // checks after withdraw
        // user balance should be equal to the amount to withdraw
        assertEq(bDrip.balanceOf(user), amountToWithdraw);
        // faucet balance should be equal to the amount deposited - amount to withdraw
        assertEq(bDrip.balanceOf(address(faucet)), 9_000 ether - amountToWithdraw - fee);
        // deployer balance should be equal to the amount to withdraw
        assertEq(bDrip.balanceOf(deployer), deployerBalance + fee);
        // faucetId should be equal to 1
        assertEq(faucetId, 1);
        // depositedAmount should be equal to 0
        assertEq(depositedAmount, 0);
        // claimedAmount should be equal to 0
        assertEq(claimedAmount, 0);
        // lastClaimed should be equal to the current block timestamp - 1 year
        assertEq(lastClaimed, block.timestamp - 365 days);
        // createdAt should be equal to the current block timestamp - 1 year
        assertEq(createdAt, block.timestamp - 365 days);
    } */

    function test_fail_deposit() public {
        // target of the test:
        // user cannot deposit tokens if he has not approved the faucet to spend them
        // user cannot deposit tokens if the balance is < amount
        uint faucetId = 1;

        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(IERC20Errors.ERC20InsufficientAllowance.selector, address(faucet), 0, 10_000 ether));
        // user cannot deposit tokens if he has not approved the faucet to spend them
        faucet.deposit(faucetId, user, 10_000 ether);

        vm.prank(deployer);
        // send 10_000 bDRIP tokens to the user
        bDrip.transfer(user, 10_000 ether);

        vm.startPrank(user);
        // approve faucet to spend 10_000 bDRIP tokens
        bDrip.approve(address(faucet), 10_001 ether);

        // user cannot deposit tokens if the balance is < amount
        //vm.expectRevert(abi.encodeWithSelector(IERC20Errors.ERC20InsufficientBalance.selector, user, 10_000 ether, 10_001 ether));
        //faucet.deposit(faucetId, user, 10_001 ether);

        // create faucet with deployer - to trigger NotYourFaucet
        vm.stopPrank();
        vm.startPrank(deployer);
        bDrip.approve(address(faucet), 10_000 ether);
        faucet.deposit(0, deployer, 10_000 ether);

        // if the msg.sender is not the presale
        // user can deposit only for himself
        vm.expectRevert(Faucet.InvalidUser.selector);
        faucet.deposit(0, user1, 10_000 ether);

        // an user cannot deposit for a faucet not owned by him
        vm.expectRevert(Faucet.NotYourFaucet.selector);
        faucet.deposit(faucetId, user, 10_000 ether);

        // cannot deposit more the MAX_FAUCET_TOKENS
        vm.expectRevert(Faucet.MaxDepositReached.selector);
        faucet.deposit(0, deployer, MAX_FAUCET_REWARDS + 1);

        // cannot deposit less then MIN_DEPOSIT
        vm.expectRevert(Faucet.MinimumDepositNotReached.selector);
        faucet.deposit(0, deployer, 9 ether);

        // create 5000 faucets - 1 created before
        for(uint i = 0; i < 4_999; i++) {
            faucet.createFaucet(deployer);
        }
        // cannot deposit with more then 5.000 faucets
        vm.expectRevert(Faucet.AllFaucetsAreCreated.selector);
        faucet.deposit(0, deployer, 10_000 ether);
    }

    function test_fail_claim() public {
        // target of the test:
        // user cannot claim tokens if he has not deposited first
        // user cannot claim more then 36_500 tokens per faucet
        uint faucetId = 1;
        
        vm.prank(user);
        vm.expectRevert(Faucet.InvalidUser.selector);
        // user cannot claim tokens if he has not deposited first
        faucet.claim(faucetId);

        // user cannot claim if he has no faucet
        // TODO: how do i trigger you? mhm

        // send 10_000 bDRIP tokens to the user
        uint amountToDeposit = 10_000 ether;
        uint amountToFund = MAX_FAUCET_REWARDS;
        uint maxReward = amountToFund;
        vm.prank(deployer);
        bDrip.transfer(user, amountToDeposit);
        vm.prank(deployer);
        bDrip.transfer(address(faucet), amountToFund);

        // user cannot claim more then 36_500 tokens per faucet
        vm.startPrank(user);
        // approve faucet to spend 10_000 bDRIP tokens
        bDrip.approve(address(faucet), amountToDeposit);

        faucet.deposit(faucetId, user, amountToDeposit);

        // skip 365 days in time
        vm.warp(block.timestamp + 365 days);

        // user will be able to claim 36500 tokens (365% of 10_000)
        faucet.claim(faucetId);
        
        // remaning amount on faucet should be amountToFund + (deposit - fees) - (claimed - fees)
        assertEq(
            bDrip.balanceOf(address(faucet)),
            amountToFund
            + (amountToDeposit - (amountToDeposit * depositFee / 100))
            - (maxReward - (maxReward * claimFee / 100)));
    }

    function test_fail_claim_1() public {
        // user cannot claim if he reached MAX_FAUCET_REWARDS
        // to reach MAX_FAUCET_REWARDS the user must claim until
        // he reach it
        // rewards are generated every 24h
        uint amountToDeposit = 10_000 ether;
        uint faucetId = 1;
        vm.prank(deployer);
        bDrip.transfer(user, amountToDeposit);
        // fund Faucet with MAX_FAUCET_REWARDS
        vm.prank(deployer);
        bDrip.transfer(address(faucet), MAX_FAUCET_REWARDS);
        vm.startPrank(user);

        // approve faucet to spend 10_000 bDRIP tokens
        bDrip.approve(address(faucet), amountToDeposit);

        // deposit 10_000 bDRIP tokens to the faucet
        faucet.deposit(1, user, amountToDeposit);

        // skip 1 day to check the claimable amount
        vm.warp(block.timestamp + 1 days);

        (
            uint _claimableAmount,
            uint _claimableAmountWithFee
        ) = faucet.calculateClaimAmount(faucetId);

        // claimable amount should be equal to 1% of the amount deposited
        // amount deposited is 9_000 ether
        assertEq(_claimableAmount, 81 ether);
        assertEq(_claimableAmountWithFee, 9 ether);

        // calculate how much time we should do in loop skip + claim
        uint loopsNeeded = MAX_FAUCET_REWARDS / _claimableAmount;
        loopsNeeded++; // add 1 more claim to reach MAX_FAUCET_REWARDS


        // claim until we reach MAX_FAUCET_REWARDS
        for(uint i = 0; i < loopsNeeded; i++) {
            faucet.claim(faucetId);
            vm.warp(block.timestamp + 1 days);
        }

        // we should have reached MAX_FAUCET_REWARDS
        vm.expectRevert(Faucet.MaxRewardReached.selector);
        faucet.claim(faucetId);
    }

    function test_multiple_deposits() public {
        // target of the test:
        // user deposit 5_000 bDRIP tokens to the faucet
        uint depositAmount = 5_000 ether;
        uint depositAmountAfterFees = depositAmount - (depositAmount * depositFee / 100);
        uint faucetId = 1;

        vm.prank(deployer);
        // send 10_000 bDRIP tokens to the user
        bDrip.transfer(user, depositAmount * 2);
        // save deployer balance
        uint deployerBalance = bDrip.balanceOf(deployer);

        vm.startPrank(user);

        // approve faucet to spend 10_000 bDRIP tokens
        bDrip.approve(address(faucet), depositAmount * 2);
        // deposit 5_000 bDRIP tokens to the faucet
        vm.expectEmit(address(faucet));
        emit FaucetDeposit(user, faucetId, depositAmountAfterFees);
        faucet.deposit(faucetId, user, depositAmount);
        // get user faucet data
        (uint depositedAmount,
        uint claimedAmount,
        uint lastClaimed,
        uint createdAt) = faucet.faucets(faucetId);
        // checks after deposit

        // Faucet balance should be equal to the amount deposited - fee
        assertEq(bDrip.balanceOf(address(faucet)), depositAmount - (depositAmount * depositFee / 100));
        // deployer balance should be equal to the fee
        assertEq(bDrip.balanceOf(deployer), deployerBalance + (depositAmount * depositFee / 100));
        // user balance should be equal to 5_000
        assertEq(bDrip.balanceOf(user), depositAmount);
        // faucetId should be equal to 1
        assertEq(faucetId, 1);
        // depositedAmount should be equal to 4500 ether
        assertEq(depositedAmount, depositAmount - (depositAmount * depositFee / 100));
        // claimedAmount should be equal to 0
        assertEq(claimedAmount, 0);
        // lastClaimed should be equal to the current block timestamp
        assertEq(lastClaimed, block.timestamp);
        // createdAt should be equal to the current block timestamp
        assertEq(createdAt, block.timestamp);

        // deposit 5_000 bDRIP tokens to the faucet
        vm.expectEmit(address(faucet));
        emit FaucetDeposit(user, faucetId, depositAmountAfterFees);
        faucet.deposit(faucetId, user, depositAmount);

        // Faucet balance should be equal to the amount deposited - fee
        assertEq(bDrip.balanceOf(address(faucet)), depositAmount * 2 - (depositAmount * depositFee / 100) * 2);

        // user balance should be equal to 0
        assertEq(bDrip.balanceOf(user), 0);

        // get user faucet data
        (depositedAmount,
        claimedAmount,
        lastClaimed,
        createdAt) = faucet.faucets(faucetId);

        // depositedAmount should be equal to 9_000 ether
        assertEq(depositedAmount, depositAmount * 2 - (depositAmount * depositFee / 100) * 2);
    }

    function test_setFees() public {
        // target of the test:
        // check if the setFees function works

        // cannot be called from user
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user));
        faucet.setFees(15, 15);

        // confirm actual fees
        (
            uint _depositFee,
            uint _claimFee
        ) = faucet.faucetFees();
        assertEq(_depositFee, depositFee);
        assertEq(_claimFee, claimFee);

        vm.startPrank(deployer);
        // set fees to 15% for deposit and 15% for claim
        faucet.setFees(15, 15);

        // confirm new fees
        (
            _depositFee,
            _claimFee
        ) = faucet.faucetFees();

        assertEq(_depositFee, 15);
        assertEq(_claimFee, 15);

        // cannot set fee over 30%
        vm.expectRevert(Faucet.InvalidFees.selector);
        faucet.setFees(31, 15);
        
        // cannot set fee over 30%
        vm.expectRevert(Faucet.InvalidFees.selector);
        faucet.setFees(15, 31);

        // cannot set fee over 30%
        vm.expectRevert(Faucet.InvalidFees.selector);
        faucet.setFees(31, 31);
    }

    function test_setFeeReceiver() public {
        // target of the test:
        // check if the setFeeReceiver function works

        // cannot be called from user
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user));
        faucet.setFeeReceiver(user);

        // confirm actual fee receiver
        assertEq(faucet.feeReceiver(), deployer);

        vm.startPrank(deployer);
        // set fee receiver to user
        faucet.setFeeReceiver(user);

        // confirm new fee receiver
        assertEq(faucet.feeReceiver(), user);
    }

    function test_setPresaleContract() public {
        // target of the test:
        // check if the setPresaleContract function works

        // cannot be called from user
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user));
        faucet.setPresaleContract(user);

        // confirm actual presale contract
        assertEq(faucet.presaleContract(), address(presale));

        vm.startPrank(deployer);
        // set presale contract to user
        faucet.setPresaleContract(user);

        // confirm new presale contract
        assertEq(faucet.presaleContract(), user);
    }

    function test_emergencyWithdraw() public {
        // target of the test:
        // check if the emergencyWithdraw function works

        // cannot be called from user
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user));
        faucet.emergencyWithdraw(10_000 ether);

        // confirm actual faucet balance
        assertEq(bDrip.balanceOf(address(faucet)), 0);

        vm.startPrank(deployer);
        // send 10_000 bDRIP tokens to the faucet
        bDrip.transfer(address(faucet), 10_000 ether);

        // confirm new faucet balance
        assertEq(bDrip.balanceOf(address(faucet)), 10_000 ether);

        // withdraw 10_000 bDRIP tokens from the faucet
        faucet.emergencyWithdraw(10_000 ether);

        // confirm new faucet balance
        assertEq(bDrip.balanceOf(address(faucet)), 0);
    }

    function test_fail_createFaucet() public {
        // target of the test
        /**
        if(msg.sender != presaleContract) {
            // only the user can create faucet for himself
            if(msg.sender != user) revert InvalidUser();
        }
        if(faucetLastCreatedId     == MAX_FAUCET_COUNT) revert AllFaucetsAreCreated();
         */

        // if the parameter user is different from msg.sender
        // only the presale must pass
        vm.prank(user);
        vm.expectRevert(Faucet.InvalidUser.selector);
        faucet.createFaucet(deployer);

        // create 5.000 faucets with the deployer
        vm.startPrank(deployer);
        for(uint i = 0; i < 5_000; i++) {
            faucet.createFaucet(deployer);
        }

        // cannot create more then 5.000 faucets
        vm.expectRevert(Faucet.AllFaucetsAreCreated.selector);
        faucet.createFaucet(deployer);
    }
}
