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

  // Uses payment_id from the View to ensure the correct record is targeted
  const modalKey = editData?.payment_id
    ? `edit-${editData.payment_id}`
    : "create-new";

  const defaultValues = editData
    ? {
        amount: editData.amount?.toString() || "",
        status: editData.status || "",
      }
    : undefined;

  const handleSubmit = (data: FormData) => {
    const salaryData = {
      amount: parseFloat(data.amount),
      status: data.status,
    };

    if (isEditMode) {
      // mapping view's payment_id to table's primary key 'id'
      updateSalaryMutate(
        { id: editData.payment_id, ...salaryData },
        {
          onSuccess: () => {
            setIsModel(false);
            onSuccess?.();
          },
          onError: (error) => {
            console.error("Update failed:", error);
          },
        },
      );
    } else {
      // Note: If adding a brand new salary, ensure your mutation/table
      // receives sponsor_id and orphan_id as well.
      addSalaryMutate(salaryData, {
        onSuccess: () => {
          setIsModel(false);
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Modal.Root<FormData>
      key={modalKey}
      onClose={() => setIsModel(false)}
      onSubmit={handleSubmit}
      isPending={isPending}
      defaultValues={defaultValues}
      mode={isEditMode ? "edit" : "create"}
      editId={editData?.payment_id}
    >
      <Modal.Header
        title="إضافة دفعة مالية"
        editTitle={
          editData?.sponsor_name
            ? `معالجة كفالة: ${editData.sponsor_name}`
            : "تعديل البيانات"
        }
      />
      <Modal.Body>
        <Modal.Grid cols={2}>
          <Modal.Input<FormData>
            name="amount"
            label="المبلغ *"
            placeholder="0.00"
            validation={{ required: "المبلغ مطلوب" }}
            span={1}
          />

          <Modal.Select<FormData>
            name="status"
            label="الحالة *"
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
        <Modal.Footer />
      </Modal.Body>
    </Modal.Root>
  );
}
