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
import React, { useRef, useState, useEffect } from "react"
import useWeb3Modal from "../hooks/useWeb3Modal";
import { ProgressStatCard } from "../components/ProgressStatCard"
import { aUSDCabi } from "../ABIs/aUSDCabi";
import { usdcAbi } from "../ABIs/USDCabi";
import { climateWarriorsAbi } from "../ABIs/climateWarriorsAbi";

//////////////////// THE GRAPH QUERY ////////////////////

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const APIURL = "https://api.studio.thegraph.com/query/131/cliwa/v0.0.0.7";

const depositQuery = `
query{
      depositEvs {
         id
         count
         _amount
      }
   } 
`

const withdrawFundingQuery = `
query($fromAddr: Bytes!) {
   withdrawEvs{
      id
      count
      _amount
      _earned
   }
   fundingEvs(where: {_from: $fromAddr }) {
   id
   count
   _from
   _donated
   }
}
`

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache()
});

client.query({
  query: gql(depositQuery)
})
.then(data => {
   console.log(data.data.depositEvs[0].id," deposited ", data.data.depositEvs[0]._amount / Math.pow(10, 6), " USDC.")})
.catch(err => { console.log("Error fetching data: ", err) });

const addr = "0xeCbecC9ACe13cbbA6a586e1F2d171619baFdAA1b"

client.query({
   query: gql(withdrawFundingQuery),
   variables: {
    fromAddr: addr
  }
 })
 .then(data => 
    console.log("DATA: ", data))
 .catch(err => { console.log("Error fetching data: ", err) });
 ////////////////////////////////////////////////////////////

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
   return (
     <Button 
       onClick={() => {
         if (!provider) {
           loadWeb3Modal();
         } else {
           logoutOfWeb3Modal();
         }
       }}
     >
       {!provider ? "Connect Wallet" : "Disconnect Wallet"}
     </Button>
   );
 }

interface VaultState {
   global: any
   wallet: any
}

export const Vault: React.FC = () => {
   // Similar to componentDidMount and componentDidUpdate:
   const [state, setState] = useSetState<VaultState>({
      wallet: {
         yusdc: {
            title: "Your USDC Locked",
            id: "yusdc",
            limit: 100000,
            value: 0,
         },
         ydonated: {
            title: "Your donated USDC",
            id: "yusdc",
            limit: 10000,
            value: 0,
         },
      },
      global: {
         usdc: {
            title: "Total USDC Locked",
            id: "usdc",
            limit: 100000,
            value: 0,
         },
         mco2: {
            title: "Tons CO2",
            id: "mco2",
            limit: 25,
            value: 0,
         },
         donated: {
            title: "USDC donated",
            id: "usdcDonated",
            limit: 100,
            value: 0,
         },
      },
   })

   const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

   console.log("provider: ", provider);
   // console.log("OBJECT?: ", typeof provider);
   
   const updateBalDon = async () => {
      let totDon = 0;
      let result = await contractBalance();
      // console.log("result after deposit: ", result);
      setState((state) => ({
         ...state,
         global: {
            ...state.global, usdc: {...state.global.usdc, value: result}
         },
      }
      ))

      // console.log(state.global, state.global.donated);
      
      let usdcDonated = await donatedBalance();
      setState((state) => ({
         ...state,
         global: {
            ...state.global, donated: {...state.global.donated, value: usdcDonated}
         },
      }
      ))

      let ywBal = await checkUserAccount();
      setState((state) => ({
         ...state,
         wallet: {
            ...state.wallet, yusdc: {...state.wallet.yusdc, value: ywBal}
         },
      }
      ))
      
      let conAddr = await getConnectedAddress()
      console.log("connectedAddress: ", conAddr)
      

      client.query({
         query: gql(withdrawFundingQuery),
         variables: {
          fromAddr: String(conAddr)
        }
       })
       .then(data => 
         {  console.log("Subgraph data: ", data)

            let numbOfDon = data.data.fundingEvs.length;
            console.log("numbOfDon", numbOfDon);
            
            if(numbOfDon>0){
            for (let i = 0; i < numbOfDon; i++) {
               console.log("IN THE LOOP ",data.data.fundingEvs[i]._donated / Math.pow(10, 6));
               totDon += data.data.fundingEvs[i]._donated / Math.pow(10, 6)
            }
            console.log("You donated ", totDon, " USDC");
            setState((state) => ({
            ...state,
            wallet: {
               ...state.wallet, ydonated: {...state.wallet.donated, value: totDon}
            },
         }
         ))
       }
      }
         )
       .catch(err => { console.log("Error fetching data: ", err) });
   }


   useEffect(() => {
      // Update the document title using the browser API
      // console.log("HI");
      
      if(typeof provider === "object") { ///////////!!!!!!!!!!!!!!!!!!! SOMETHING WRONG HERE !!!!!!!!!!!!!!///////////////
      // console.log(provider._network.chainId);
      
      var handle = setInterval(()=> {
         // console.log("UseEffect() in Vault");
         updateBalDon()
      }, 10000);

      return () => {
         clearInterval(handle);
      }
      
   }
   });

   // console.log(state)

   return (
      <Container maxW="container.lg">
         <Heading>
            <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
         </Heading>
         <SimpleGrid columns={2} spacing={8}>
            <GlobalFundraiseProgress {...state} />
            <DepositActions globalState={state} setState={setState} provider={provider}/>
         </SimpleGrid>
      </Container>
   )
}

const GlobalFundraiseProgress: React.FC<any> = ({

   

   global: { mco2, usdc, donated },
   wallet: { yusdc, ydonated },
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
            Climate Warriors
         </Heading>
         <ProgressStatCard data={usdc} boost={0} />
         <Box backgroundColor="gray.100" height="2px" width="100%" rounded="lg" />
         <ProgressStatCard data={donated} boost={0} />
         <Box backgroundColor="gray.100" height="2px" width="100%" rounded="lg" />
         <ProgressStatCard data={yusdc} boost={0}/>
         <Box backgroundColor="gray.100" height="2px" width="100%" rounded="lg" />
         <ProgressStatCard data={ydonated} boost={0} />
         <Box backgroundColor="gray.100" height="2px" width="100%" rounded="lg" />
         <ProgressStatCard data={mco2} boost={0} />
      </VStack>
   )
}

const DepositActions: React.FC<any> = ({ globalState, setState, provider }) => {
   
   const { isOpen: isDepositModelOpen, onToggle: toggleDepositModal } =
      useDisclosure()

   const { isOpen: isWithdrawModelOpen, onToggle: toggleWithdrawModal } =
      useDisclosure()


   const [shouldShow, setShouldShow] = useState(true);
   
   async function alrAppr () {
      let result = await alreadyApproved();
      // console.log(result);
      if (result) {
         setShouldShow(false)
      }
   }

   useEffect(() => {
      // console.log(typeof provider === "object");
      
      if(typeof provider === "object") {   
      alrAppr()
      }
   })

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
         {globalState.global.donated.value < 100 && (
            <>
               <Spacer maxH={2} />
               <Heading color="green.600" size="sm">
                  Community quest:
               </Heading>
               <Alert status="warning" rounded="md" p={4}>
                  <AlertIcon />
                  Donate 100 USDC
               </Alert>
            </>
         )}
         {globalState.global.donated.value > 100 && (
            <>
               <Spacer maxH={2} />
               <Heading color="green.600" size="sm">
                  Community quest:
               </Heading>
               <Alert status="success" rounded="md" p={4}>
                  <AlertIcon />
                  100 USDC were donated!
               </Alert>
            </>
         )}
         { globalState.wallet.ydonated.value > 100 && (
            <>
            <Spacer maxH={2} />
            <Alert status="success" rounded="md" p={4}>
                  <AlertIcon />
                  You donated more than 100 USDC!
               </Alert>
               <Button
               colorScheme="green"
            >
               Claim your Climate Warrior Badge!
            </Button>
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
                  onClick={async () => {
                     let result = await alreadyApproved();
                     // console.log(result);
                     if (result) {
                        setShouldShow(false)
                     }
                     else {
                        approve()
                     }
                  }}
               >
                  Approve USDC
               </Button>
            ) : null}

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

   const updateBalDon = async () => {
      let result = await contractBalance();
      // console.log("result after deposit: ", result);
      setState((state) => ({
         ...state,
         global: {
            ...state.global, usdc: {...state.global.usdc, value: result}
         },
      }
      ))
      let usdcDonated = await donatedBalance();
      setState((state) => ({
         ...state,
         global: {
            ...state.global, donated: {...state.global.donated, value: usdcDonated}
         },
      }
      ))
   }

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
                        onClick={async () => {
                           const tx = await deposit(amount)
                           console.log(tx);
                           // alert("See transaction on polygonscan".link("https://www.mumbai.polygonscan.com/tx/"+ String(await tx)));
                           // Open a Modal to see transaction hash?
                           // console.log("Deposit");
                           updateBalDon()
                           props.onClose()
                           // console.log("Close");
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
                     Select how much you want to donate (10-100%)
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
                        props.onClose()
                     }} >
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
const usdcAddress = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e";
const climateWarriorsAddress = "0xbce2126BC4Bd8e1Ac96Bbd39F8558B129ddadf06";
const aUSDCaddress = "0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9";
// constant
const MAX_UINT256 = ethers.constants.MaxUint256;
// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)

const deposit = (amount) => {
   // A Web3Provider wraps a standard Web3 provider, which is
   // what Metamask injects as window.ethereum into each page
   const provider = new ethers.providers.Web3Provider((window as any).ethereum)

   // The Metamask plugin also allows signing transactions to
   // send ether and pay to change state within the blockchain.
   // For this, you need the account signer...
   const signer = provider.getSigner()
   // console.log(amount)

   const climateWarriorsContract = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, signer);
   const ClimateWarriorsPromise = climateWarriorsContract.deposit(1000000 * amount);
   
   return ClimateWarriorsPromise
}

const withdraw = (amount) => {
   // A Web3Provider wraps a standard Web3 provider, which is
   // what Metamask injects as window.ethereum into each page
   const provider = new ethers.providers.Web3Provider((window as any).ethereum)

   // The Metamask plugin also allows signing transactions to
   // send ether and pay to change state within the blockchain.
   // For this, you need the account signer...
   const signer = provider.getSigner()
   // console.log(amount);
   const climateWarriorsContract = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, signer);
   const ClimateWarriorsPromise = climateWarriorsContract.withdraw(amount);
   // console.log(ClimateWarriorsPromise);

   ClimateWarriorsPromise.then(transaction => {
      // console.log(transaction);
      
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

   // console.log("contractBalance: ",awaitOutput);

   return awaitOutput
}

const donatedBalance = async () => {
   // A Web3Provider wraps a standard Web3 provider, which is
   // what Metamask injects as window.ethereum into each page
   const provider = new ethers.providers.Web3Provider((window as any).ethereum)

   // The Metamask plugin also allows signing transactions to
   // send ether and pay to change state within the blockchain.
   // For this, you need the account signer...
   const signer = provider.getSigner()

   const USDCcontract = new ethers.Contract(usdcAddress, usdcAbi, signer);
   const sendPromise11 = USDCcontract.balanceOf(climateWarriorsAddress);

   const output = sendPromise11.then(transaction => {
      return transaction.toNumber() / Math.pow(10, 6)
   });

   const awaitOutput = await output

   // console.log("donatedBalance: ",awaitOutput);

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
   // console.log("signer: ", signer);
   
   const signerAddressPromise = signer.getAddress();

   // console.log("signerAddressPromise: ", signerAddressPromise);

   const signerAddress = signerAddressPromise.then(sig => {
      // console.log(sig);
      return sig;
   });

   const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer);
   const usdcContractPromise = usdcContract.allowance(signerAddress, climateWarriorsAddress);

   const contractAllowance = usdcContractPromise.then(transaction => {
      // console.log((transaction._hex) > 0);

      return (transaction._hex) > 0;
   });

   return contractAllowance;
}

const checkUserAccount = async () => {
   // A Web3Provider wraps a standard Web3 provider, which is
   // what Metamask injects as window.ethereum into each page
   const provider = new ethers.providers.Web3Provider((window as any).ethereum)

   // The Metamask plugin also allows signing transactions to
   // send ether and pay to change state within the blockchain.
   // For this, you need the account signer...
   const signer = provider.getSigner()

   const climateWarriorsContract = new ethers.Contract(climateWarriorsAddress, climateWarriorsAbi, signer);
   const result = await climateWarriorsContract.checkAccount();

   // console.log("checkUserAccount: ",result[1].toNumber()/ Math.pow(10, 6));

   return result[1].toNumber() / Math.pow(10, 6)
}


const getConnectedAddress = async () => {
   // A Web3Provider wraps a standard Web3 provider, which is
   // what Metamask injects as window.ethereum into each page
   const provider = new ethers.providers.Web3Provider((window as any).ethereum)

   // The Metamask plugin also allows signing transactions to
   // send ether and pay to change state within the blockchain.
   // For this, you need the account signer...
   const signer = provider.getSigner()

   const connectedAddress = await signer.getAddress()

   return connectedAddress
}