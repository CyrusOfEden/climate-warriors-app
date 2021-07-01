import useUrlState from "@ahooksjs/use-url-state"
import { Box, HStack, Heading, Progress, Text, VStack } from "@chakra-ui/react"
import React from "react"
import Pluralize from "react-pluralize"

import { CharcoSketch } from "../components/CharcoSketch"
import { WatercolorFoliage } from "../components/WatercolorFoliage"

const goals = {
  defenders: 500,
  mco2: 5000,
}

const stats = {
  defenders: 176,
  usdc: 8193,
  mco2: 1076,
}

export const LandingPage: React.FC = () => {
  const [state] = useUrlState({ from: "" })

  return (
    <VStack align="initial" spacing={16}>
      {state.from && (
        <HStack align="center">
          <CharcoSketch name="wave hello" w={240} />
          <Box>
            <Heading size="lg" color="green.400" mb={4}>
              Hello!
            </Heading>
            <Heading size="md" color="green.800">
              You have been invited by
            </Heading>
            <Heading size="md" color="green.400">
              {state.from}
            </Heading>
          </Box>
        </HStack>
      )}
      <HStack justify="space-between">
        <Box p={8}>
          <Heading size="lg" color="green.800">
            Join the
          </Heading>
          <Heading size="2xl" as="h1" color="green.400">
            Climate Warriors
          </Heading>
          <Heading size="lg" color="green.800">
            to make money and
          </Heading>
          <Heading size="xl" color="green.400">
            defend the planet!
          </Heading>
        </Box>
        <CharcoSketch name="high five" w={280} />
      </HStack>
      <HStack justify="space-between">
        <WatercolorFoliage leafId={1} w={240} boxShadow="inner" rounded="lg" />
        <VStack align="initial" p={8}>
          <Heading color="green.800">Make Money</Heading>
          <Text fontSize="xl" color="gray.700">
            Lend on Climate Warriors to earn 3% APY
          </Text>
          <Text color="gray.500">
            We use AAVE, the largest and safest Decentralized Finance lending
            protocol.
          </Text>
        </VStack>
      </HStack>
      <HStack justify="space-between">
        <VStack align="initial" p={8}>
          <Heading color="green.800">Defend the Planet</Heading>
          <Text fontSize="xl" color="gray.700">
            Use those gains to purchase carbon credits.
          </Text>
          <Text color="gray.500">
            Carbon credits represent 1 ton of CO2 emissions. By holding carbon
            credits you prevent corporations from using them to offset their
            emissions.
          </Text>
        </VStack>
        <WatercolorFoliage leafId={24} w={240} boxShadow="inner" rounded="lg" />
      </HStack>
      <HStack justify="space-between">
        <WatercolorFoliage leafId={4} w={240} boxShadow="inner" rounded="lg" />
        <VStack align="initial" p={8}>
          <Heading color="green.800">Collect nifty collectibles</Heading>
          <Text fontSize="xl" color="gray.700">
            Every month we partner with a different cause to launch
            limited-edition NFTs.
          </Text>
        </VStack>
      </HStack>
      <Box mt={8}>
        <Heading size="md" color="green.400">
          This month's collectible:
        </Heading>
        <Heading size="lg" color="green.800">
          Amazon Defender
        </Heading>
      </Box>
      <VStack boxShadow="inner" rounded="md" p={8} bg="gray.50" align="initial">
        <Text fontSize="xl" color="gray.600">
          <strong>
            <Pluralize singular="Amazon Defender" count={stats.defenders} />
          </strong>{" "}
          have teamed up to
        </Text>
        <Heading size="md" color="green.800"></Heading>
        <Box>
          <Progress
            value={(stats.mco2 / goals.mco2) * 100}
            height="8"
            rounded="md"
            colorScheme="green"
            hasStripe
            isAnimated
          />
        </Box>
      </VStack>
    </VStack>
  )
}
