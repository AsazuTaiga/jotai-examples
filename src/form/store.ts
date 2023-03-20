import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { z } from "zod";
import { CreateUserMutationVariables } from "../graphql/generated";

// エラーメッセージを表示するかどうかを判定するためのatom（フォーム全体で共有）
const shouldShowErrorMessageAtom = atom(false);

const nameAtom = atom("");
const nameSchema = z
  .string()
  .min(3, "名前は3文字以上で入力してください")
  .max(20, "名前は20文字以内で入力してください");
const nameErrorAtom = atom((get) => {
  const name = get(nameAtom);
  const result = nameSchema.safeParse(name);
  if (result.success) {
    return "";
  }
  return result.error.issues[0].message;
});
const nameDisplayErrorAtom = atom((get) => {
  const shouldShow = get(shouldShowErrorMessageAtom);
  const error = get(nameErrorAtom);
  return shouldShow ? error : "";
});
export const useName = () => {
  const [value, setValue] = useAtom(nameAtom);
  const errorMessage = useAtomValue(nameDisplayErrorAtom);
  return { value, setValue, errorMessage };
};

const emailAtom = atom("");
const emailSchema = z.string().email("メールアドレスの形式で入力してください");

const emailErrorAtom = atom((get) => {
  const email = get(emailAtom);
  const result = emailSchema.safeParse(email);
  if (result.success) {
    return "";
  }
  return result.error.issues[0].message;
});
const emailDisplayErrorAtom = atom((get) => {
  const shouldShow = get(shouldShowErrorMessageAtom);
  const error = get(emailErrorAtom);
  return shouldShow ? error : "";
});
export const useEmail = () => {
  const [value, setValue] = useAtom(emailAtom);
  const errorMessage = useAtomValue(emailDisplayErrorAtom);
  return { value, setValue, errorMessage };
};

const passwordAtom = atom("");
const passwordSchema = z
  .string()
  .min(8, "パスワードは8文字以上で入力してください")
  .max(20, "パスワードは20文字以内で入力してください");
const passwordErrorAtom = atom((get) => {
  const password = get(passwordAtom);
  const result = passwordSchema.safeParse(password);
  if (!result.success) {
    return result.error.issues[0].message;
  }

  // example: cross field validation
  // 実際こんなことはしないと思うが、例として
  const name = get(nameAtom);
  if (name === password) {
    return "名前とパスワードは異なるものにしてください";
  }

  return "";
});
const passwordDisplayErrorAtom = atom((get) => {
  const shouldShow = get(shouldShowErrorMessageAtom);
  const error = get(passwordErrorAtom);
  return shouldShow ? error : "";
});
export const usePassword = () => {
  const [value, setValue] = useAtom(passwordAtom);
  const errorMessage = useAtomValue(passwordDisplayErrorAtom);
  return { value, setValue, errorMessage };
};

// mutationの引数：GraphQL Code Generatorで生成した型を使うことができる
// （良い感じ〜）
// この例ではシンプルにそのまま値を各フィールドに渡しているだけだが、ここで適切な変換をかませることもできる
const createUserVariablesAtom = atom<CreateUserMutationVariables>((get) => ({
  input: {
    name: get(nameAtom),
    email: get(emailAtom),
    password: get(passwordAtom),
  },
}));
export const useCreateUserVariables = () =>
  useAtomValue(createUserVariablesAtom);

// 確認画面表示用にデータを整形したり
const confirmationAtom = atom((get) => {
  const name = get(nameAtom);
  const email = get(emailAtom);
  const password = get(passwordAtom);
  return {
    name,
    email,
    password: "*".repeat(password.length), // パスワードは表示しない
  };
});
export const useConfirmation = () => useAtomValue(confirmationAtom);

// フォーム全体をまたいで、エラーがあるかかないかを判定するためのatom
const hasErrorAtom = atom((get) => {
  const nameError = get(nameErrorAtom);
  const emailError = get(emailErrorAtom);
  const passwordError = get(passwordErrorAtom);
  return nameError || emailError || passwordError;
});

type FormMode = "input" | "confirmation";
const formModeAtom = atom<FormMode, [FormMode], void>(
  "input",
  (get, set, newValue) => {
    // 入力画面に戻る
    if (newValue === "input") {
      set(formModeAtom, "input");
      return;
    }

    // 確認画面に進む
    const hasError = get(hasErrorAtom);
    if (hasError) {
      set(shouldShowErrorMessageAtom, true);
      set(formModeAtom, "input");
      return;
    }

    set(formModeAtom, "confirmation");
  }
);
export const useFormMode = () => useAtom(formModeAtom);

// フォームの入力値をリセットするためのatom
const resetFormAtom = atom(null, (get, set) => {
  set(nameAtom, "");
  set(emailAtom, "");
  set(passwordAtom, "");
  set(shouldShowErrorMessageAtom, false);
});
export const useResetForm = () => useSetAtom(resetFormAtom);
