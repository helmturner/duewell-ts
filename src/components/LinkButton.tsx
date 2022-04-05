import { Button } from "grommet";
import { useLink } from "../data/hooks";

// Uses the usePlaidLink hook to manage the Plaid Link creation.  See https://github.com/plaid/react-plaid-link for full usage instructions.
// The link token passed to usePlaidLink cannot be null.  It must be generated outside of this component. In this app, the link token
// is generated in the link context in client/src/services/link.js.

export const LinkButton = (/* props: Props */) => {
  const { launchLink } = useLink();
  return <Button hoverIndicator label="Launch Link" onClick={launchLink} />; /*
  /*TODO:

  const { getItemsByUser, getItemById } = useItems();
  const { setError, resetError } = useErrors();
 */
  /*   useEffect(() => {
    (!linkToken || Date.parse(linkTokenExpiration!) <= Date.now()) &&
    fetch(`${apiBase}/plaid/create_link_token`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: data.link_token,
            linkTokenExpiration: data.expiration,
          },
        });
      })
  }, [linkToken, linkTokenExpiration, apiBase, dispatch]); */

  // define onSuccess, onExit and onEvent functions as configs for Plaid Link creation
  /*XXXasync (
    public_token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    // log and save metatdata
//TODO:    logSuccess(metadata, props.userId);
//XXX
    if (props.item_id != null) {
      // update mode: no need to exchange public token
      await setItemState(props.item_id, "good");
      deleteLinkToken(null, props.item_id);
      getItemById(props.item_id, true);
      // regular link mode: exchange public token for access token
    } else {
      // call to Plaid api endpoint: /item/public_token/exchange in order to obtain access_token which is then stored with the created item
      await exchangeToken(
        public_token,
        metadata.institution,
        metadata.accounts,
        props.user_id
      );
      getItemsByUser(props.user_id, true);
    }
    resetError();
    deleteLinkToken(props.user_id, null);
//XXX
  //TODO:    history.push(`/user/${props.userId}`);
  };

   const onSuccessOld: PlaidLinkOnSuccess = useCallback(
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

  /*   const onExit: PlaidLinkOnExit = () => {}
XXX
  async (
    error: PlaidLinkError | null,
    metadata: PlaidLinkOnExitMetadata
  ) => {
    // log and save error and metatdata
//TODO:    logExit(error, metadata, props.userId);
    if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
      initiateLink() //(props.user_id, props.item_id); //FIXME
    }
    if (error != null) {
      setError(error.error_code, error.display_message || error.error_message);
    }
    // to handle other error codes, see https://plaid.com/docs/errors/
  };

 */
  /*XXX
  async (
    eventName: PlaidLinkStableEvent | string,
    metadata: PlaidLinkOnEventMetadata
  ) => {
    // handle errors in the event end-user does not exit with onExit function error enabled.
    if (eventName === 'ERROR' && metadata.error_code != null) {
      setError(metadata.error_code, ' ');
    }
//TODO:    logEvent(eventName, metadata);
  };
*/

  /* TODO:  if (props.isOauth) {
    config.receivedRedirectUri = window.location.href; // add additional receivedRedirectUri config when handling an OAuth reidrect
  } */

  /*   const { open, ready } = usePlaidLink(config);
  useEffect(() => {
    // initiallizes Link automatically
    if (props.isOauth && ready) {
      open();
    } else if (ready) {
      // regular, non-OAuth case:
      // set link token, userId and itemId in local storage for use if needed later by OAuth

      localStorage.setItem(
        'oauthConfig',
        JSON.stringify({
          user_id: props.user_id,
          item_id: props.item_id,
          token: props.token,
        })
      );
      open();
    }
  }, [ready, open, props.isOauth, props.user_id, props.item_id, props.token]);

 */
};
