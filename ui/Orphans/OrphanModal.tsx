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

  if (data.residence === "بلا مأوى") priority += 20;
  else if (data.residence === "إيجار") priority += 10;
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

  // Key ensures form resets correctly when switching between different orphans
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
    : {
        fullName: "",
        age: "",
        gender: "",
        orphanType: "",
        povertyLevel: "",
        healthCondition: "",
        educationLevel: "",
        residence: "ملك",
      };

  const onSubmit = (data: FormData) => {
    const orphanData = {
      name: data.fullName,
      age: parseInt(data.age),
      type: data.orphanType,
      priority: calculatePriority(data),
      is_sponsored: editData?.is_sponsored || false,
      residence: data.residence || "بغداد",
      gender: data.gender,
      poverty_level: data.povertyLevel,
      health_condition: data.healthCondition,
      education_level: data.educationLevel,
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
      updateOrphanMutate({ id: editData.id, ...orphanData }, mutationOptions);
    } else {
      addOrphanMutate(orphanData, mutationOptions);
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
      <Modal.Header title="إضافة يتيم جديد" editTitle="تعديل بيانات اليتيم" />

      <Modal.Body>
        <Modal.Grid>
          <Modal.Input<FormData>
            name="fullName"
            label="الاسم الكامل *"
            placeholder="ادخل الاسم الكامل"
            validation={{ required: "الاسم الكامل مطلوب" }}
            span={2} // Name takes full width for better readability
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
          />

          <Modal.Input<FormData>
            name="educationLevel"
            label="المستوى التعليمي *"
            placeholder="مثال: الصف السادس"
            validation={{ required: "المستوى التعليمي مطلوب" }}
            span={2}
          />
        </Modal.Grid>

        <Modal.Footer submitText="حفظ البيانات" loadingText="جاري الحفظ..." />
      </Modal.Body>
    </Modal.Root>
  );
}
