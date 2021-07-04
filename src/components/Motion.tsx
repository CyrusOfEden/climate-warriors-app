import {
  BoxProps,
  Box as ChakraBox,
  Flex as ChakraFlex,
  HStack as ChakraHStack,
  Heading as ChakraHeading,
  SimpleGrid as ChakraSimpleGrid,
  Stack as ChakraStack,
  Text as ChakraText,
  VStack as ChakraVStack,
  FlexProps,
  HeadingProps,
  SimpleGridProps,
  StackProps,
  TextProps,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import React from "react"

export const Box = motion<BoxProps>(ChakraBox)
export const Flex = motion<FlexProps>(ChakraFlex)
export const Heading = motion<HeadingProps>(ChakraHeading)
export const HStack = motion<StackProps>(ChakraHStack)
export const SimpleGrid = motion<SimpleGridProps>(ChakraSimpleGrid)
export const Stack = motion<StackProps>(ChakraStack)
export const Text = motion<TextProps>(ChakraText)
export const VStack = motion<StackProps>(ChakraVStack)

interface VerticalFadeBoxProps {
  delay: number
  y?: number
}

export const FadeUpBox: React.FC<VerticalFadeBoxProps> = ({
  y = 50,
  delay,
  children,
}) => (
  <Box
    initial="mount"
    animate="enter"
    variants={{
      mount: {
        opacity: 0,
        y,
      },
      enter: {
        opacity: 1,
        y: 0,
        transition: {
          delay,
          type: "spring",
        },
      },
    }}
  >
    {children}
  </Box>
)

interface HorizontalFadeBoxProps {
  delay: number
  x?: number
}

export const FadeRightBox: React.FC<HorizontalFadeBoxProps> = ({
  x = -50,
  children,
  delay,
}) => (
  <Box
    initial="mount"
    animate="enter"
    variants={{
      mount: {
        opacity: 0,
        x,
      },
      enter: {
        opacity: 1,
        x: 0,
        transition: {
          delay,
          type: "spring",
        },
      },
    }}
  >
    {children}
  </Box>
)

export const FadeLeftBox: React.FC<HorizontalFadeBoxProps> = ({
  x = 50,
  children,
  delay,
}) => (
  <Box
    initial="mount"
    animate="enter"
    variants={{
      mount: {
        opacity: 0,
        x,
      },
      enter: {
        opacity: 1,
        x: 0,
        transition: {
          delay,
          type: "spring",
        },
      },
    }}
  >
    {children}
  </Box>
)
