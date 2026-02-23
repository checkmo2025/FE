export function formatTimeAgo(dateInput: Date | string): string {
    const targetDate = new Date(dateInput);
    const now = new Date();

    if (isNaN(targetDate.getTime())) {
        return "";
    }

    const diffMs = now.getTime() - targetDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, "0");
        const day = String(targetDate.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}.`;
    }

    if (diffDays > 0) {
        return `${diffDays}일 전`;
    }
    if (diffHours > 0) {
        return `${diffHours}시간 전`;
    }
    if (diffMins > 0) {
        return `${diffMins}분 전`;
    }
    return "방금 전";
}
