import { useUser } from "@auth0/nextjs-auth0"
import { Box, Menu, Button, Image } from "grommet"
import * as Icons from "grommet-icons"

type menuItems = { label: string, onClick?: any, href?: string}

export default function UserCard() {
  const { user, error, isLoading } = useUser()
  let menuItems: menuItems[] = []
  let cardLabel

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user) {
    menuItems = [ { label: 'Settings' }, { label: 'Logout', href: "/api/auth/logout" }, ...menuItems ]
      if (user.picture && user.name) {
        cardLabel = (
          <span>
            <Image
              height={"25px"}
              width={"25px"}
              alt="User Avatar"
              src={user.picture}
            />{" " + user.name}
          </span>
        )
      } else {
        cardLabel = (
          <span><Icons.User />{" My Account"}</span>
        )
      }
    return (
      <Box
      align="center"
      direction="row"
      border={{ color: 'brand', size: 'large' }}
      pad="xsmall"
      >
        <Menu label={cardLabel} items={menuItems} />
      </Box>
    )
  }
  cardLabel = (<span><Icons.User />{" "}Log In / Sign Up</span>)
  
  return (
    <Box
      direction="row"
      border={{ color: 'brand', size: 'large' }}
      pad="small"
    >
      <Button
        label={cardLabel}
        href="/api/auth/login"
      />
    </Box>
  )
}