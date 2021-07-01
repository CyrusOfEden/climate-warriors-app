import { Image, ImageProps } from "@chakra-ui/react"
import React from "react"

export interface WatercolorFoliageProps extends Omit<ImageProps, "src"> {
  leafId: number
}

export const WatercolorFoliage: React.FC<WatercolorFoliageProps> = ({
  leafId,
  ...props
}) => (
  <Image src={`/illustrations/watercolor-foliage/${leafId}.png`} {...props} />
)
