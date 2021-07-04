import { Box, Flex, FlexProps, Progress, Stack, Text } from "@chakra-ui/react"
import * as React from "react"

export interface StatCardData {
  id: string
  title: string
  limit: number
  value: number
  formattedData?: {
    value: string
    limit: string
  }
}

export interface ProgressStatCardProps extends FlexProps {
  data: StatCardData
}

export const ProgressStatCard: React.FC<ProgressStatCardProps> = ({
  data,
  ...rest
}) => {
  const { id, title, limit, value, formattedData } = data

  const _value = formattedData?.value ?? value
  const _limit = formattedData?.limit ?? limit

  return (
    <Flex direction="column" overflow="hidden" w="100%" {...rest}>
      <Box id={id} srOnly>
        {value} out of {limit} {title} used
      </Box>
      <Box flex="1" as="dl" color="gray.500" mb={4}>
        <Text as="dt" fontSize="sm" fontWeight="medium">
          {title}
        </Text>
        <Stack
          direction="row"
          as="dd"
          mt="2"
          align="flex-end"
          textTransform="uppercase"
        >
          <Box
            fontSize="2xl"
            as="span"
            fontWeight="bold"
            color="gray.800"
            lineHeight="1"
          >
            {_value}
          </Box>
          <Flex fontWeight="semibold">
            <Box as="span" aria-hidden>
              /
            </Box>
            <Box srOnly>out of</Box>
            <Text ps="1">{_limit}</Text>
          </Flex>
        </Stack>
      </Box>
      <Progress
        aria-labelledby={id}
        value={value}
        max={limit}
        min={0}
        size="lg"
        colorScheme="green"
        rounded="lg"
        isAnimated
        hasStripe
      />
    </Flex>
  )
}
