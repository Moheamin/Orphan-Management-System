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

  /* ================= ADD ================= */
  const { addSponsorMutate, isPending: isAddPending } = useAddSponsors();

  /* ================= UPDATE ================= */
  const { updateSponsorMutate, isPending: isUpdatePending } =
    useUpdateSponsors();

  const isPending = isAddPending || isUpdatePending;

  // ✅ Generate a unique key to force form remount when editData changes
  const modalKey = editData?.id ? `edit-${editData.id}` : "create-new";

  /* ================= DEFAULT VALUES ================= */
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

  /* ================= SUBMIT ================= */
  const handleSubmit = (data: SponsorFormData) => {
    // Convert form data -> API payload
    const payload: SponsorPayload = {
      orphanId: data.orphanId,
      name: data.fullName,
      phone: data.phone,
      email: data.email || null,
      sponsorshipType: data.sponsorshipType,
      sponsorshipCount: data.sponsorshipCount,
      status: data.status,
    };
    if (isEditMode && editData) {
      updateSponsorMutate(
        { id: editData.id, ...payload },
        {
          onSuccess: () => {
            setIsModel(false);
            onCompleted?.();
          },
          onError: (error) => {
            console.error("Update failed:", error);
          },
        },
      );
    } else {
      addSponsorMutate(payload as any, {
        onSuccess: () => {
          setIsModel(false);
          onCompleted?.();
        },
        onError: (error) => {
          console.error("Add failed:", error);
        },
      });
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
      editId={editData?.id}
    >
      <Modal.Header title="إضافة كفيل جديد" editTitle="تعديل بيانات الكفيل" />

      <Modal.Body>
        <Modal.Grid cols={2}>
          <Modal.Input
            name="fullName"
            label="الاسم الكامل *"
            validation={{ required: "الاسم مطلوب" }}
          />

          <Modal.Input
            name="phone"
            label="رقم الهاتف *"
            type="tel"
            validation={{
              required: "رقم الهاتف مطلوب",
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: "رقم الهاتف غير صحيح",
              },
            }}
          />

          <Modal.Input
            name="email"
            label="البريد الإلكتروني"
            type="email"
            span={2}
          />

          <Modal.Select
            name="sponsorshipType"
            label="نوع الكفالة"
            span={2}
            options={[
              { value: "كفالة كاملة", label: "كفالة كاملة" },
              { value: "كفالة جزئية", label: "كفالة جزئية" },
              { value: "كفالة صحية", label: "كفالة صحية" },
              { value: "كفالة دراسة", label: "كفالة دراسة" },
            ]}
            placeholder="اختر نوع الكفالة"
          />

          <Modal.Input
            name="sponsorshipCount"
            label="عدد الكفالات"
            type="number"
          />

          <Modal.Select
            name="orphanId"
            label="اختيار يتيم"
            span={2}
            options={
              orphans?.map((orphan: any) => ({
                value: orphan.id,
                label: orphan.name,
              })) || []
            }
            placeholder="يرجى أختيار يتيم ..."
          />
          <Modal.Select
            name="status"
            label="الحالة"
            span={2}
            options={[
              { value: "نشط", label: "نشط" },
              { value: "متوقف", label: "متوقف" },
            ]}
          />
        </Modal.Grid>

        <Modal.Footer />
      </Modal.Body>
    </Modal.Root>
  );
}
