import React from "react"
import styled from "@emotion/styled"
import entypo from "./entypo.svg"

export const Icon = styled(({ name, ...props }) => (
  <svg {...props}>
    <use xlinkHref={`${entypo}#entypo-${name}`} />
  </svg>
))`
  width: 2.4rem;
  height: 2.4rem;
`
