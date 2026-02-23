export const CATEGORIES = [
    { label: "소설/시/희곡", value: "FICTION_POETRY_DRAMA" },
    { label: "에세이", value: "ESSAY" },
    { label: "인문학", value: "HUMANITIES" },
    { label: "사회과학", value: "SOCIAL_SCIENCE" },
    { label: "정치/외교/국방", value: "POLITICS_DIPLOMACY_DEFENSE" },
    { label: "경제/경영", value: "ECONOMY_MANAGEMENT" },
    { label: "자기계발", value: "SELF_DEVELOPMENT" },
    { label: "역사/문화", value: "HISTORY_CULTURE" },
    { label: "과학", value: "SCIENCE" },
    { label: "컴퓨터/IT", value: "COMPUTER_IT" },
    { label: "예술/대중문화", value: "ART_POP_CULTURE" },
    { label: "여행", value: "TRAVEL" },
    { label: "외국어", value: "FOREIGN_LANGUAGE" },
    { label: "어린이/청소년", value: "CHILDREN_BOOKS" },
    { label: "종교/철학", value: "RELIGION_PHILOSOPHY" },
];

export const CATEGORY_MAP: Record<string, string> = CATEGORIES.reduce(
    (acc, cat) => {
        acc[cat.label] = cat.value;
        return acc;
    },
    {} as Record<string, string>
);
