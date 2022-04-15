import { DataTable, Heading, Text } from "grommet";
import { useTransactions } from "data/hooks";
import { useState } from "react";
import { TransactionFilter } from "data/types/queries";

const TableControls = () => {};

export const TransactionTable = () => {
  const [filter, setFilter] = useState<TransactionFilter>({})
  const transactions = useTransactions({filter});

  const columns = Array.from(
    transactions?.data?.reduce(
      (keys, tx) => new Set(...keys, ...Object.keys(tx)),
      new Set<string>()
    ) ?? []
  ).map((key) => ({
    primary: (key === "account_id"),
    property: key,
    header: <Text>{key.replace("_", " ")}</Text>,
  }));

  return (
    <>
      <Heading
        id="transactions-heading"
        level={4}
        margin="none"
        responsive={true}
      >
        Transactions
      </Heading>
      {/*       <TableControls />*/}
      <DataTable columns={columns} data={transactions?.data}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Merchant</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
            <th>Merchant Details</th>
            <th>Payment Channel</th>
            <th>Payee</th>
            <th>Category 2</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.data?.map((tx) => (
            <tr key={tx.transaction_id}>
              <td>{tx.name}</td>
              <td>{tx.merchant_name}</td>
              <td>{tx.category}</td>
              <td>{tx.datetime}</td>
              <td>{tx.original_description}</td>
              <td>
                {[
                  tx.location.store_number,
                  tx.location.address,
                  tx.location.city,
                  tx.location.region,
                  tx.location.postal_code,
                ].join(", ")}
              </td>
              <td>{tx.payment_channel}</td>
              <td>{tx.payment_meta.payee}</td>
              <td>{tx.personal_finance_category}</td>
              <td>{tx.datetime}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </>
  );
};
