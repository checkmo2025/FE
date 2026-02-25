// ~/types/auth.ts에 정의되어 있는건 아는데 거기 있는 거보단 여기가 맞을 거 같아서 빼두겠습니다.
export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};