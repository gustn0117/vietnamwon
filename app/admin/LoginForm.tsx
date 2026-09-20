"use client";

import { useActionState } from "react";
import { signIn, type FormState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});

  return (
    <form className="admin-login" action={action}>
      <h1>관리자 로그인</h1>
      <label>
        비밀번호
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.error && <p className="admin-error">{state.error}</p>}
      <button className="gold-button" type="submit" disabled={pending}>
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
