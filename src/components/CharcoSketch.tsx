import { Image, ImageProps } from "@chakra-ui/react"
import React from "react"

export interface CharcoSketchProps extends Omit<ImageProps, "src"> {
  name: string
}

export const CharcoSketch: React.FC<CharcoSketchProps> = ({
  name,
  ...props
}) => <Image src={`/illustrations/charco-sketches/${name}.png`} {...props} />
