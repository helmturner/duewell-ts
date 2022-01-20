import { useSession, signIn, signOut } from "next-auth/react"
import { Box, Menu, Button, Image } from "grommet"
import * as Icons from "grommet-icons"

type menuItems = { label: string, onClick?: any}

export default function UserCard() {
  const { data: session, status } = useSession()
  let menuItems: menuItems[] = []
  let cardLabel

  if (status === "authenticated") {
      menuItems = [ { label: 'Settings' }, { label: 'Logout', onClick: () => signOut() }, ...menuItems ]
      if (session?.user?.image && session?.user?.name) {
        cardLabel = (
          <span>
            {console.log(session.user)}
            <Image
              height={"25px"}
              width={"25px"}
              alt="User Avatar"
              src={session.user.image}
            />{" " + session.user.name}
          </span>)
      } else cardLabel = (<span><Icons.User />{" My Account"}</span>)
  
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
        onClick={() => signIn()}
      />
    </Box>
  )
}