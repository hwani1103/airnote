import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T = any>(
  url: string
): UseMutationResult<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  function mutation(data: any) {
    setState((prev) => ({ ...prev, loading: true }));

    console.log('mutate중')
    fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json().catch(() => {})) // 응답이 resolve되면 받는 then. 응답을 json 파싱함. 파싱 실패하면 catch->finally
      .then((data) => {
        setState((prev) => ({ ...prev, data }))}) // json파싱성공하면. data state를 변경함.
      .catch((error) => setState((prev) => ({ ...prev, error }))) // 네트워크 오류 발생하면 then으로 가지않고 여기로 옴. 오류 state 변경
      .finally(() => setState((prev) => ({ ...prev, loading: false }))); // 최종적으로 모든 응답에 대해 받음. 그냥 loading상태를 변경.
      console.log('mutate끝.')
    }
    return [mutation, { ...state }];
}
