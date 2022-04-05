import { Grommet, Main, ResponsiveContext } from "grommet";
import { ReactNode, useContext } from "react";
import {DefaultHeader, /* DefaultFooter */} from "components";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const size = useContext(ResponsiveContext)
  return (
    <Grommet plain>
      <DefaultHeader />
      <Main>{children}</Main>
{/*       <DefaultFooter />*/}
    </Grommet>
  );
};

export default Layout;
