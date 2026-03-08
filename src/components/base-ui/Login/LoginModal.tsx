"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";
import styles from "@/components/base-ui/Login/LoginModal.module.css";
import useLoginForm from "@/components/base-ui/Login/useLoginForm";
import { SOCIAL_LOGINS } from "@/constants/auth";

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.84 0 1.68-.1 2.47-.28" />
    <path d="M2 2l20 20" />
  </svg>
);

type Props = {
  onClose: () => void;
  onFindAccount?: () => void;
  onSignUp?: () => void;
};

export default function LoginModal({
  onClose,
  onFindAccount,
  onSignUp,
}: Props) {
  const router = useRouter();
  const {
    form,
    errors,
    isLoading,
    handleChange,
    handleLogin,
    handleSocialLogin,
    handleKeyDown,
  } = useLoginForm(onClose);

  const [showPassword, setShowPassword] = useState(false);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSignUp = () => {
    if (onSignUp) onSignUp();
    router.push("/signup");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
      >
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
                  name="identifier"
                  type="text"
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder="이메일"
                  className={`${styles.input} ${errors?.identifier ? styles.inputError : ""
                    }`}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                {errors?.identifier && (
                  <span className={styles.errorMessage}>{errors.identifier}</span>
                )}
                <div className={styles.passwordWrapper}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="비밀번호"
                    className={`${styles.input} ${errors?.password ? styles.inputError : ""
                      } pr-[40px]`}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors?.password && (
                  <span className={styles.errorMessage}>{errors.password}</span>
                )}
              </div>

              {/* 아이디/비번 찾기 */}
              <div className={styles.findAccount}>
                <span className={styles.link} onClick={() => {
                  onClose();
                  router.push('/find-account');
                }}>
                  아이디 찾기
                </span>
                <span className={styles.divider}>|</span>
                <span className={styles.link} onClick={() => {
                  onClose();
                  router.push('/find-password');
                }}>
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
                  className={`${styles.socialIcon} ${isLoading ? "opacity-60 cursor-not-allowed" : ""
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
            <span className={styles.footerLink} onClick={handleSignUp}>
              회원가입하러가기
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
