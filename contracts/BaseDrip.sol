// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BaseDrip
 * @author Krakovia
 */
contract BaseDrip is ERC20, Ownable {

    address public feeReceiver;
    address public pair;
    uint public    fees;

    mapping(address user => bool isExcluded) public excludedFromFees;

    event FeesSet        (uint newFee);
    event FeeReceiverSet (address feeReceiver);
    event PairSet        (address pair);
    event FeeCollected   (address from, address to, uint amount);

    /**
     * 
     * @param _feeReceiver - address to receive fees
     */
    constructor(address _feeReceiver) ERC20("BaseDrip", "bDRIP") Ownable(msg.sender) {
        _mint(msg.sender, 5_000_000 * 10 ** decimals());
        feeReceiver = _feeReceiver;
        excludedFromFees[msg.sender] = true;
    }

    /**
     * @notice - set fees for transfers
     * @dev - fees are applied only for transfers between non-excluded accounts
     * @param newFees - new fees in percents (1% = 1, 10% = 10)
     */
    function setFees(uint newFees) external onlyOwner {
        require(newFees <= 10, "Fees must be equal or less then 10%");
        fees = newFees;
        emit FeesSet(newFees);
    }

    /**
     * @notice - set fee receiver
     * @param newFeeReceiver - new fee receiver address
     */
    function setFeeReceiver(address newFeeReceiver) external onlyOwner {
        feeReceiver = newFeeReceiver;
        emit FeeReceiverSet(newFeeReceiver);
    }

    /**
     * @notice - set pair address
     * @param newPair - new pair address
     */
    function setPair(address newPair) external onlyOwner {
        pair = newPair;
        emit PairSet(newPair);
    }

    function _update(address sender, address recipient, uint256 amount) internal override {
    // checks
        require(amount != 0, "Amount must be greater then 0");
    // apply fees if both sender and recipient are not excluded from fees
        if (fees > 0 && !excludedFromFees[sender] && !excludedFromFees[recipient]) {
            uint feeAmount = amount * fees / 100;
            amount        -= feeAmount;
            super._update(sender, feeReceiver, feeAmount);
            emit FeeCollected(sender, feeReceiver, feeAmount);
        }
    // transfer tokens
        super._update(sender, recipient, amount);
    }

    function airdrop(address[] calldata recipients, uint256[] calldata amounts) external {
        uint totalLoops = recipients.length;
        require(totalLoops == amounts.length, "Arrays must be equal");
        for (uint i = 0; i < totalLoops;) {
            _update(msg.sender, recipients[i], amounts[i]);
            unchecked {
                ++i;
            }
        }
    }
}