import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { returnBillItems } from "@/services/patient-bills";
import { getClientSideCookie } from "@/utils/client-side-cookies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReturnDialogProps {
  bill: any;
  invalidateType: string;
  label: string;
  onOpenChange?: (open: boolean) => void;
}

export function ReturnConfirmationDialog({
  bill,
  invalidateType,
  label,
  onOpenChange
}: // onConfirm,
ReturnDialogProps) {
  const queryClient = useQueryClient();

  const enterpriseId = getClientSideCookie("enterpriseId");

  const payload = bill?.items?.map((ele: any) => ({
    ...ele,
    billId: bill._id,
    enterpriseId: bill?.enterpriseId,
  }));

  const { mutate: onConfirm } = useMutation({
    mutationKey: ["return-bill-items"],
    mutationFn: returnBillItems,
    onSuccess: (data) => {
      console.log("payload success", { data });
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [invalidateType, enterpriseId],
      });
    },
    onError: (error) => {
      console.log("payload error", { error });
      toast.error(error.message);
    },
  });

  const isReturnBill = bill?.items?.every((i: any) => i.isReturn);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={isReturnBill}
          className="w-full"
          onClick={() => onOpenChange?.(true)}
        >
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Return</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to return this bill? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(payload)}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
