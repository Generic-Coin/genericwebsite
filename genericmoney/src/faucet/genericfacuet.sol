/*
SPDX-License-Identifier: GPL-3.0
*/
pragma solidity 0.8.8;

//Generic Coin Faucet

interface GenericToken {
  function balanceOf(address account) external view returns (uint256);

  function transfer(address recipient, uint256 amount) external returns (bool);

  function transferFrom(
    address sender,
    address recipient,
    uint256 amount
  ) external returns (bool);
}

interface GenericFaucetInterface {
  function ViewClaimable() external returns (bool);

  function ViewLockDuration() external returns (uint256);

  function ViewClaimTime() external view returns (uint256);

  function ViewUserStaked() external view returns (uint256);

  function ViewTokensToLock() external view returns (uint256);

  function ViewHoldersLength() external returns (uint256);

  function ViewTokenBalance() external returns (uint256);

  function ViewUserTimeLeft() external returns (uint256);

  function CheckHolderAddress(uint256 i) external returns (address);

  function SetLockDuration(uint256 secs) external;

  function WithdrawTokens(uint256 amount) external;

  function UserStakeTokens() external;

  function UserClaimTokens() external;
}

contract GenericFaucet {
  modifier onlyOwner() {
    require(_owner == msg.sender, 'Ownable: caller is not the owner');
    _;
  }

  mapping(address => uint256) public StakeTimeStamp;
  mapping(address => uint256) public StakedTokens;

  //address private GenericAddress = 0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf;
  address private GenericAddress = 0x6A9431f053eB6D1163336216d192526792a7Fb7B;
  address[] public holders;
  address public _owner;
  //Tokens % of holders
  //poparray
  //18 Decimals (100 Tokens)
  uint256 private LockDuration = 86400 * 7;
  uint256 private ClaimTime = 86400 * 7;
  uint256 private TokensToLock = 100000000000000000000;

  //mapping for each lockduration potentially?
  constructor(address owner) {
    _owner = owner;
  }

  function getPercent(uint256 part, uint256 whole)
    public
    pure
    returns (uint256 percent)
  {
    uint256 numerator = part * 100000000;
    require(numerator > part);
    uint256 temp = numerator / whole; // proper rounding up
    return temp / 10;
  }

  function poparray(uint256 index) internal {
    require(index < holders.length);
    holders[index] = holders[holders.length - 1];
    holders.pop();
  }

  function ViewRewardPool() public view returns (uint256) {
    return RewardPool;
  }

  function ViewLockDuration() public view returns (uint256) {
    return LockDuration;
  }

  function ViewClaimTime() public view returns (uint256) {
    return ClaimTime;
  }

  function ViewHoldersLength() public view returns (uint256) {
    return holders.length;
  }

  function ViewTokensToLock() public view returns (uint256) {
    return TokensToLock;
  }

  function CheckHolderAddress(uint256 i) public view returns (address) {
    return holders[i];
  }

  function ViewUserStaked(address user) public view returns (uint256) {
    return StakedTokens[user];
  }

  function ViewClaimable() public view returns (bool) {
    if (
      block.timestamp > StakeTimeStamp[msg.sender] &&
      StakeTimeStamp[msg.sender] != 0 &&
      CheckIfHolder(msg.sender) == true
    ) {
      return true;
    }
    return false;
  }

  function ViewUserTimeLeft(address user) public view returns (uint256) {
    if (StakeTimeStamp[user] > block.timestamp) {
      return StakeTimeStamp[user] - block.timestamp;
    }
    return 0;
  }

  function SetLockDuration(uint256 secs) public onlyOwner {
    LockDuration = secs;
  }

  function ViewTokenBalance() public view returns (uint256) {
    //get token balance of address(this)
    return GenericToken(GenericAddress).balanceOf(address(this));
  }

  function WithdrawTokens(address recipient, uint256 amount) public onlyOwner {
    GenericToken(GenericAddress).transfer(recipient, amount);
  }

  function CheckIfHolder(address wallet) public view returns (bool) {
    for (uint256 x = 0; x < holders.length; x++) {
      if (holders[x] == wallet) {
        return true;
      }
    }
    return false;
  }

  function UserStakeTokens() public {
    require(
      CheckIfHolder(msg.sender) == false,
      'User has already staked tokens.'
    );
    GenericToken(GenericAddress).transferFrom(
      msg.sender,
      address(this),
      TokensToLock
    );
    StakedTokens[msg.sender] = TokensToLock;
    StakeTimeStamp[msg.sender] = block.timestamp + LockDuration;
    holders.push(msg.sender);
  }

  function UserClaimTokens() public {
    require(CheckIfHolder(msg.sender) == true, 'User has no staked tokens.');
    //if elapsed time has passed longer than stake duration since timestamp send dividends
    if (
      block.timestamp > StakeTimeStamp[msg.sender] &&
      StakeTimeStamp[msg.sender] != 0 &&
      CheckIfHolder(msg.sender) == true
    ) {
      uint256 ststemp = StakeTimeStamp[msg.sender];
      StakeTimeStamp[msg.sender] = 0;
      uint256 refund = StakedTokens[msg.sender];
      StakedTokens[msg.sender] = 0;
      GenericToken(GenericAddress).transfer(msg.sender, refund);
      if (block.timestamp > ststemp && block.timestamp < ststemp + ClaimTime) {
        uint256 dividend = ((getPercent(1, holders.length) *
          ViewTokenBalance()) / 10000000);
        GenericToken(GenericAddress).transfer(msg.sender, dividend);
      }
      //Remove user from holders array
      for (uint256 x = 0; x < holders.length; x++) {
        if (holders[x] == msg.sender) {
          poparray(x);
          break;
        }
      }
    }
  }
}
