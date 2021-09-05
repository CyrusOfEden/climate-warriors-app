import { ethers } from "ethers";


import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons"
import {
  Link as Anchor,
  Box,
  Button,
  Collapse,
  Container,
  HStack,
  Heading,
  Tag,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import { useMount } from "ahooks"
import { useBoolean } from "ahooks"
import React, { useCallback } from "react"
import { useHistory } from "react-router-dom"
import Web3Modal from "web3modal"
import { Pace, Pause, WindupChildren } from "windups"

import { FadeLeftBox, FadeRightBox, FadeUpBox } from "../components/Motion"
import Sparkles from "../components/Sparkles"
import { WatercolorFoliage } from "../components/WatercolorFoliage"
import { useStepForm } from "../hooks/useStepForm"
import { scrollToBottom } from "../lib/browser"

export const HowItWorks: React.FC = () => {
  const { step, nextStep } = useStepForm(0, 3)

  return (
    <Container
      maxW="container.lg"
      backgroundColor="white"
      boxShadow="md"
      rounded="xl"
      p={16}
      pt={32}
    >
      <VStack align="initial" spacing={16}>
        <MakeMoney onFinished={nextStep} />
        {step > 0 && <DefendThePlanet onFinished={nextStep} />}
        {step > 1 && <CollectNifties onFinished={nextStep} />}
        {step > 2 && <ConnectWallet />}
      </VStack>
    </Container>
  )
}

interface Callback {
  onFinished: () => void
}

const MakeMoney: React.FC<Callback> = ({ onFinished }) => {
  const { isOpen, onToggle } = useDisclosure()
  const [showCTA, { setFalse: stopShowingCTA }] = useBoolean(true)

  useMount(scrollToBottom)

  return (
    <HStack justify="space-between" align="start">
      <FadeRightBox delay={0}>
        <WatercolorFoliage leafId={1} w={320} />
      </FadeRightBox>
      <FadeUpBox delay={0} y={20}>
        <VStack p={8}>
          <Heading color="green.800" textAlign="center">
            <Sparkles>Make Bank</Sparkles>
          </Heading>
          <WindupChildren>
            <Pause ms={1000} />
            <Pace ms={60}>
              <Text fontSize="xl" color="gray.700">
                <Tag
                  colorScheme="green"
                  fontWeight="bold"
                  rounded="md"
                  size="lg"
                  px={2}
                >
                  Climate Warriors
                </Tag>{" "}
                earn 3% APY on their USDC.
              </Text>
            </Pace>
          </WindupChildren>
          <FadeUpBox delay={3} y={20}>
            <VStack mt={4}>
              <Text color="gray.500" textAlign="center">
                Lend your USDC using the most secure lending protocol in all of
                DeFi.
              </Text>
              <Button size="xs" onClick={onToggle}>
                {isOpen ? "Close" : "Learn more about Aave"}
              </Button>
              <Collapse in={isOpen}>
                <Box bg="gray.50" p={4} rounded="md" maxW="md">
                  <Text color="gray.500" textAlign="left">
                    As the largest lending protocol in decentralized finance,
                    AAVE secures more than $18B in crypto-assets. AAVE has never
                    had an incident. For more information, check out the{" "}
                    <Anchor
                      href="https://aave.com"
                      target="_blank"
                      textDecoration="underline"
                    >
                      AAVE Website
                      <ExternalLinkIcon mx={1} />
                    </Anchor>
                    .
                  </Text>
                </Box>
              </Collapse>
            </VStack>
          </FadeUpBox>
          {showCTA && (
            <FadeUpBox delay={6} y={20}>
              <Button
                colorScheme="green"
                onClick={() => {
                  stopShowingCTA()
                  onFinished()
                }}
                mt={4}
              >
                Give me free money!
              </Button>
            </FadeUpBox>
          )}
        </VStack>
      </FadeUpBox>
    </HStack>
  )
}

const DefendThePlanet: React.FC<Callback> = ({ onFinished }) => {
  const { isOpen, onToggle } = useDisclosure()
  useDisclosure()
  const [showCTA, { setFalse: stopShowingCTA }] = useBoolean(true)

  useMount(scrollToBottom)

  return (
    <HStack justify="space-around" align="start">
      <VStack p={8} maxW="lg">
        <FadeUpBox delay={0} y={20}>
          <Heading color="green.800" textAlign="center" mb={2}>
            <Sparkles>Protect The Amazon</Sparkles>
          </Heading>
          <WindupChildren>
            <Pause ms={2000} />
            <Text fontSize="xl" color="gray.700" textAlign="center">
              <Pace ms={40}>
                Donate some of your interest towards REDD+ conservation projects
                in the <strong>Amazon Rainforest</strong>.
              </Pace>
            </Text>
          </WindupChildren>

          <FadeUpBox delay={4} y={20}>
            <VStack mt={4}>
              <Text color="gray.500" textAlign="center">
                At the end of the fundraiser all collected funds will be used to
                purchase MCO2 tokens.{" "}
              </Text>
              <Button size="xs" onClick={onToggle}>
                {isOpen ? "Close MCO2" : "MCO2 Tokens"}
              </Button>
              <Collapse in={isOpen}>
                <Box bg="gray.50" p={4} rounded="md">
                  <Text color="gray.500" textAlign="left">
                    MCO2 tokens are sourced from several certified projects from
                    the Amazon Rainforest. Each MCO2 represents 1 ton of CO2
                    captured from the atmosphere. For more details, please see
                    the{" "}
                    <Anchor
                      href="https://moss.earth"
                      target="_blank"
                      textDecoration="underline"
                    >
                      Moss Website
                      <ExternalLinkIcon mx={1} />
                    </Anchor>
                    .
                  </Text>
                </Box>
              </Collapse>
              {showCTA && (
                <FadeUpBox delay={6} y={20}>
                  <Button
                    colorScheme="green"
                    mt={4}
                    onClick={() => {
                      stopShowingCTA()
                      onFinished()
                    }}
                  >
                    I want to be an Amazon Defender!
                  </Button>
                </FadeUpBox>
              )}
            </VStack>
          </FadeUpBox>
        </FadeUpBox>
      </VStack>
      <FadeLeftBox delay={0} x={20}>
        <WatercolorFoliage leafId={24} w={360} />
      </FadeLeftBox>
    </HStack>
  )
}

const CollectNifties: React.FC<Callback> = ({ onFinished }) => {
  const { isOpen, onToggle } = useDisclosure()
  const [showCTA, { setFalse: stopShowingCTA }] = useBoolean(true)

  useMount(scrollToBottom)

  return (
    <HStack justify="center">
      <FadeLeftBox delay={0} x={-20}>
        <WatercolorFoliage leafId={4} w={240} />
      </FadeLeftBox>
      <FadeUpBox delay={0} y={20}>
        <VStack p={12}>
          <Heading color="green.800" textAlign="center">
            <Sparkles>Collect nifties</Sparkles>
          </Heading>
          <FadeUpBox delay={0} y={10}>
            <VStack>
              <Text fontSize="xl" color="gray.700" textAlign="center">
                Earn exclusive NFTs from project partners as you save money.
              </Text>
              <Button size="xs" onClick={onToggle}>
                {isOpen ? "Close" : "Contest Details"}
              </Button>

              <Collapse in={isOpen}>
                <Box bg="gray.50" p={4} rounded="md" w="sm">
                  <Text color="gray.500" textAlign="left">
                    Snapshots from when we hit funding goals of 250, 500, and
                    1000 MCO2 tokens will be used to determine eligibility.
                  </Text>
                </Box>
              </Collapse>
            </VStack>
          </FadeUpBox>
          {showCTA && (
            <FadeUpBox delay={0} y={20}>
              <Button
                colorScheme="green"
                mt={4}
                onClick={() => {
                  stopShowingCTA()
                  onFinished()
                }}
              >
                Take my money already!
              </Button>
            </FadeUpBox>
          )}
        </VStack>
      </FadeUpBox>
    </HStack>
  )
}

const ConnectWallet: React.FC = () => {
  const history = useHistory()

  const connectWallet = useCallback(async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions: {}, // required
    })
    const provider = await web3Modal.connect()
    debugger
    history.push("/vault")
  }, [history])

  useMount(scrollToBottom)

  return (
    <VStack py={32}>
      <FadeUpBox delay={0}>
        <Button
          as={Link}
          to="/"
          onClick={connectWallet}
          colorScheme="green"
          size="lg"
          rightIcon={<ArrowForwardIcon />}
          _hover={{ textDecoration: "none" }}
        >
          Go to the main page
        </Button>
      </FadeUpBox>
    </VStack>
  )
}


export const HowItWorks: React.FC = () => {
  const { step, nextStep } = useStepForm(0, 3)

  return (
    <Container
      maxW="container.lg"
      backgroundColor="white"
      boxShadow="md"
      rounded="xl"
      p={16}
      pt={32}
    >
      <VStack align="initial" spacing={16}>
        <MakeMoney onFinished={nextStep} />
        {step > 0 && <DefendThePlanet onFinished={nextStep} />}
        {step > 1 && <CollectNifties onFinished={nextStep} />}
        {step > 2 && <NextStep />}
      </VStack>
    </Container>
  )
}
