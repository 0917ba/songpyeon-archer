'use client';

import {
  beanAirResistanceState,
  beanFrictionState,
  beanWeightState,
  gravityState,
} from '@/atoms/atom';
import MenuButton from '@/components/MenuButton';
import Image from 'next/image';
import { useRecoilState } from 'recoil';

interface SettingBarProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

interface SettingInputProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

function SettingBar({ title, description, children }: SettingBarProps) {
  return (
    <div className="w-full h-16 bg-slate-100/30 rounded-md px-9 py-1 flex justify-between">
      <div className="flex flex-col justify-center">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm">{description}</p>
      </div>
      <div className="w-24 px-4 py-2 h-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}

function SettingInput({ value, onChange, name }: SettingInputProps) {
  return (
    <input
      className="h-full w-full pl-2 rounded bg-slate-100/30 shadow text-lg"
      value={value}
      type="number"
      onChange={onChange}
      name={name}
    />
  );
}

export default function Page() {
  const [mass, setMass] = useRecoilState(beanWeightState);
  const [airResistance, setAirResistance] = useRecoilState(
    beanAirResistanceState
  );
  const [friction, setFriction] = useRecoilState(beanFrictionState);
  const [gravity, setGravity] = useRecoilState(gravityState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'mass':
        setMass(Number(value));
        break;
      case 'airResistance':
        setAirResistance(Number(value));
        break;
      case 'friction':
        setFriction(Number(value));
        break;
      case 'gravity':
        setGravity(Number(value));
        break;
    }
  };

  const onClick = () => {
    setMass(mass || 1);
    setAirResistance(airResistance || 1);
    setFriction(friction || 1);
    setGravity(gravity || 1);
    alert('적용되었습니다.');
  };

  return (
    <div className="h-[600px] w-[1080px] bg-slate-300 relative">
      <div className="absolute top-5 left-5 z-50">
        <MenuButton />
      </div>
      <div className="absolute w-full h-full py-16 px-56">
        <h1 className="text-4xl font-bold mb-10 text-center">⚙️설정⚙️</h1>
        <div className="flex flex-col gap-2 h-[280px] mb-10">
          <SettingBar
            title="돌멩이 무게 설정"
            description="돌멩이의 무게를 설정할 수 있습니다. (기본값: 1)"
          >
            <SettingInput value={mass} onChange={onChange} name="mass" />
          </SettingBar>
          <SettingBar
            title="돌멩이 공기 저항 계수 설정"
            description="돌멩이의 공기 저항 계수를 설정할 수 있습니다. (기본값: 1)"
          >
            <SettingInput
              value={airResistance}
              onChange={onChange}
              name="airResistance"
            />
          </SettingBar>
          <SettingBar
            title="돌멩이 마찰 계수 설정"
            description="돌멩이의 마찰 계수를 설정할 수 있습니다. (기본값: 1)"
          >
            <SettingInput
              value={friction}
              onChange={onChange}
              name="friction"
            />
          </SettingBar>
          <SettingBar
            title="중력 가속도 설정"
            description="월드의 중력 가속도를 설정할 수 있습니다. (기본값: 1)"
          >
            <SettingInput value={gravity} onChange={onChange} name="gravity" />
          </SettingBar>
        </div>
        <div className="w-full flex justify-center">
          <button
            onClick={onClick}
            className="flex justify-center items-center w-20 h-9 text-base font-bold bg-orange-400 rounded"
          >
            적용하기
          </button>
        </div>
      </div>
      <Image
        src="/images/layout.png"
        alt="main"
        quality={100}
        width={1080}
        height={600}
      />
    </div>
  );
}
