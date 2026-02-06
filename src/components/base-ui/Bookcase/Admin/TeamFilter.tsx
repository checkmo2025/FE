"use client";

type Props = {
  teams: string[];
  selectedTeam: string;
  onSelect: (team: string) => void;
};

export default function TeamFilter({ teams, selectedTeam, onSelect }: Props) {
  return (
    <div className="flex w-full items-center gap-[8px] border-b border-Subbrown-4 py-[16px]">
      {teams.map((team) => {
        const isActive = selectedTeam === team;
        return (
          <button
            key={team}
            onClick={() => onSelect(team)}
            className={`flex h-[36px] w-[83px] items-center justify-center rounded-[4px] border px-[10px] text-[14px] font-medium leading-[145%] tracking-[-0.014px] transition-colors
              ${
                isActive
                  ? "bg-primary-2 border-primary-2 text-White"
                  : "bg-White border-Subbrown-4 text-Gray-7 hover:bg-gray-50"
              }
            `}
          >
            {team}
          </button>
        );
      })}
    </div>
  );
}
