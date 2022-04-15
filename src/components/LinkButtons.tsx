import { Button } from "grommet";
import { useLink } from "../data/hooks";

export const NewLinkButton = (/* props: Props */) => {
  const { createItemLink } = useLink();
  return <Button hoverIndicator label="Launch Link" onClick={() => createItemLink()} />;
}

export const UpdateLinkButton = (item_id: string) => {
  const { updateItemLink } = useLink();
  return <Button hoverIndicator label="Reconnect" onClick={() => updateItemLink(item_id)} />
}

  /*const onSuccessOld: PlaidLinkOnSuccess = useCallback(
    (public_token: string, metadata: PlaidLinkOnSuccessMetadata) =>
      fetch(`${apiBase}/plaid/set_access_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `public_token=${public_token}`,
      }).finally(() => router.replace("/dashboard")),
    [apiBase, router]
  ); */
