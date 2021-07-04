import { ArrowDownIcon, ArrowUpIcon, CloseIcon } from "@chakra-ui/icons"
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Spacer,
  Tag,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import React, { useRef } from "react"

import { ProgressStatCard } from "../components/ProgressStatCard"

export const Vault: React.FC = () => {
  return (
    <Container maxW="container.lg">
      <SimpleGrid columns={2} spacing={8}>
        <GlobalFundraiseProgress />
        <WalletDepositDetails />
      </SimpleGrid>
    </Container>
  )
}

const GlobalFundraiseProgress: React.FC = () => {
  const usdcStats = {
    title: "USDC Locked",
    id: "usdc",
    limit: 50000,
    value: 14421,
  }

  const mco2Stats = {
    title: "Tons CO2",
    id: "mco2",
    limit: 1000,
    value: 132,
  }

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
      <ProgressStatCard data={mco2Stats} />
      <Box backgroundColor="gray.100" height="2px" width="100%" rounded="lg" />
      <ProgressStatCard data={usdcStats} />
    </VStack>
  )
}

const WalletDepositDetails: React.FC = () => {
  const { isOpen: isDepositModelOpen, onToggle: toggleDepositModal } =
    useDisclosure()

  const { isOpen: isWithdrawModelOpen, onToggle: toggleWithdrawModal } =
    useDisclosure()

  return (
    <VStack
      align="start"
      justify="start"
      backgroundColor="white"
      borderColor="gray.100"
      borderWidth={1}
      boxShadow="inner"
      flex={1}
      p={8}
      rounded="lg"
      spacing={4}
    >
      <Heading color="green.800" size="lg">
        Your Deposit Rates
      </Heading>
      <HStack>
        <Tag colorScheme="green">0.0012 MCO2 / day</Tag>
        <Tag>0.1 USDC / day</Tag>
      </HStack>
      <Spacer maxH={2} />
      <Heading color="green.600" size="sm">
        Next quest:
      </Heading>
      <Alert status="warning" rounded="md" p={4}>
        <AlertIcon />
        Deposit 100 USDC
      </Alert>
      <Spacer maxH={2} />
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
        />
        <Button rightIcon={<ArrowDownIcon />} onClick={toggleWithdrawModal}>
          Withdraw
        </Button>
        <WithdrawModal
          isOpen={isWithdrawModelOpen}
          onClose={toggleWithdrawModal}
        />
      </HStack>
    </VStack>
  )
}

interface ActionModalProps
  extends Omit<AlertDialogProps, "leastDestructiveRef" | "children"> {}

const DepositModal: React.FC<ActionModalProps> = (props) => {
  const depositAmountRef = useRef(null)

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
              <NumberInput precision={2} step={10} flex={2} size="md">
                <NumberInputField
                  ref={depositAmountRef}
                  borderColor="gray.300"
                  _focus={{ borderColor: "green.500" }}
                />
                <NumberInputStepper
                  borderColor="gray.300"
                  _focus={{ borderColor: "green.500" }}
                >
                  <NumberIncrementStepper
                    borderColor="gray.300"
                    _focus={{ borderColor: "green.500" }}
                  />
                  <NumberDecrementStepper
                    borderColor="gray.300"
                    _focus={{ borderColor: "green.500" }}
                  />
                </NumberInputStepper>
              </NumberInput>
              <Button flex={1} colorScheme="green">
                Deposit
              </Button>
            </HStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

const WithdrawModal: React.FC<ActionModalProps> = (props) => {
  const cancelWithdrawRef = useRef(null)

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
              <NumberInput precision={2} step={10} flex={2} size="md">
                <NumberInputField
                  borderColor="gray.300"
                  _focus={{ borderColor: "green.500" }}
                />
                <NumberInputStepper
                  borderColor="gray.300"
                  _focus={{ borderColor: "green.500" }}
                >
                  <NumberIncrementStepper
                    borderColor="gray.300"
                    _focus={{ borderColor: "green.500" }}
                  />
                  <NumberDecrementStepper
                    borderColor="gray.300"
                    _focus={{ borderColor: "green.500" }}
                  />
                </NumberInputStepper>
              </NumberInput>
              <Button flex={1} colorScheme="purple">
                Withdraw
              </Button>
            </HStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
