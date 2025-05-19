import { toast } from 'react-toastify';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export const showToast = {
  success: (message: string) => {
    toast.success(
      <div className="flex items-center">
        <CheckCircle className="mr-2 text-success-500" size={18} />
        <span>{message}</span>
      </div>
    );
  },
  error: (message: string) => {
    toast.error(
      <div className="flex items-center">
        <XCircle className="mr-2 text-error-500" size={18} />
        <span>{message}</span>
      </div>
    );
  },
  warning: (message: string) => {
    toast.warning(
      <div className="flex items-center">
        <AlertTriangle className="mr-2 text-warning-500" size={18} />
        <span>{message}</span>
      </div>
    );
  },
  info: (message: string) => {
    toast.info(
      <div className="flex items-center">
        <Info className="mr-2 text-primary-500" size={18} />
        <span>{message}</span>
      </div>
    );
  }
};