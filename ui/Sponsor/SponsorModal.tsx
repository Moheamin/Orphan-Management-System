import { useState, useEffect } from "react";
import { useAddSponsors } from "../../utils/ReactQuerry/Sponsers/useAddSponsors";
import { Modal } from "../../components/CompundModel";

type FormData = {
  fullName: string;
  phone: string;
  email?: string;
  monthlyAmount: string;
  sponsorshipCount: string;
  status: string;
};

type SponsorModalProps = {
  setIsModel: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
};

export default function SponsorModal({
  setIsModel,
  onSuccess,
}: SponsorModalProps) {
  const [shouldClose, setShouldClose] = useState(false);
  const { addSponsorMutate, isPending, isSuccess } = useAddSponsors();

  // Watch for successful mutation to close modal
  useEffect(() => {
    if (isSuccess && shouldClose) {
      setIsModel(false);
      onSuccess?.();
      setShouldClose(false);
    }
  }, [isSuccess, shouldClose, setIsModel, onSuccess]);

  const handleSubmit = (data: FormData) => {
    const sponsorData = {
      name: data.fullName,
      phone: data.phone,
      email: data.email || null,
      monthlyAmount: data.monthlyAmount,
      sponsorshipCount: data.sponsorshipCount,
      status: data.status,
    };

    addSponsorMutate(sponsorData);
    setShouldClose(true);
  };

  return (
    <Modal.Root<FormData>
      onClose={() => setIsModel(false)}
      onSubmit={handleSubmit}
      isPending={isPending}
      defaultValues={{ status: "نشط", sponsorshipCount: "0" }}
    >
      <Modal.Header title="إضافة كفيل جديد" />

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
            name="phone"
            label="رقم الهاتف"
            type="tel"
            placeholder="05xxxxxxxx"
            validation={{
              required: "رقم الهاتف مطلوب",
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: "رقم الهاتف يجب أن يكون 10-11 رقم",
              },
            }}
            span={1}
          />

          <Modal.Input<FormData>
            name="email"
            label="البريد الإلكتروني (اختياري)"
            type="email"
            placeholder="example@email.com"
            validation={{
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "البريد الإلكتروني غير صحيح",
              },
            }}
            span={2}
          />

          <Modal.Input<FormData>
            name="monthlyAmount"
            label="المبلغ الشهري (دينار)"
            type="number"
            placeholder="1500"
            validation={{
              required: "المبلغ الشهري مطلوب",
              min: { value: 0, message: "المبلغ يجب أن يكون أكبر من 0" },
            }}
            span={1}
          />

          <Modal.Input<FormData>
            name="sponsorshipCount"
            label="عدد الكفالات"
            type="number"
            placeholder="0"
            validation={{
              required: "عدد الكفالات مطلوب",
              min: { value: 0, message: "العدد يجب أن يكون 0 أو أكثر" },
            }}
            span={1}
          />

          <Modal.Select<FormData>
            name="status"
            label="الحالة"
            options={[
              { value: "نشط", label: "نشط" },
              { value: "متوقف", label: "متوقف" },
            ]}
            validation={{ required: "الحالة مطلوبة" }}
            defaultValue="نشط"
            span={2}
          />
        </Modal.Grid>

        <Modal.Footer />
      </Modal.Body>
    </Modal.Root>
  );
}
