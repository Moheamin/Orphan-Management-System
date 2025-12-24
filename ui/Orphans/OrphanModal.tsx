import { useState, useEffect } from "react";
import { useAddOrphans } from "../../utils/ReactQuerry/Orphans/useAddOrphans";
import { Modal } from "../../components/CompundModel";

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
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
};

// Helper function to calculate priority based on form data
function calculatePriority(data: FormData) {
  let priority = 50; // Base priority

  // Age factor (younger = higher priority)
  const age = parseInt(data.age);
  if (age <= 5) priority += 20;
  else if (age <= 10) priority += 15;
  else if (age <= 15) priority += 10;

  // Orphan type factor
  if (data.orphanType === "يتيم الأبوين") priority += 20;
  else if (data.orphanType === "يتيم الاب") priority += 10;

  // Poverty level factor
  if (data.povertyLevel === "no_support") priority += 15;
  else if (data.povertyLevel === "weak") priority += 10;

  // Health condition factor
  if (data.healthCondition === "emergency") priority += 15;
  else if (data.healthCondition === "non_urgent") priority += 5;

  return Math.min(priority, 100); // Cap at 100
}

export default function OrphanModal({
  setIsModal,
  onSuccess,
}: OrphanModalProps) {
  const [shouldClose, setShouldClose] = useState(false);
  const { addOrphanMutate, isPending, isSuccess } = useAddOrphans();

  // Watch for successful mutation to close modal
  useEffect(() => {
    if (isSuccess && shouldClose) {
      setIsModal(false);
      onSuccess?.();
      setShouldClose(false);
    }
  }, [isSuccess, shouldClose, setIsModal, onSuccess]);
  const handleSubmit = (data: FormData) => {
    const orphanData = {
      name: data.fullName,
      age: parseInt(data.age),
      type: data.orphanType,
      priority: calculatePriority(data),
      is_sponsored: false,
      actions: null,
      residence: data.residence || "بغداد",
      gender: data.gender,
      poverty_level: data.povertyLevel,
      health_condition: data.healthCondition,
      education_level: data.educationLevel,
    };

    addOrphanMutate(orphanData);
    setShouldClose(true);
  };

  return (
    <Modal.Root<FormData>
      onClose={() => setIsModal(false)}
      onSubmit={handleSubmit}
      isPending={isPending}
    >
      <Modal.Header title="إضافة يتيم جديد" />

      <Modal.Body>
        <Modal.Grid cols={2}>
          <Modal.Input<FormData>
            name="fullName"
            label="الاسم الكامل"
            placeholder="ادخل الاسم الكامل"
            validation={{ required: "الاسم الكامل مطلوب" }}
            span={1}
          />

          <Modal.Input<FormData>
            name="age"
            label="العمر"
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
            label="الجنس"
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
            label="نوع اليتم"
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
            label="درجة الفقر"
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
            label="الحالة الصحية"
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
            label="السكن"
            placeholder="اختر السكن"
            options={[
              { value: "Rent", label: "إيجار" },
              { value: "House", label: "منزل" },
              { value: "Homeless", label: "مشرد" },
            ]}
            validation={{ required: "الحالة الصحية مطلوبة" }}
            span={1}
          />
          <Modal.Input<FormData>
            name="educationLevel"
            label="المستوى التعليمي"
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
