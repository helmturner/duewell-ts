export const validItemStatuses = ['good', 'bad']

const safeAccountFields = [
  "_id",
  "item_id",
  "user_id",
  "name",
  "mask",
  "official_name",
  "current_balance",
  "available_balance",
  "iso_currency_code",
  "unofficial_currency_code",
  "type",
  "subtype",
  "created_at",
  "updated_at",
];

const safeItemFields = [
  "_id",
  "user_id",
  "plaid_institution_id",
  "status",
  "created_at",
  "updated_at",
];

const safeUserFields = ["_id", "username", "created_at", "updated_at"];

const safeTransactionFields = [
  "_id",
  "account_id",
  "item_id",
  "user_id",
  "name",
  "type",
  "date",
  "category",
  "amount",
  "created_at",
  "updated_at",
];

export const sanitizeAccounts = (accounts) =>
  Object.fromEntries(
    Object.entries(accounts).filter(([key]) => safeAccountFields.includes(key))
  );

export const sanitizeItems = (items) =>
  Object.fromEntries(
    Object.entries(items).filter(([key]) => safeItemFields.includes(key))
  );

export const sanitizeUsers = (users) =>
  Object.fromEntries(
    Object.entries(users).filter(([key]) => safeUserFields.includes(key))
  );

export const sanitizeTransactions = (transactions) =>
  Object.fromEntries(
    Object.entries(transactions).filter(([key]) =>
      safeTransactionFields.includes(key)
    )
  );

export const isValidItemStatus = (status) => validItemStatuses.includes(status);

export function appendQueryParams(base, params) {
  return Object.keys(params).reduce(
      (result, key, index, arr) => result
          .concat(`${key}=${params[key]}`)
          .concat((index === arr.length - 1) ? '' : '&'),
      `${base}?`)
}