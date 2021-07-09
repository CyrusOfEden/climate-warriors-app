import { ethers } from "ethers";
import { ArrowDownIcon, ArrowUpIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons"
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  AlertIcon,
  Box,
  Button,
  Container,
  HStack,
  Heading,
  IconButton,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Spacer,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import { useSetState } from "ahooks"
import React, { useRef, useState } from "react"

import { ProgressStatCard } from "../components/ProgressStatCard"

interface VaultState {
  global: any
  wallet: any
}

export const Vault: React.FC = () => {
  const [state, setState] = useSetState<VaultState>({
    wallet: {
      deposited: 0,
      daily: {
        mco2: 0.0,
        usdc: 0.0,
      },
    },
    global: {
      usdc: {
        title: "USDC Locked",
        id: "usdc",
        limit: 50000,
        value: 0,
      },
      mco2: {
        title: "Tons CO2",
        id: "mco2",
        limit: 25,
        value: 0,
      },
    },
  })

  console.log(state)

  return (
    <Container maxW="container.lg">
      <SimpleGrid columns={2} spacing={8}>
        <GlobalFundraiseProgress {...state} />
        <DepositActions {...state.wallet} setState={setState} />
      </SimpleGrid>
    </Container>
  )
}

const GlobalFundraiseProgress: React.FC<any> = ({
  global: { mco2, usdc },
  wallet: { daily },
}) => {
  return (
    <VStack
      w="100%"
      maxW="container.md"
      spacing={8}
      align="start"
      backgroundColor="white"
      p={8}
      borderColor="gray.100"
      borderWidth={1}
      boxShadow="inner"
      rounded="lg"
    >
      <Heading color="green.800" size="lg">
        Climate Warriors Stats
      </Heading>
      <ProgressStatCard data={mco2} boost={daily.mco2} />
      <Box backgroundColor="gray.100" height="2px" width="100%" rounded="lg" />
      <ProgressStatCard data={usdc} boost={daily.usdc} />
    </VStack>
  )
}

const DepositActions: React.FC<any> = ({ deposited, setState }) => {
  const { isOpen: isDepositModelOpen, onToggle: toggleDepositModal } =
    useDisclosure()

    const { isOpen: isWithdrawModelOpen, onToggle: toggleWithdrawModal } =
    useDisclosure()


    const [shouldShow, setShouldShow] = useState(true);

  return (
    <VStack
      align="center"
      justify="center"
      backgroundColor="white"
      borderColor="gray.100"
      borderWidth={1}
      boxShadow="inner"
      flex={1}
      p={8}
      rounded="lg"
      spacing={4}
    >
      {deposited < 100 && (
        <>
          <Spacer maxH={2} />
          <Heading color="green.600" size="sm">
            Next quest:
          </Heading>
          <Alert status="warning" rounded="md" p={4}>
            <AlertIcon />
            Deposit 100 USDC
          </Alert>
        </>
      )}
      <Heading color="green.600" size="sm" fontWeight="normal">
        Adjust your position
      </Heading>
      <HStack>
        <Button
          colorScheme="green"
          rightIcon={<ArrowUpIcon />}
          onClick={toggleDepositModal}
        >
          Deposit
        </Button>
        <DepositModal
          isOpen={isDepositModelOpen}
          onClose={toggleDepositModal}
          setState={setState}
        />
        <Button rightIcon={<ArrowDownIcon />} onClick={toggleWithdrawModal}>
          Withdraw
        </Button>
        <WithdrawModal
          isOpen={isWithdrawModelOpen}
          onClose={toggleWithdrawModal}
          setState={setState}
        />
        {shouldShow ? (
          <Button id="approve"
          colorScheme="blue"
          rightIcon={<CheckIcon />}
          onClick={() => {
            console.log(alreadyApproved());
            if (alreadyApproved()) {
              setShouldShow(false)
            }
            else{
              approve()
            }
          }}
        >
          Approve USDC
        </Button>
        ): null}
        
      </HStack>
    </VStack>
  )
}

interface ActionModalProps
  extends Omit<AlertDialogProps, "leastDestructiveRef" | "children"> {
  setState: any
}

const DepositModal: React.FC<ActionModalProps> = ({ setState, ...props }) => {
  const depositAmountRef = useRef(null)

  const [amount, setAmount] = useState<number>(100)

  return (
    <AlertDialog
      leastDestructiveRef={depositAmountRef}
      {...props}
      motionPreset="slideInBottom"
      size="md"
    >
      <AlertDialogOverlay>
        <AlertDialogContent p={8}>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            display="flex"
            align="center"
            justifyContent="space-between"
            mb={2}
          >
            <Heading size="lg" color="green.800">
              Deposit USDC
            </Heading>
            <IconButton
              ml="auto"
              aria-label="Cancel Deposit"
              size="sm"
              variant="outline"
              rounded="3xl"
              onClick={props.onClose}
              icon={<CloseIcon />}
            />
          </AlertDialogHeader>

          <AlertDialogBody>
            <HStack>
              <NumberInput precision={0} step={1} flex={2} size="md" value={amount}
                onChange={(_, number) => setAmount(number)}>
                <NumberInputField
                  ref={depositAmountRef.current}
                  borderColor="gray.300"
                  _focus={{ borderColor: "green.500" }}
                />
              </NumberInput>
              
              <Button
                flex={1}
                colorScheme="green"
                onClick={() => {
                  deposit(amount)
                  console.log("After deposit");
                  setState((state) => ({
                    ...state,
                    wallet: {
                      deposited: contractBalance(),
                      daily: { mco2: 0.0203, usdc: 1.34 },
                    },
                  }
                  ))
                  props.onClose()
                  console.log("Close");
                }}
              >
                Deposit
              </Button>
            </HStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

const WithdrawModal: React.FC<ActionModalProps> = ({ setState, ...props }) => {
  const cancelWithdrawRef = useRef(null)

  const [amount, setAmount] = useState<number>(100)

  return (
    <AlertDialog
      leastDestructiveRef={cancelWithdrawRef}
      {...props}
      motionPreset="slideInBottom"
      size="md"
    >
      <AlertDialogOverlay opacity={0.8}>
        <AlertDialogContent p={8}>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            display="flex"
            align="center"
            justifyContent="space-between"
            mb={2}
          >
            <Heading size="lg" color="green.800">
              Withdraw USDC
            </Heading>
            <IconButton
              ml="auto"
              aria-label="Cancel Deposit"
              size="sm"
              variant="outline"
              rounded="3xl"
              onClick={props.onClose}
              ref={cancelWithdrawRef}
              icon={<CloseIcon />}
            />
          </AlertDialogHeader>

          <AlertDialogBody>
            <HStack>
              <NumberInput precision={0} step={10} flex={2} size="md" value={amount}
                onChange={(_, number) => setAmount(number)}>
                <NumberInputField
                  borderColor="gray.300"
                  _focus={{ borderColor: "green.500" }}
                />
              </NumberInput>
              <Button flex={1} colorScheme="purple" onClick={() => {
            withdraw(amount)
          }}>
                Withdraw
              </Button>
            </HStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

// You can also use an ENS name for the contract address
const usdcAddress = "0xe22da380ee6B445bb8273C81944ADEB6E8450422";
const climateWarriorsAddress = "0xFC5051C560e8C311aF3dA1CD51aA4B462f9aD977";
const aUSDCaddress = "0xe12AFeC5aa12Cf614678f9bFeeB98cA9Bb95b5B0";
// constant
const MAX_UINT256 = ethers.constants.MaxUint256;
// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const aUSDCabi = [
  {
     "inputs":[
        {
           "internalType":"contract ILendingPool",
           "name":"pool",
           "type":"address"
        },
        {
           "internalType":"address",
           "name":"underlyingAssetAddress",
           "type":"address"
        },
        {
           "internalType":"address",
           "name":"reserveTreasuryAddress",
           "type":"address"
        },
        {
           "internalType":"string",
           "name":"tokenName",
           "type":"string"
        },
        {
           "internalType":"string",
           "name":"tokenSymbol",
           "type":"string"
        },
        {
           "internalType":"address",
           "name":"incentivesController",
           "type":"address"
        }
     ],
     "stateMutability":"nonpayable",
     "type":"constructor"
  },
  {
     "anonymous":false,
     "inputs":[
        {
           "indexed":true,
           "internalType":"address",
           "name":"owner",
           "type":"address"
        },
        {
           "indexed":true,
           "internalType":"address",
           "name":"spender",
           "type":"address"
        },
        {
           "indexed":false,
           "internalType":"uint256",
           "name":"value",
           "type":"uint256"
        }
     ],
     "name":"Approval",
     "type":"event"
  },
  {
     "anonymous":false,
     "inputs":[
        {
           "indexed":true,
           "internalType":"address",
           "name":"from",
           "type":"address"
        },
        {
           "indexed":true,
           "internalType":"address",
           "name":"to",
           "type":"address"
        },
        {
           "indexed":false,
           "internalType":"uint256",
           "name":"value",
           "type":"uint256"
        },
        {
           "indexed":false,
           "internalType":"uint256",
           "name":"index",
           "type":"uint256"
        }
     ],
     "name":"BalanceTransfer",
     "type":"event"
  },
  {
     "anonymous":false,
     "inputs":[
        {
           "indexed":true,
           "internalType":"address",
           "name":"from",
           "type":"address"
        },
        {
           "indexed":true,
           "internalType":"address",
           "name":"target",
           "type":"address"
        },
        {
           "indexed":false,
           "internalType":"uint256",
           "name":"value",
           "type":"uint256"
        },
        {
           "indexed":false,
           "internalType":"uint256",
           "name":"index",
           "type":"uint256"
        }
     ],
     "name":"Burn",
     "type":"event"
  },
  {
     "anonymous":false,
     "inputs":[
        {
           "indexed":true,
           "internalType":"address",
           "name":"underlyingAsset",
           "type":"address"
        },
        {
           "indexed":true,
           "internalType":"address",
           "name":"pool",
           "type":"address"
        },
        {
           "indexed":false,
           "internalType":"address",
           "name":"treasury",
           "type":"address"
        },
        {
           "indexed":false,
           "internalType":"address",
           "name":"incentivesController",
           "type":"address"
        },
        {
           "indexed":false,
           "internalType":"uint8",
           "name":"aTokenDecimals",
           "type":"uint8"
        },
        {
           "indexed":false,
           "internalType":"string",
           "name":"aTokenName",
           "type":"string"
        },
        {
           "indexed":false,
           "internalType":"string",
           "name":"aTokenSymbol",
           "type":"string"
        },
        {
           "indexed":false,
           "internalType":"bytes",
           "name":"params",
           "type":"bytes"
        }
     ],
     "name":"Initialized",
     "type":"event"
  },
  {
     "anonymous":false,
     "inputs":[
        {
           "indexed":true,
           "internalType":"address",
           "name":"from",
           "type":"address"
        },
        {
           "indexed":false,
           "internalType":"uint256",
           "name":"value",
           "type":"uint256"
        },
        {
           "indexed":false,
           "internalType":"uint256",
           "name":"index",
           "type":"uint256"
        }
     ],
     "name":"Mint",
     "type":"event"
  },
  {
     "anonymous":false,
     "inputs":[
        {
           "indexed":true,
           "internalType":"address",
           "name":"from",
           "type":"address"
        },
        {
           "indexed":true,
           "internalType":"address",
           "name":"to",
           "type":"address"
        },
        {
           "indexed":false,
           "internalType":"uint256",
           "name":"value",
           "type":"uint256"
        }
     ],
     "name":"Transfer",
     "type":"event"
  },
  {
     "inputs":[
        
     ],
     "name":"ATOKEN_REVISION",
     "outputs":[
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"DOMAIN_SEPARATOR",
     "outputs":[
        {
           "internalType":"bytes32",
           "name":"",
           "type":"bytes32"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"EIP712_REVISION",
     "outputs":[
        {
           "internalType":"bytes",
           "name":"",
           "type":"bytes"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"PERMIT_TYPEHASH",
     "outputs":[
        {
           "internalType":"bytes32",
           "name":"",
           "type":"bytes32"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"POOL",
     "outputs":[
        {
           "internalType":"contract ILendingPool",
           "name":"",
           "type":"address"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"RESERVE_TREASURY_ADDRESS",
     "outputs":[
        {
           "internalType":"address",
           "name":"",
           "type":"address"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"UINT_MAX_VALUE",
     "outputs":[
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"UNDERLYING_ASSET_ADDRESS",
     "outputs":[
        {
           "internalType":"address",
           "name":"",
           "type":"address"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"",
           "type":"address"
        }
     ],
     "name":"_nonces",
     "outputs":[
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"owner",
           "type":"address"
        },
        {
           "internalType":"address",
           "name":"spender",
           "type":"address"
        }
     ],
     "name":"allowance",
     "outputs":[
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"spender",
           "type":"address"
        },
        {
           "internalType":"uint256",
           "name":"amount",
           "type":"uint256"
        }
     ],
     "name":"approve",
     "outputs":[
        {
           "internalType":"bool",
           "name":"",
           "type":"bool"
        }
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"user",
           "type":"address"
        }
     ],
     "name":"balanceOf",
     "outputs":[
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"user",
           "type":"address"
        },
        {
           "internalType":"address",
           "name":"receiverOfUnderlying",
           "type":"address"
        },
        {
           "internalType":"uint256",
           "name":"amount",
           "type":"uint256"
        },
        {
           "internalType":"uint256",
           "name":"index",
           "type":"uint256"
        }
     ],
     "name":"burn",
     "outputs":[
        
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"decimals",
     "outputs":[
        {
           "internalType":"uint8",
           "name":"",
           "type":"uint8"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"spender",
           "type":"address"
        },
        {
           "internalType":"uint256",
           "name":"subtractedValue",
           "type":"uint256"
        }
     ],
     "name":"decreaseAllowance",
     "outputs":[
        {
           "internalType":"bool",
           "name":"",
           "type":"bool"
        }
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"getIncentivesController",
     "outputs":[
        {
           "internalType":"contract IAaveIncentivesController",
           "name":"",
           "type":"address"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"user",
           "type":"address"
        }
     ],
     "name":"getScaledUserBalanceAndSupply",
     "outputs":[
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        },
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"spender",
           "type":"address"
        },
        {
           "internalType":"uint256",
           "name":"addedValue",
           "type":"uint256"
        }
     ],
     "name":"increaseAllowance",
     "outputs":[
        {
           "internalType":"bool",
           "name":"",
           "type":"bool"
        }
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"uint8",
           "name":"underlyingAssetDecimals",
           "type":"uint8"
        },
        {
           "internalType":"string",
           "name":"tokenName",
           "type":"string"
        },
        {
           "internalType":"string",
           "name":"tokenSymbol",
           "type":"string"
        }
     ],
     "name":"initialize",
     "outputs":[
        
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"user",
           "type":"address"
        },
        {
           "internalType":"uint256",
           "name":"amount",
           "type":"uint256"
        },
        {
           "internalType":"uint256",
           "name":"index",
           "type":"uint256"
        }
     ],
     "name":"mint",
     "outputs":[
        {
           "internalType":"bool",
           "name":"",
           "type":"bool"
        }
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"uint256",
           "name":"amount",
           "type":"uint256"
        },
        {
           "internalType":"uint256",
           "name":"index",
           "type":"uint256"
        }
     ],
     "name":"mintToTreasury",
     "outputs":[
        
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"name",
     "outputs":[
        {
           "internalType":"string",
           "name":"",
           "type":"string"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"owner",
           "type":"address"
        },
        {
           "internalType":"address",
           "name":"spender",
           "type":"address"
        },
        {
           "internalType":"uint256",
           "name":"value",
           "type":"uint256"
        },
        {
           "internalType":"uint256",
           "name":"deadline",
           "type":"uint256"
        },
        {
           "internalType":"uint8",
           "name":"v",
           "type":"uint8"
        },
        {
           "internalType":"bytes32",
           "name":"r",
           "type":"bytes32"
        },
        {
           "internalType":"bytes32",
           "name":"s",
           "type":"bytes32"
        }
     ],
     "name":"permit",
     "outputs":[
        
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"user",
           "type":"address"
        }
     ],
     "name":"scaledBalanceOf",
     "outputs":[
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"scaledTotalSupply",
     "outputs":[
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"symbol",
     "outputs":[
        {
           "internalType":"string",
           "name":"",
           "type":"string"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        
     ],
     "name":"totalSupply",
     "outputs":[
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        }
     ],
     "stateMutability":"view",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"recipient",
           "type":"address"
        },
        {
           "internalType":"uint256",
           "name":"amount",
           "type":"uint256"
        }
     ],
     "name":"transfer",
     "outputs":[
        {
           "internalType":"bool",
           "name":"",
           "type":"bool"
        }
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"sender",
           "type":"address"
        },
        {
           "internalType":"address",
           "name":"recipient",
           "type":"address"
        },
        {
           "internalType":"uint256",
           "name":"amount",
           "type":"uint256"
        }
     ],
     "name":"transferFrom",
     "outputs":[
        {
           "internalType":"bool",
           "name":"",
           "type":"bool"
        }
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"from",
           "type":"address"
        },
        {
           "internalType":"address",
           "name":"to",
           "type":"address"
        },
        {
           "internalType":"uint256",
           "name":"value",
           "type":"uint256"
        }
     ],
     "name":"transferOnLiquidation",
     "outputs":[
        
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  },
  {
     "inputs":[
        {
           "internalType":"address",
           "name":"target",
           "type":"address"
        },
        {
           "internalType":"uint256",
           "name":"amount",
           "type":"uint256"
        }
     ],
     "name":"transferUnderlyingTo",
     "outputs":[
        {
           "internalType":"uint256",
           "name":"",
           "type":"uint256"
        }
     ],
     "stateMutability":"nonpayable",
     "type":"function"
  }
];

const usdcAbi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

const climateWarriorsAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_donated",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_from",
        "type": "address"
      }
    ],
    "name": "Funding",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_earned",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "_owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "account",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "deposited",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "earned",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "donated",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveIndex",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkAccount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkCarbonCredits",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "setOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "generosity",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawToBuyCarbonCredits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_interestRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_generosity",
        "type": "uint256"
      }
    ],
    "name": "withdrawalCalculator",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const deposit = (amount) => {
    // A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider((window as any).ethereum)

// The Metamask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner()
console.log(amount)

const climateWarriorsContract = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, signer);
const ClimateWarriorsPromise = climateWarriorsContract.deposit(1000000*amount);

ClimateWarriorsPromise.then(transaction => {
  console.log(transaction);
});

}

const withdraw = (amount) => {
  // A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider((window as any).ethereum)

// The Metamask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner()
console.log(amount);

const climateWarriorsContract = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, signer);
const ClimateWarriorsPromise = climateWarriorsContract.withdraw(1000000*amount);

ClimateWarriorsPromise.then(transaction => {
console.log(transaction);
});

}

const contractBalance = async () => {
  // A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider((window as any).ethereum)

// The Metamask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner()

const aUSDCcontract = new ethers.Contract(aUSDCaddress, aUSDCabi, signer);
const sendPromise11 = aUSDCcontract.balanceOf(climateWarriorsAddress);

const output = sendPromise11.then(transaction => {
  return transaction.toNumber() / Math.pow(10, 6)
});

const awaitOutput = await output

console.log(awaitOutput);

return awaitOutput
}

const approve = () => {
// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider((window as any).ethereum)

// The Metamask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner()

const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer);
const usdcContractPromise = usdcContract.approve(climateWarriorsAddress, MAX_UINT256);

usdcContractPromise.then(transaction => {
  console.log(transaction);
});

}

// Returns true or false depening if contract was approved or not
const alreadyApproved = () => {
  // A Web3Provider wraps a standard Web3 provider, which is
  // what Metamask injects as window.ethereum into each page
  const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  
  // The Metamask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner()

  const signerAddressPromise = signer.getAddress();

  const signerAddress = signerAddressPromise.then(sig => {
    return sig;
  });
  
  const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer);
  const usdcContractPromise = usdcContract.allowance(signerAddress, climateWarriorsAddress);
  
  const contractAllowance = usdcContractPromise.then(transaction => {
    return (transaction._hex)>0;
  });

  return contractAllowance;
  }