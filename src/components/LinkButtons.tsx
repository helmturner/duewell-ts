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
