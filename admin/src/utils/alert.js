import { toast } from "sonner";

export const successMsg = (msg = 'Bajarildi!') => toast.success(msg);
export const errorMsg = (msg = 'Bajarildi!') => toast.error(msg);
