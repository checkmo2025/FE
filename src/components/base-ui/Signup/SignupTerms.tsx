"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./SignupTerms.module.css";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";

const TERMS_DATA = [
  {
    id: "privacy",
    label: "서비스 이용을 위한 필수 개인정보 수집·이용 동의",
    required: true,
  },
  { id: "terms", label: "책모 이용약관 동의", required: true },
  { id: "thirdParty", label: "개인정보 제3자 제공 동의", required: false },
  {
    id: "marketing",
    label: "마케팅 및 이벤트 정보 수신 동의",
    required: false,
  },
];

export default function SignupTerms() {
  const [agreements, setAgreements] = useState<Record<string, boolean>>({
    privacy: false,
    terms: false,
    thirdParty: false,
    marketing: false,
  });

  const handleCheck = (id: string) => {
    setAgreements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAllCheck = () => {
    const allChecked = Object.values(agreements).every(Boolean);
    const newStatus = !allChecked;
    const newAgreements = Object.keys(agreements).reduce((acc, key) => {
      acc[key] = newStatus;
      return acc;
    }, {} as Record<string, boolean>);
    setAgreements(newAgreements);
  };

  const isAllRequiredChecked = TERMS_DATA.filter((t) => t.required).every(
    (t) => agreements[t.id]
  );

  const isAllChecked = Object.values(agreements).every(Boolean);

  return (
    <div className={styles.container}>
      {/* 닫기 버튼 */}
      <button type="button" className={styles.closeIcon}>
        <Image src="/cancle_button.svg" alt="닫기" width={24} height={24} />
      </button>

      {/* 헤더 */}
      <div className={styles.header}>
        <LoginLogo />
        <h2 className={styles.title}>약관 동의</h2>
      </div>

      {/* 약관 목록 */}
      <div className={styles.termsContainer}>
        {TERMS_DATA.map((term) => (
          <div
            key={term.id}
            className={styles.termItem}
            onClick={() => handleCheck(term.id)}
          >
            <span className={styles.termLabel}>
              {term.label} ({term.required ? "필수" : "선택"})
            </span>
            <input
              type="checkbox"
              checked={agreements[term.id]}
              readOnly
              className={styles.checkbox}
            />
          </div>
        ))}
        <div className={styles.divider} />
        <div className={styles.termItem} onClick={handleAllCheck}>
          <span className={styles.termLabel} style={{ fontWeight: 600 }}>
            전체동의
          </span>
          <input
            type="checkbox"
            checked={isAllChecked}
            readOnly
            className={styles.checkbox}
          />
        </div>
      </div>

      {/* 다음 버튼 */}
      <button
        type="button"
        className={styles.nextButton}
        disabled={!isAllRequiredChecked}
      >
        다음
      </button>
    </div>
  );
}
