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
  useCreateUserVariables,
  useFormMode,
  useResetForm,
  useConfirmation,
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
  const { name, email, password } = useConfirmation();
  return (
    <Stack gap={2}>
      <Box sx={{ fontWeight: "bold" }}>Name: {name}</Box>
      <Box sx={{ fontWeight: "bold" }}>Email: {email}</Box>
      <Box sx={{ fontWeight: "bold" }}>Password: {password}</Box>
      <Stack direction="row" gap={2}>
        <BackButton />
        <SubmitButton />
      </Stack>
    </Stack>
  );
};

const BackButton = () => {
  const [, setMode] = useFormMode();
  return <Button onClick={() => setMode("input")}>Back</Button>;
};

const SubmitButton = () => {
  // 使う側はこんなにシンプル！（いっそこれらをまとめたhookを作ってしまうのもよいが、ややオーバーか？）
  const variables = useCreateUserVariables();
  const [createUser] = useCreateUserMutation({
    variables,
  });

  return (
    <Button
      variant="contained"
      onClick={(e) => {
        // createUser();
        window.alert("submit!" + JSON.stringify(variables));
      }}
    >
      Submit
    </Button>
  );
};

const InputView = () => {
  const [, setMode] = useFormMode();

  return (
    <Stack gap={2} component="form" onSubmit={(e) => e.preventDefault()}>
      <NameInput />
      <EmailInput />
      <PasswordInput />
      <Stack direction="row" gap={2}>
        <ResetButton />
        <NextButton />
      </Stack>
    </Stack>
  );
};

const ResetButton = () => {
  const resetForm = useResetForm();
  return <Button onClick={resetForm}>Reset</Button>;
};

const NextButton = () => {
  const [, setMode] = useFormMode();
  return (
    <Button
      variant="contained"
      type="submit"
      onClick={(e) => {
        e.preventDefault();
        setMode("confirmation");
      }}
    >
      Next
    </Button>
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
