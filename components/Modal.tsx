import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useEditOrphans } from "../utils/reactQurry";

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

type ModelProps = {
  setIsModel: React.Dispatch<React.SetStateAction<boolean>>;
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
  if (data.orphanType === "يتيم الأبوين") priority += 20; // Both parents
  else if (data.orphanType === "يتيم الاب") priority += 10; // Father only

  // Poverty level factor
  if (data.povertyLevel === "no_support") priority += 15;
  else if (data.povertyLevel === "weak") priority += 10;

  // Health condition factor
  if (data.healthCondition === "emergency") priority += 15;
  else if (data.healthCondition === "non_urgent") priority += 5;

  return Math.min(priority, 100); // Cap at 100
}

export default function Modal({ setIsModel, onSuccess }: ModelProps) {
  const [error, setError] = useState<string | null>(null);

  // Use React Query mutation hook
  const { editOrphanMutate, isPending } = useEditOrphans();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError(null);

    // Map form data to match your database structure
    const orphanData = {
      name: data.fullName,
      age: parseInt(data.age),
      type: data.orphanType,
      priority: calculatePriority(data).toString(),
      is_sponsored: false,
      actions: null,
      residence: data.residence || "بغداد",
    };

    // Use the mutation function from React Query
    editOrphanMutate(orphanData, {
      onSuccess: () => {
        reset();
        setIsModel(false);
        onSuccess?.(); // Call onSuccess callback if provided
      },
      onError: (err) => {
        setError("حدث خطأ أثناء الحفظ. الرجاء المحاولة مرة أخرى.");
        console.error("Error inserting data:", err);
      },
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-30 cursor-pointer flex items-center justify-center p-4"
      onClick={() => setIsModel(false)}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            إضافة يتيم جديد
          </h2>
          <button
            onClick={() => setIsModel(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                {...register("fullName", { required: "الاسم الكامل مطلوب" })}
                placeholder="ادخل الاسم الكامل"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Age */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العمر
              </label>
              <input
                type="number"
                {...register("age", {
                  required: "العمر مطلوب",
                  min: { value: 1, message: "العمر يجب أن يكون أكبر من 0" },
                  max: { value: 18, message: "العمر يجب أن يكون أقل من 18" },
                })}
                placeholder="ادخل العمر"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الجنس
              </label>
              <select
                {...register("gender", { required: "الجنس مطلوب" })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition appearance-none"
                defaultValue=""
              >
                <option value="" disabled>
                  اختر الجنس
                </option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Orphan Type */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع اليتم
              </label>
              <select
                {...register("orphanType", { required: "نوع اليتم مطلوب" })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition appearance-none"
                defaultValue=""
              >
                <option value="" disabled>
                  اختر نوع اليتم
                </option>
                <option value="يتيم الاب">يتيم الأب</option>
                <option value="يتيم الأبوين">يتيم الأبوين</option>
              </select>
              {errors.orphanType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.orphanType.message}
                </p>
              )}
            </div>

            {/* Poverty Level */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                درجة الفقر
              </label>
              <select
                {...register("povertyLevel", { required: "درجة الفقر مطلوبة" })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition appearance-none"
                defaultValue=""
              >
                <option value="" disabled>
                  اختر درجة الفقر
                </option>
                <option value="no_support">بلا معيل</option>
                <option value="weak">ضعيف</option>
              </select>
              {errors.povertyLevel && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.povertyLevel.message}
                </p>
              )}
            </div>

            {/* Health Condition */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة الصحية
              </label>
              <select
                {...register("healthCondition", {
                  required: "الحالة الصحية مطلوبة",
                })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition appearance-none"
                defaultValue=""
              >
                <option value="" disabled>
                  اختر الحالة الصحية
                </option>
                <option value="emergency">حالة طارئة</option>
                <option value="non_urgent">حالة غير عاجلة</option>
              </select>
              {errors.healthCondition && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.healthCondition.message}
                </p>
              )}
            </div>

            {/* Education Level */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المستوى التعليمي
              </label>
              <input
                type="text"
                {...register("educationLevel", {
                  required: "المستوى التعليمي مطلوب",
                })}
                placeholder="مثال: الصف السادس"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
              {errors.educationLevel && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.educationLevel.message}
                </p>
              )}
            </div>

            {/* Residence - Optional field */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السكن
              </label>
              <input
                type="text"
                {...register("residence")}
                placeholder="مثال: بغداد"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6 justify-end">
            <button
              type="button"
              onClick={() => setIsModel(false)}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              disabled={isPending}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
