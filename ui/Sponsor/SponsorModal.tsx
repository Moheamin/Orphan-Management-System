import { Modal } from "../../components/CompundModel";
import { useOrphanLookup } from "../../utils/ReactQuerry/orphanLookup";
import { useAddSponsors } from "../../utils/ReactQuerry/Sponsers/useAddSponsors";
import { useUpdateSponsors } from "../../utils/ReactQuerry/Sponsers/useUpdateSponsors";
import { type SponsorFormData, type SponsorPayload } from "../../utils/sponsor";

type SponsorModalProps = {
  setIsModel: React.Dispatch<React.SetStateAction<boolean>>;
  onCompleted?: () => void;
  editData?: {
    id: number;
    orphanId: string;
    name: string;
    phone: string;
    email?: string | null;
    sponsorship_type?: string;
    sponsorship_count?: string;
    status?: string;
  } | null;
};

export default function SponsorModal({
  setIsModel,
  onCompleted,
  editData,
}: SponsorModalProps) {
  const isEditMode = Boolean(editData);
  const { data: orphans } = useOrphanLookup();

  const { addSponsorMutate, isPending: isAddPending } = useAddSponsors();
  const { updateSponsorMutate, isPending: isUpdatePending } =
    useUpdateSponsors();

  const isPending = isAddPending || isUpdatePending;
  const modalKey = editData?.id ? `edit-${editData.id}` : "create-new";

  const defaultValues: Partial<SponsorFormData> = editData
    ? {
        orphanId: editData.orphanId ?? null,
        fullName: editData.name ?? "",
        phone: editData.phone ?? "",
        email: editData.email ?? "",
        sponsorshipType: editData.sponsorship_type,
        sponsorshipCount: editData.sponsorship_count?.toString() ?? "0",
        status: editData.status ?? "نشط",
      }
    : {
        status: "نشط",
        sponsorshipType: "كفالة جزئية",
        sponsorshipCount: "0",
      };

  const handleSubmit = (data: SponsorFormData) => {
    const payload: SponsorPayload = {
      orphanId: data.orphanId,
      name: data.fullName,
      phone: data.phone,
      email: data.email || null,
      sponsorshipType: data.sponsorshipType,
      sponsorshipCount: data.sponsorshipCount,
      status: data.status,
    };

    const mutationOptions = {
      onSuccess: () => {
        setIsModel(false);
        onCompleted?.();
      },
      onError: (err: any) => console.error("Mutation failed:", err),
    };

    if (isEditMode && editData) {
      updateSponsorMutate({ id: editData.id, ...payload }, mutationOptions);
    } else {
      addSponsorMutate(payload as any, mutationOptions);
    }
  };

  return (
    <Modal.Root<SponsorFormData>
      key={modalKey}
      onClose={() => setIsModel(false)}
      onSubmit={handleSubmit}
      isPending={isPending}
      defaultValues={defaultValues}
      mode={isEditMode ? "edit" : "create"}
    >
      <Modal.Header title="إضافة كفيل جديد" editTitle="تعديل بيانات الكفيل" />

      <Modal.Body>
        <Modal.Grid>
          {/* Section: Basic Info */}
          <Modal.Input<SponsorFormData>
            name="fullName"
            label="الاسم الكامل *"
            placeholder="اسم الكفيل الثلاثي"
            validation={{ required: "الاسم مطلوب" }}
          />

          <Modal.Input<SponsorFormData>
            name="phone"
            label="رقم الهاتف *"
            type="tel"
            placeholder="07XXXXXXXX"
            validation={{
              required: "رقم الهاتف مطلوب",
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: "رقم الهاتف غير صحيح",
              },
            }}
          />

          <Modal.Input<SponsorFormData>
            name="email"
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@mail.com"
            span={2}
          />

          {/* Section: Sponsorship Details */}
          <Modal.Select<SponsorFormData>
            name="sponsorshipType"
            label="نوع الكفالة"
            options={[
              { value: "كفالة كاملة", label: "كفالة كاملة" },
              { value: "كفالة جزئية", label: "كفالة جزئية" },
              { value: "كفالة صحية", label: "كفالة صحية" },
              { value: "كفالة دراسة", label: "كفالة دراسة" },
            ]}
            placeholder="اختر نوع الكفالة"
          />

          <Modal.Input<SponsorFormData>
            name="sponsorshipCount"
            label="عدد الكفالات"
            type="number"
            validation={{
              min: { value: 0, message: "لا يمكن أن يكون أقل من 0" },
            }}
          />

          {/* Section: Assignment & Status */}
          <Modal.Select<SponsorFormData>
            name="orphanId"
            label="تعيين يتيم *"
            span={2}
            options={
              orphans?.map((orphan: any) => ({
                value: orphan.id,
                label: orphan.name,
              })) || []
            }
            placeholder="ابحث عن اسم اليتيم لربطه بالكفيل..."
          />

          <Modal.Select<SponsorFormData>
            name="status"
            label="حالة الحساب"
            span={2}
            options={[
              { value: "نشط", label: "نشط" },
              { value: "متوقف", label: "متوقف" },
            ]}
          />
        </Modal.Grid>

        <Modal.Footer submitText="حفظ الكفيل" />
      </Modal.Body>
    </Modal.Root>
  );
}
