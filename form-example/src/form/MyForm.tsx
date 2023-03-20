// 夢のMyForm...

import {
  Container,
  Stack,
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Button,
} from "@mui/material";
import { useCreateUserMutation } from "../graphql/generated";

import {
  useName,
  useEmail,
  usePassword,
  useHasError,
  useCreateUserVariables,
  useFormMode,
  useResetForm,
} from "./store";

const NameInput = () => {
  const { value, setValue, errorMessage } = useName();

  return (
    <FormControl error={!!errorMessage}>
      <TextField
        label="Name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
};

const EmailInput = () => {
  const { value, setValue, errorMessage } = useEmail();

  return (
    <FormControl error={!!errorMessage}>
      <TextField
        label="Email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
};

const PasswordInput = () => {
  const { value, setValue, errorMessage } = usePassword();

  return (
    <FormControl error={!!errorMessage}>
      <TextField
        label="Password"
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
};

const ConfirmationView = () => {
  const variables = useCreateUserVariables();
  const { name, email, password } = variables.input;
  const [, setMode] = useFormMode();
  const [createUser] = useCreateUserMutation({
    variables,
  });

  return (
    <Stack gap={2}>
      <Box sx={{ fontWeight: "bold" }}>Name: {name}</Box>
      <Box sx={{ fontWeight: "bold" }}>Email: {email}</Box>
      <Box sx={{ fontWeight: "bold" }}>Password: {password}</Box>
      <Stack direction="row" gap={2}>
        <Button onClick={() => setMode("input")}>Back</Button>
        <Button
          variant="contained"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            // createUser();
            window.alert("submit!" + JSON.stringify(variables));
          }}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

const InputView = () => {
  const hasError = useHasError();
  const [, setMode] = useFormMode();
  const resetForm = useResetForm();

  return (
    <Stack gap={2} component="form" onSubmit={(e) => e.preventDefault()}>
      <NameInput />
      <EmailInput />
      <PasswordInput />
      <Stack direction="row" gap={2}>
        <Button onClick={resetForm}>Reset</Button>

        <Button
          variant="contained"
          type="submit"
          onClick={() => setMode("confirmation")}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
};

export const MyForm = () => {
  const [mode] = useFormMode();

  return (
    <Box mt={10}>
      <Container maxWidth="sm">
        <Stack gap="10">
          <Box fontSize="h2">Jotai Form Example</Box>
          {mode === "input" ? <InputView /> : <ConfirmationView />}
        </Stack>
      </Container>
    </Box>
  );
};
