import {
  Button,
  FileInput,
  Layer,
  Box,
  Spinner,
  Form,
  FormField,
} from "grommet";
import { ReactElement, useState } from "react";
import { useSession } from "next-auth/react";
import { Account, Session, User } from "next-auth";
import Error from "next/error";

type ExtendedSession = Session & {
  user: User;
  account: Account & { id: string };
};

export default function RecordEditor() {
  let [shown, setShown] = useState(false);
  let [busy, setBusy] = useState(false);
  const { data: session, status } = useSession();

  let AdderForm = ({ session }: { session: ExtendedSession }): ReactElement => {
    const [value, setValue] = useState({} as Record<string, any>);
    //FIXME return 401 error if session expired (does not work here)
    return Date.parse(session.expires) <= Date.now() ? (
      <Error statusCode={401} />
    ) : (
      <Form
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
        onReset={() => setValue({})}
        onSubmit={(event) => {
          if (value.fileInput) {
            value.fileInput.forEach((file: File): void => {
              let method = "POST";
              let headers = new Headers();
              let body = new FormData();

              let user = session.user as User & Account;
              let authHeader = `${user.tokenType + " " + user.accessToken}`;

              headers.append("Authorization", authHeader);

              body.append("userid", session.account.id);
              body.append("file", file, file.name);

              fetch("api/records", { method, headers, body });
            });
          }
          event.preventDefault();
        }}
      >
        <FormField
          label="Upload Receipts"
          id="fileInput"
          //onChange={() => setValue({fileInput: event.target.files})}
          component={FileInput}
          name="fileInput"
          multiple={true}
        />
        <Box align="center" justify="center" direction="row" gap="medium">
          <Button type="submit" primary label="Submit" />
          <Button type="reset" label="Reset" />
          <Button type="button" label="Close" onClick={() => setShown(false)} />
        </Box>
      </Form>
    );
  };

  let FormModal = (): ReactElement | null => {
    return shown ? (
      <Layer
        onEsc={() => setShown(false)}
        onClickOutside={() => setShown(false)}
      >
        {busy ? (
          <Spinner />
        ) : status === "authenticated" && session ? (
          <AdderForm session={session as ExtendedSession} />
        ) : (
          <Error statusCode={401} />
        )}
      </Layer>
    ) : null;
  };

  return (
    <>
      <Button label="Add Record" onClick={() => setShown(true)} />
      <FormModal />
    </>
  );
}
