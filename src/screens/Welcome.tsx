import useUrlState from "@ahooksjs/use-url-state"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
  Button,
  Container,
  HStack,
  Heading,
  VStack,
  useBoolean,
  useTimeout,
} from "@chakra-ui/react"
import { useMount } from "ahooks"
import React from "react"
import { Link } from "react-router-dom"
import { Pace, Pause, WindupChildren } from "windups"

import { CharcoSketch } from "../components/CharcoSketch"
import { FadeUpBox } from "../components/Motion"
import Sparkles from "../components/Sparkles"
import { useStepForm } from "../hooks/useStepForm"
import { scrollToBottom } from "../lib/browser"

export const Welcome: React.FC = () => {
  const [state] = useUrlState({ from: "" })

  const { step, nextStep } = useStepForm(state.from === "" ? 1 : 0, 2)

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
        {state.from && <Greeting name={state.from} onFinished={nextStep} />}
        {step > 0 && <LeadSection onFinished={nextStep} />}
        {step > 1 && <NextStep />}
      </VStack>
    </Container>
  )
}

interface GreetingProps {
  name: string
  onFinished: () => void
}

const Greeting: React.FC<GreetingProps> = ({ name, onFinished }) => {
  const [sparkles, { off: disableSparkles }] = useBoolean(true)
  useTimeout(disableSparkles, 5000) // chill out

  return (
    <VStack align="center" justify="center">
      <FadeUpBox delay={0}>
        <CharcoSketch name="wave hello" w={240} />
      </FadeUpBox>
      <FadeUpBox delay={0.5}>
        <WindupChildren onFinished={onFinished}>
          <Pause ms={500} />
          <Pace ms={100}>
            <Heading
              size="md"
              color="green.800"
              fontWeight="normal"
              textAlign="center"
            >
              Hello! <Pause ms={1000} /> You have been invited by:
            </Heading>
          </Pace>
          <Pause ms={1250} />
          <Pace ms={50}>
            <Heading
              size="lg"
              color="green.400"
              fontWeight="bold"
              textAlign="center"
            >
              <Sparkles enabled={sparkles}>{name}</Sparkles>
            </Heading>
          </Pace>
          <Pause ms={1000} />
        </WindupChildren>
      </FadeUpBox>
    </VStack>
  )
}

const LeadSection: React.FC<{ onFinished: () => void }> = ({ onFinished }) => {
  useMount(scrollToBottom)

  // Manually update this timeout! When you adjust the animations below
  useTimeout(onFinished, 4 * 1000)

  return (
    <HStack justify="center">
      <VStack>
        <FadeUpBox delay={0}>
          <Heading size="lg" color="green.800">
            Join the
          </Heading>
        </FadeUpBox>
        <FadeUpBox delay={0.5}>
          <Heading size="2xl" as="h1" color="green.400">
            Climate Warriors
          </Heading>
        </FadeUpBox>
        <FadeUpBox delay={0.75}>
          <Heading size="lg" color="green.800">
            to <Sparkles>make money</Sparkles> and
          </Heading>
        </FadeUpBox>
        <FadeUpBox delay={1}>
          <Heading size="xl" color="green.400">
            defend the planet!
          </Heading>
        </FadeUpBox>
      </VStack>
      <FadeUpBox delay={1.5}>
        <CharcoSketch name="high five" w={280} />
      </FadeUpBox>
    </HStack>
  )
}

const NextStep: React.FC = () => {
  useMount(scrollToBottom)

  return (
    <VStack py={12}>
      <FadeUpBox delay={1}>
        <Button
          size="lg"
          rightIcon={<ArrowForwardIcon />}
          as={Link}
          to="/how-it-works"
          colorScheme="green"
          _hover={{ textDecoration: "none" }}
        >
          How it works
        </Button>
      </FadeUpBox>
    </VStack>
  )
}
