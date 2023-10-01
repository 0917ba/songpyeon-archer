import { useRouter } from 'next/router';
import Button from './Button';
import { BUTTON_X, BUTTON_Y } from '@/constants/button';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default class Home extends Button {
  onClick: () => void;

  constructor(router: AppRouterInstance) {
    super(BUTTON_X[2], BUTTON_Y, '/images/home.png', 'home');
    this.onClick = () => {
      router.push('/');
    };
  }
}
