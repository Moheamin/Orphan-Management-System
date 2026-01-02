import { Modal } from "../../components/CompundModel";
import { useAddOrphans } from "../../utils/ReactQuerry/Orphans/useAddOrphans";
import { useUpdateOrphans } from "../../utils/ReactQuerry/Orphans/useUpdateOrphans";

type FormData = {
  fullName: string;
  age: string;
  gender: string;
  orphanType: string;
  povertyLevel: string;
  healthCondition: string;
  educationLevel: string;
  residence?: string;
};

type OrphanModalProps = {
  setIsModel: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
  editData?: any | null;
};

function calculatePriority(data: FormData) {
  let priority = 10;
  const age = parseInt(data.age);
  if (age <= 5) priority += 20;
  else if (age <= 10) priority += 15;
  else if (age <= 15) priority += 10;

  if (data.orphanType === "يتيم الأبوين") priority += 20;
  else if (data.orphanType === "يتيم الأب") priority += 10;

  if (data.povertyLevel === "no_support") priority += 15;
  else if (data.povertyLevel === "weak") priority += 10;

  if (data.healthCondition === "emergency") priority += 15;
  else if (data.healthCondition === "non_urgent") priority += 5;

  if (data.residence === "homeless") priority += 20;
  else if (data.residence === "rent") priority += 10;
  else priority += 5;

  return Math.min(priority, 100);
}

export default function OrphanModal({
  setIsModel,
  onSuccess,
  editData,
}: OrphanModalProps) {
  const isEditMode = !!editData;

  const { addOrphanMutate, isPending: isAddPending } = useAddOrphans();
  const { updateOrphanMutate, isPending: isUpdatePending } = useUpdateOrphans();

  const isPending = isAddPending || isUpdatePending;

  // ✅ Generate a unique key to force form remount when editData changes
  const modalKey = editData?.id ? `edit-${editData.id}` : "create-new";

  const defaultValues = editData
    ? {
        fullName: editData.name ?? "",
        age: editData.age?.toString() ?? "",
        gender: editData.gender ?? "",
        orphanType: editData.type ?? "",
        povertyLevel: editData.poverty_level ?? "",
        healthCondition: editData.health_condition ?? "",
        educationLevel: editData.education_level ?? "",
        residence: editData.residence ?? "",
      }
    : undefined;

  const handleSubmit = (data: FormData) => {
    const orphanData = {
      name: data.fullName,
      age: parseInt(data.age),
      type: data.orphanType,
      priority: calculatePriority(data),
      is_sponsored: editData?.is_sponsored || false,
      actions: null,
      residence: data.residence || "بغداد",
      gender: data.gender,
      poverty_level: data.povertyLevel,
      health_condition: data.healthCondition,
      education_level: data.educationLevel,
    };

    if (isEditMode) {
      updateOrphanMutate(
        { id: editData.id, ...orphanData },
        {
          onSuccess: () => {
            setIsModel(false);
            onSuccess?.();
          },
          onError: (error) => {
            console.error("Update failed:", error);
          },
        }
      );
    } else {
      addOrphanMutate(orphanData, {
        onSuccess: () => {
          setIsModel(false);
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Add failed:", error);
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
      editId={editData?.id}
    >
      <Modal.Header title="إضافة يتيم جديد" editTitle="تعديل بيانات اليتيم" />
      <Modal.Body>
        <Modal.Grid cols={2}>
          <Modal.Input<FormData>
            name="fullName"
            label="الاسم الكامل *"
            placeholder="ادخل الاسم الكامل"
            validation={{ required: "الاسم الكامل مطلوب" }}
            span={1}
          />
          <Modal.Input<FormData>
            name="age"
            label="العمر *"
            type="number"
            placeholder="ادخل العمر"
            validation={{
              required: "العمر مطلوب",
              min: { value: 1, message: "العمر يجب أن يكون أكبر من 0" },
              max: { value: 18, message: "العمر يجب أن يكون أقل من 18" },
            }}
            span={1}
          />
          <Modal.Select<FormData>
            name="gender"
            label="الجنس *"
            placeholder="اختر الجنس"
            options={[
              { value: "male", label: "ذكر" },
              { value: "female", label: "أنثى" },
            ]}
            validation={{ required: "الجنس مطلوب" }}
            span={1}
          />
          <Modal.Select<FormData>
            name="orphanType"
            label="نوع اليتم *"
            placeholder="اختر نوع اليتم"
            options={[
              { value: "يتيم الأب", label: "يتيم الأب" },
              { value: "يتيم الأبوين", label: "يتيم الأبوين" },
            ]}
            validation={{ required: "نوع اليتم مطلوب" }}
            span={1}
          />
          <Modal.Select<FormData>
            name="povertyLevel"
            label="درجة الفقر *"
            placeholder="اختر درجة الفقر"
            options={[
              { value: "no_support", label: "بلا معيل" },
              { value: "weak", label: "ضعيف" },
            ]}
            validation={{ required: "درجة الفقر مطلوبة" }}
            span={1}
          />
          <Modal.Select<FormData>
            name="healthCondition"
            label="الحالة الصحية *"
            placeholder="اختر الحالة الصحية"
            options={[
              { value: "emergency", label: "حالة طارئة" },
              { value: "non_urgent", label: "حالة غير عاجلة" },
            ]}
            validation={{ required: "الحالة الصحية مطلوبة" }}
            span={1}
          />
          <Modal.Select<FormData>
            name="residence"
            label="السكن *"
            placeholder="اختر طبيعة السكن"
            options={[
              { value: "ملك", label: "ملك " },
              { value: "إيجار", label: "إيجار" },
              { value: "بلا مأوى", label: "بلا مأوى" },
            ]}
            validation={{ required: "السكن مطلوب" }}
            span={1}
          />
          <Modal.Input<FormData>
            name="educationLevel"
            label="المستوى التعليمي *"
            placeholder="مثال: الصف السادس"
            validation={{ required: "المستوى التعليمي مطلوب" }}
            span={2}
          />
        </Modal.Grid>
        <Modal.Footer />
      </Modal.Body>
    </Modal.Root>
  );
}
