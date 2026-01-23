"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import LoginLogo from "./LoginLogo";
import styles from "./LoginModal.module.css";
import useLoginForm from "./useLoginForm";

type Props = {
  onClose: () => void;
  onFindAccount?: () => void;
  onSignUp?: () => void;
};

const SOCIAL_LOGINS = [
  { name: "google", icon: "/googleLogo.svg", alt: "구글 로그인" },
  { name: "naver", icon: "/naverLogo.svg", alt: "네이버 로그인" },
  { name: "kakao", icon: "/kakaoLogo.svg", alt: "카카오 로그인" },
];

export default function LoginModal({
  onClose,
  onFindAccount,
  onSignUp,
}: Props) {
  const {
    form,
    errors,
    isLoading,
    handleChange,
    handleLogin,
    handleSocialLogin,
    handleKeyDown,
  } = useLoginForm();

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={styles.container}>
        {/* 닫기 버튼 */}
        <button type="button" onClick={onClose} className={styles.closeIcon}>
          <Image src="/cancle_button.svg" alt="닫기" width={24} height={24} />
        </button>

        {/* 로고 영역 */}
        <div className={styles.headerLogo}>
          <LoginLogo />
        </div>

        {/* 메인 컨텐츠 */}
        <div className={styles.mainContent}>
          <div className={styles.inputSocialWrapper}>
            <div className={styles.inputLoginGroup}>
              {/* 인풋 필드 */}
              <div className={styles.inputWrapper}>
                <input
                  name="id"
                  type="text"
                  value={form.id}
                  onChange={handleChange}
                  placeholder="아이디"
                  className={`${styles.input} ${
                    errors?.id ? styles.inputError : ""
                  }`}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                {errors?.id && (
                  <span className={styles.errorMessage}>{errors.id}</span>
                )}
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="비밀번호"
                  className={`${styles.input} ${
                    errors?.password ? styles.inputError : ""
                  }`}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                {errors?.password && (
                  <span className={styles.errorMessage}>{errors.password}</span>
                )}
              </div>

              {/* 아이디/비번 찾기 */}
              <div className={styles.findAccount}>
                <span className={styles.link} onClick={onFindAccount}>
                  아이디 찾기
                </span>
                <span className={styles.divider}>|</span>
                <span className={styles.link} onClick={onFindAccount}>
                  비밀번호 찾기
                </span>
              </div>

              {/* 로그인 버튼 */}
              <button
                type="button"
                className={styles.loginButton}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </div>

            {/* 소셜 로그인 */}
            <div className={styles.socialContainer}>
              {SOCIAL_LOGINS.map((social) => (
                <button
                  key={social.name}
                  type="button"
                  className={`${styles.socialIcon} ${
                    isLoading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                  onClick={() => handleSocialLogin(social.name)}
                >
                  <Image
                    src={social.icon}
                    alt={social.alt}
                    width={40}
                    height={40}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 하단 안내 문구 */}
          <p className={styles.footerText}>
            아직 회원이 아니신가요?{" "}
            <span className={styles.footerLink} onClick={onSignUp}>
              회원가입하러가기
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
