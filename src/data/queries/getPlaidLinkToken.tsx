import type { LinkTokenQueryFunction } from "../types/queries";

export const getPlaidLinkToken: LinkTokenQueryFunction = async ({
  queryKey,
}) => {
  const { user_id, item_id } = queryKey[1];

  const response = await fetch("/api/plaid/link", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_id,
      user_id,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};
