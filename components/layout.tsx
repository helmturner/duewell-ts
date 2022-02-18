import { Grommet, Main, Box} from 'grommet'
import { ReactNode } from 'react'
import { GlobalProvider } from '../context/global'
import { PlaidProvider } from '../context/plaid'
import DefaultHeader from './header'

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <GlobalProvider>
      <PlaidProvider>
        <Grommet plain>
          <DefaultHeader />
          <Main>
            <Box width={"100%"} background="light-2">
              {children}
            </Box>
          </Main>
        </Grommet>
      </PlaidProvider>
    </GlobalProvider>
  )
}

export default Layout