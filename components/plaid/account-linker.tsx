import { Button } from "grommet";
import { useCallback, useContext } from "react";
import { PlaidLinkOptionsWithLinkToken, usePlaidLink } from "react-plaid-link";
import PlaidContext from "../../context/plaid"
import GlobalContext from "../../context/global"

const AccountLinker = ()=> {
  const { linkToken, dispatch } = useContext(PlaidContext)
  const { apiBase } = useContext(GlobalContext)

  const onSuccess = useCallback((public_token: string) => {
    const setToken = async () => {
      const response = await fetch(`${apiBase}/plaid/set_access_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `public_token=${public_token}`,
      });
      console.log(response)
      if (!response.ok) {
        dispatch({
          type: "SET_STATE",
          state: {
            itemId: `no item_id retrieved`,
            accessToken: `no access_token retrieved`,
            isItemAccess: false,
          },
        });
        return;
      }

      const data = await response.json();

      dispatch({
        type: "SET_STATE",
        state: {
          itemId: data.item_id,
          accessToken: data.access_token,
          isItemAccess: true,
        },
      });
      return;
    };

    setToken();
    dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
    window.history.pushState("", "", "/");
    return;
  }, [apiBase, dispatch])

  const config: PlaidLinkOptionsWithLinkToken = {
    token: linkToken!,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <Button label="Link an Account" onClick={() => open()} disabled={!ready} />
  );
}

export default AccountLinker