import {
  Grommet,
  Main,
  ResponsiveContext,
  Header,
  Button,
  Nav,
  Spinner,
} from "grommet";
import { ReactNode, useContext } from "react";
import { Home } from "grommet-icons";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

const DefaultHeader = () => {
  const { user, error, isLoading } = useUser();
  let button = isLoading ? (
    <Spinner />
  ) : user ? (
    <Button href="/api/auth/logout" label="Logout" hoverIndicator />
  ) : (
    <Button href="/api/auth/login" label="Login / Signup" hoverIndicator />
  );

  if (error) console.log(error);

  return (
    <Header justify="between" margin="none" background="brand">
      <Link href="/" passHref={true}>
        <Button icon={<Home />} hoverIndicator />
      </Link>
      <Nav direction={"column"} background={"brand"} pad={"medium"} flex={true}>
        <Link href="/dashboard" passHref={true}>
          <Button>Dashboard</Button>
        </Link>
      </Nav>
      {button}
    </Header>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  const size = useContext(ResponsiveContext);
  return (
    <Grommet plain>
      <DefaultHeader />
      <Main>{children}</Main>
      {/*       <DefaultFooter />*/}
    </Grommet>
  );
};

export default Layout;
