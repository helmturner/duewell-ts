import { Button, Footer, Grommet, Header, Main, Menu } from 'grommet'
import { ReactNode } from 'react'
import * as Icons from 'grommet-icons'
import UserCard from './usercard'

export default function Layout({ children }: {children: ReactNode}) {
  return (
    <Grommet plain>
        <Header background="brand">
            <Button icon={<Icons.Home />} hoverIndicator />
            <UserCard />
        </Header>
        <Main>{children}</Main>
      <Footer />
    </Grommet>
  )
} 