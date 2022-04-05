import { Header, Button, Nav, Spinner } from "grommet"
import { Home } from 'grommet-icons'
import { UserProfile, useUser } from "@auth0/nextjs-auth0"
import Link from 'next/link'

type PlaidItem = {
    item_id: string,
    access_token: string,
    request_id: string,
}

interface UserWithAppMeta extends UserProfile {
    app_metadata: {
        plaid_items: PlaidItem[]
    }
}

export const DefaultHeader = () => {
    const { user, error, isLoading } = useUser();
    let button = isLoading ? <Spinner />
        : user ? <Button href="api/auth/logout" label="Logout" hoverIndicator />
        : <Button href="api/auth/login" label="Login / Signup" hoverIndicator />

    if (error) console.log(error);

    return (
        <Header justify="between" margin="none" background="brand">
            <Link href='/' passHref={true}>
                <Button icon={<Home />} hoverIndicator />
            </Link>
            <Nav direction={'column'} background={'brand'} pad={'medium'} flex={true}>
                <Link href='/dashboard' passHref={true}>
                    <Button>Dashboard</Button>
                </Link>
            </Nav>
            {button}
        </Header>
    )
}