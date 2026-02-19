"use client";

type Props = {
  teams: string[];
  selectedTeam: string;
  onSelect: (team: string) => void;
};
{/* 모바일일 때 가로 스크롤, 스크롤 숨김 */}
export default function TeamFilter({ teams, selectedTeam, onSelect }: Props) {
  return (
  <div className="w-full border-b border-Subbrown-4">
    <div
      className="
        flex flex-nowrap items-center gap-[8px] py-[16px]
        overflow-x-auto overflow-y-hidden whitespace-nowrap touch-pan-x scroll-smooth
        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
      "
    >
      {teams.map((team) => {
        const isActive = selectedTeam === team;
        return (
          <button
            key={team}
            onClick={() => onSelect(team)}
            className={`shrink-0 flex h-[36px] min-w-[83px] items-center justify-center rounded-[4px] border px-[10px] transition-colors body_2_2 hover:brightness-97 hover:-translate-y-[3px] cursor-pointer
              ${
                isActive
                  ? "bg-primary-2 border-primary-2 text-White"
                  : "bg-White border-Subbrown-4 text-Gray-7"
              }
            `}
          >
            {team}
          </button>
        );
      })}
    </div>
  </div>
  );
}
