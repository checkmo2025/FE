export const NICKNAME_MAX_LENGTH = 20;

const ALLOWED_NICKNAME_PATTERN =
  /^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/u;

export type NicknameValidationResult = {
  isValid: boolean;
  normalized: string;
  message: string;
};

export const normalizeNickname = (nickname: string): string =>
  nickname.normalize("NFC");

export const getNicknameComparisonKey = (nickname: string): string =>
  normalizeNickname(nickname).toLowerCase();

export const isSameNicknameIdentity = (
  first: string,
  second: string
): boolean => {
  const firstKey = getNicknameComparisonKey(first);
  return firstKey.length > 0 && firstKey === getNicknameComparisonKey(second);
};

export const validateNickname = (nickname: string): NicknameValidationResult => {
  const normalized = normalizeNickname(nickname);

  if (normalized.length === 0) {
    return {
      isValid: false,
      normalized,
      message: "닉네임을 입력해주세요.",
    };
  }

  if (/\s/u.test(normalized)) {
    return {
      isValid: false,
      normalized,
      message: "닉네임에는 공백을 사용할 수 없습니다.",
    };
  }

  if ([...normalized].length > NICKNAME_MAX_LENGTH) {
    return {
      isValid: false,
      normalized,
      message: `닉네임은 최대 ${NICKNAME_MAX_LENGTH}자까지 가능합니다.`,
    };
  }

  if (!ALLOWED_NICKNAME_PATTERN.test(normalized)) {
    return {
      isValid: false,
      normalized,
      message: "닉네임은 한글, 영문, 숫자, 허용된 특수문자만 사용할 수 있습니다.",
    };
  }

  return { isValid: true, normalized, message: "" };
};

export const encodeNicknamePathSegment = (nickname: string): string =>
  encodeURIComponent(normalizeNickname(nickname));

export const decodeNicknamePathSegment = (nickname: string): string =>
  decodeURIComponent(nickname);

export const getProfilePath = (nickname: string): string =>
  `/profile/${encodeNicknamePathSegment(nickname)}`;

export const getProfileFollowsPath = (
  nickname: string,
  tab: "follower" | "following"
): string => `${getProfilePath(nickname)}/follows?tab=${tab}`;
