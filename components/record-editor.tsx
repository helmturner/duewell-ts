import {
  Button,
  FileInput,
  Layer,
  Box,
  Spinner,
  Form,
  FormField,
} from "grommet";
import {  useContext, useState } from "react";
import type { ReactElement } from "react";
import GlobalContext from '../context/global'

export default function RecordEditor() {
  const { apiBase } = useContext(GlobalContext)
  let [shown, setShown] = useState(false);
  let [busy, setBusy] = useState(false);
  
  let AdderForm = (): ReactElement => {
    const [value, setValue] = useState({} as Record<string, any>);
    return (
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
//            TODO: headers.append();
              body.append("file", file, file.name);

              fetch(`${apiBase}/receipts`, { method, headers, body });
            });
          }
          event.preventDefault();
        }}
      >
        <FormField
          label="Upload Receipts"
          id="fileInput"
          onChange={(event) => setValue({fileInput: event.target.files})}
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
        ) : (
          <AdderForm />
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