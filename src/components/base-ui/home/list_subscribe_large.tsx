'use client';

import Image from 'next/image';

type ListSubscribeElementLargeProps = {
  name: string;
  subscribingCount: number;
  subscribersCount: number;
  profileSrc?: string;
  onSubscribeClick?: () => void;
  buttonText?: string;
};

function ListSubscribeElementLarge({
  name,
  subscribingCount,
  subscribersCount,
  profileSrc = '/profile2.svg',
  onSubscribeClick,
  buttonText = '구독',
}: ListSubscribeElementLargeProps) {
  return (
    <div className="flex w-[296px] h-[66px] px-[14px] py-[8px] gap-[8px] rounded-[8px] border border-Subbrown-4 bg-white">
      <div className="w-[32px] h-[32px] rounded-full overflow-hidden shrink-0 relative self-center">
        <Image
          src={profileSrc}
          alt={`${name} profile`}
          fill
          className="object-cover"
          sizes="32px"
          priority={false}
        />
      </div>

      <div className="flex flex-row flex-1 min-w-0 gap-[8px] items-center">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-Gray-7 body_1 truncate">{name}</p>
          <p className="body_2_3 text-Gray-3">
            구독중 {subscribingCount} 구독자 {subscribersCount}
          </p>
        </div>

        <button
          type="button"
          onClick={onSubscribeClick}
          className="flex px-[17px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] bg-[#9A7A6B] text-white text-[12px] font-semibold leading-[100%] tracking-[-0.012px] whitespace-nowrap shrink-0"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

type ListSubscribeLargeProps = {
  height?: string;
};

export default function ListSubscribeLarge({ height = 'h-[380px]' }: ListSubscribeLargeProps) {
  const users = [
    { id: '1', name: 'hy_0716', subscribingCount: 17, subscribersCount: 32 },
    { id: '2', name: 'hy_0716', subscribingCount: 17, subscribersCount: 32 },
    { id: '3', name: 'hy_0716', subscribingCount: 17, subscribersCount: 32 },
    { id: '4', name: 'hy_0716', subscribingCount: 17, subscribersCount: 32 },
  ];

  return (
    <section className={`w-[336px] ${height} rounded-lg border-2 border-Subbrown-4 bg-stone-50 p-5`}>
      <h3 className="subhead_2 text-Gray-7">사용자 추천</h3>

      <div className="mt-3 flex flex-col gap-3">
        {users.map((u) => (
          <ListSubscribeElementLarge
            key={u.id}
            name={u.name}
            subscribingCount={u.subscribingCount}
            subscribersCount={u.subscribersCount}
            onSubscribeClick={() => console.log('subscribe', u.id)}
          />
        ))}
      </div>
    </section>
  );
}
