// 탈퇴 안내문
export default function WithdrawalNotice() {
  return (
    <div className="flex flex-col items-start self-stretch">
      {/* 1. 보류 기간 */}
      <div className="flex flex-col">
        <h4 className="body_1_2 text-Gray-6">1. 탈퇴 신청 후 보류 기간</h4>
        <p className="body_1_3 text-Gray-5">
          탈퇴 신청 시 즉시 탈퇴가 아닌 7일간의 유예 기간이 적용됩니다.
          <br />이 기간 동안에는 언제든 탈퇴를 철회할 수 있습니다.
        </p>
      </div>

      {/* 2. 탈퇴 처리 */}
      <div className="flex flex-col">
        <h4 className="body_1_2 text-Gray-6">2. 탈퇴 처리</h4>
        <p className="body_1_3 text-Gray-5">
          유예 기간(7일)이 지나면 회원 정보와 활동 기록은 모두 영구적으로
          삭제됩니다.
          <br />
          단, 법적 보관 의무가 있는 데이터는 관련 법령에 따라 일정 기간 보관 후
          파기됩니다.
        </p>
      </div>

      {/* 3. 주의사항 */}
      <div className="flex flex-col">
        <h4 className="body_1_2 text-Gray-6">3. 주의사항</h4>
        <p className="body_1_3 text-Gray-5">
          탈퇴 후에는 복구가 불가능하며, 동일 계정으로 재가입해도 기존 데이터는
          복원되지 않습니다.
        </p>
      </div>
    </div>
  );
}
