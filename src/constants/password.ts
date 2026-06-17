export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 24;

export const PASSWORD_REQUIREMENTS_MESSAGE =
  `비밀번호는 ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH}자, 영어 최소 1자 이상, 특수문자 최소 1자 이상`;

export const PASSWORD_VALIDATION_ERROR_MESSAGE =
  `비밀번호는 영문자, 특수문자를 포함하여 ${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}자여야 합니다.`;

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/-]).{6,24}$/;

export const isPasswordValid = (password: string) => PASSWORD_REGEX.test(password);
