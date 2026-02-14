import { Modal } from "../../components/CompundModel";
import { useUpdateSalary } from "../../utils/ReactQuerry/Salaries/useUpdateSalaries";
import { useAddSalary } from "../../utils/ReactQuerry/Salaries/useUploadSalaries";

type FormData = {
  amount: string;
  status: string;
};

type SalaryModalProps = {
  setIsModel: (value: boolean) => void;
  onSuccess?: () => void;
  editData?: any | null;
};

export default function SalaryModal({
  setIsModel,
  onSuccess,
  editData,
}: SalaryModalProps) {
  const isEditMode = !!editData;

  const { addSalaryMutate, isPending: isAddPending } = useAddSalary();
  const { updateSalaryMutate, isPending: isUpdatePending } = useUpdateSalary();

  const isPending = isAddPending || isUpdatePending;

  // Use payment_id as the unique key to force form reset when switching records
  const modalKey = editData?.payment_id
    ? `edit-${editData.payment_id}`
    : "create-new";

  const defaultValues = editData
    ? {
        amount: editData.amount?.toString() || "",
        status: editData.status || "",
      }
    : {
        amount: "",
        status: "قيد الانتظار",
      };

  const onSubmit = (data: FormData) => {
    const salaryData = {
      amount: parseFloat(data.amount),
      status: data.status,
    };

    const mutationOptions = {
      onSuccess: () => {
        setIsModel(false);
        onSuccess?.();
      },
      onError: (error: any) => {
        console.error("Mutation failed:", error);
      },
    };

    if (isEditMode) {
      updateSalaryMutate(
        { id: editData.payment_id, ...salaryData },
        mutationOptions,
      );
    } else {
      // NOTE: For a real 'Add', you'd likely need sponsor_id/orphan_id here
      addSalaryMutate(salaryData, mutationOptions);
    }
  };

  return (
    <Modal.Root<FormData>
      key={modalKey}
      onClose={() => setIsModel(false)}
      onSubmit={onSubmit}
      isPending={isPending}
      defaultValues={defaultValues}
      mode={isEditMode ? "edit" : "create"}
    >
      <Modal.Header
        title="إضافة دفعة مالية"
        editTitle={
          editData?.sponsor_name
            ? `تعديل كفالة: ${editData.sponsor_name}`
            : "تعديل البيانات المالية"
        }
      />

      <Modal.Body>
        <Modal.Grid>
          <Modal.Input<FormData>
            name="amount"
            label="المبلغ (د.ع) *"
            type="number"
            placeholder="0.00"
            validation={{
              required: "المبلغ مطلوب",
              min: { value: 1000, message: "أقل مبلغ هو 1000 دينار" },
            }}
            span={1}
          />

          <Modal.Select<FormData>
            name="status"
            label="حالة الدفع *"
            placeholder="اختر الحالة"
            options={[
              { value: "مدفوع", label: "مدفوع" },
              { value: "قيد الانتظار", label: "قيد الانتظار" },
              { value: "متوقف", label: "متوقف" },
            ]}
            validation={{ required: "الحالة مطلوبة" }}
            span={1}
          />
        </Modal.Grid>

        {/* Informative note for the admin */}
        {editData?.orphan_name && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--fillColor)]/40 border border-[var(--borderColor)]/20">
            <p className="text-xs text-[var(--subTextColor)]">
              المستفيد:{" "}
              <span className="font-bold text-[var(--primeColor)]">
                {editData.orphan_name}
              </span>
            </p>
          </div>
        )}

        <Modal.Footer submitText="حفظ الدفعة" />
      </Modal.Body>
    </Modal.Root>
  );
}
