import { Header, Button, Nav } from "grommet"
import { Home } from 'grommet-icons'

const DefaultHeader = () => (
    <Header justify="between" margin="none" background="brand">
        <Button href='/' icon={<Home />} hoverIndicator />
        <Nav direction={'column'} background={'brand'} pad={'medium'} flex={true}>
            <Button href="dashboard">Dashboard</Button>
        </Nav>
    </Header>)

export default DefaultHeader