import { toast } from 'react-toastify';
import { AlertVariants } from '@/shared/lib/constants/constants';
import 'react-toastify/dist/ReactToastify.css';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toastOptions : any = {
  autoClose: 1000,
  position: 'top-right',
};

export function customAlert(type: AlertVariants, message: string, autoClose = toastOptions.autoClose) {

  const notify = () => toast[ type ](message, { ...toastOptions, autoClose });
  notify();
}
