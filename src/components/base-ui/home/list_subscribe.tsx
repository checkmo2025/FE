"use client";

import ListSubscribeElement from "./list_subscribe_element";

export default function ListSubscribe() {
  const users = [
    { id: "1", name: "hy_0716", subscribingCount: 17, subscribersCount: 32 },
    { id: "2", name: "hy_0716", subscribingCount: 17, subscribersCount: 32 },
    { id: "3", name: "hy_0716", subscribingCount: 17, subscribersCount: 32 },
    { id: "4", name: "hy_0716", subscribingCount: 17, subscribersCount: 32 },
  ];

  return (
    <section className="w-[336px] h-[380px] rounded-lg border-2 border-[color:var(--Subbrown_4)] bg-white p-5">
      <h3 className="text-[20px] font-semibold leading-7 text-[color:var(--Gray_7)]">
        사용자 추천
      </h3>

      {/* 리스트 */}
      <div className="mt-3 flex flex-col gap-3">
        {users.map((u) => (
          <ListSubscribeElement
            key={u.id}
            name={u.name}
            subscribingCount={u.subscribingCount}
            subscribersCount={u.subscribersCount}
            onSubscribeClick={() => console.log("subscribe", u.id)}
          />
        ))}
      </div>
    </section>
  );
}
