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
import React from "react"
import { Link } from "react-router-dom"
import { Pace, Pause, WindupChildren } from "windups"

import { FadeLeftBox, FadeRightBox, FadeUpBox } from "../components/Motion"
import Sparkles from "../components/Sparkles"
import { WatercolorFoliage } from "../components/WatercolorFoliage"
import { useStepForm } from "../hooks/useStepForm"
import { scrollToBottom } from "../lib/browser"

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
                We lend your USDC using AAVE — a decentralized lending protocol
                — to earn interest.{" "}
              </Text>
              <Button size="xs" onClick={onToggle}>
                {isOpen ? "Alright" : "AAVE?"}
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
                {isOpen ? "OK, got it" : "Learn More"}
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
          <FadeUpBox delay={0.5} y={10}>
            <Text fontSize="xl" color="gray.700" textAlign="center">
              Earn exclusive NFTs from project partners as you save money.
            </Text>
          </FadeUpBox>
          {showCTA && (
            <FadeUpBox delay={3} y={20}>
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

const NextStep: React.FC = () => {
  useMount(scrollToBottom)

  return (
    <VStack py={32}>
      <FadeUpBox delay={0}>
        <Button
          as={Link}
          to="/vault"
          colorScheme="green"
          size="lg"
          rightIcon={<ArrowForwardIcon />}
          _hover={{ textDecoration: "none" }}
        >
          Connect Wallet
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
