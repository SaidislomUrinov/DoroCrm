import { toast } from "sonner"

export const successMsg = (msg = 'Success') => {
    toast.success(msg);
}

export const errorMsg = (msg = 'Error') => {
    toast.error(msg);
}