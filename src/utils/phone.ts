export const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const digits = value.replace(/[^0-9]/g, "");

    if (digits.length <= 3) {
        return digits;
    } else if (digits.length <= 7) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
        // 최대 11자리 숫자까지만 포맷팅 (결과물은 13자리)
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
};
