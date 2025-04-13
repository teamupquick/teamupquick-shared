import { styled } from "@mui/material"
import { ReactNode } from "react"
import { LinkProps, Link as RouterLink } from "react-router-dom"

interface Props extends LinkProps {
  onClick?: VoidFunction
  children: ReactNode
}

const StyledLink = styled(RouterLink)({
  color: "#3B3839 !important",
  textDecoration: "none",
  fontWeight: 700,
  "&:hover": {
    fontWeight: 500,
  },
})

export default function Link({ to, onClick, children, ...props }: Props) {
  return (
    <StyledLink to={to} onClick={onClick} {...props}>
      {children}
    </StyledLink>
  )
}
