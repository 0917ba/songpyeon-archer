'use client';

import { useState } from 'react';
import Stage from '@/objects/Stage';
import uid from '@/lib/uid';
import { useRouter } from 'next/navigation';

interface Props {
  stage: Stage;
}

export default function MapSave({ stage }: Props) {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'author':
        setAuthor(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
  };

  const onClick = () => {
    stage.name = name;
    stage.author = author;
    stage.password = password;

    if (!stage.name) {
      alert('맵 이름을 입력해주세요.');
      return;
    }
    if (!stage.author) {
      alert('제작자를 입력해주세요.');
      return;
    }
    if (!stage.password || stage.password.length < 4) {
      alert('비밀번호를 입력해주세요. (4자리 이상)');
      return;
    }

    const id = uid();
    fetch(`/api/stage/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        _id: id,
        stage,
      }),
    }).then(() => {
      alert('저장되었습니다.');
      router.push('/stage');
    });
  };

  return (
    <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-slate-100/50 w-[512px] h-[320px] rounded-md ">
      <div className="flex flex-col items-center pt-8 text-center px-16 gap-3">
        <h1 className=" font-bold text-xl">저장하시겠습니까?</h1>
        <div className="mb-3">
          ⚠️맵을 저장하면 서버로 업로드되어 다른 플레이어가 플레이할 수
          있습니다.⚠️
        </div>
        <div className="flex flex-col gap-1 w-72 mb-3">
          <div className="flex gap-3 font-medium justify-between">
            <span>맵 이름:</span>
            <input
              className="h-8 w-52 pl-2 rounded-sm bg-slate-100/30 shadow text-sm"
              value={name}
              onChange={onChange}
              name="name"
            />
          </div>
          <div className="flex gap-3 font-medium justify-between">
            <span>제작자:</span>
            <input
              className="h-8 w-52 pl-2 rounded-sm bg-slate-100/30 shadow text-sm"
              value={author}
              onChange={onChange}
              name="author"
            />
          </div>
          <div className="flex gap-3 font-medium justify-between">
            <span>비밀번호:</span>
            <input
              className="h-8 w-52 pl-2 rounded-sm bg-slate-100/30 shadow text-sm"
              value={password}
              onChange={onChange}
              name="password"
            />
          </div>
        </div>
        <div>
          <button
            onClick={onClick}
            className="rounded font-medium w-12 h-8 bg-yellow-400"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
