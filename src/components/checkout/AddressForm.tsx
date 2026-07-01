// src/components/checkout/AddressForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInput } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EGYPT_CITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AddressFormProps {
  defaultValues?: Partial<AddressInput>;
  onSubmit:       (data: AddressInput) => void;
  loading?:       boolean;
  submitLabel?:   string;
}

export function AddressForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = "حفظ والمتابعة",
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "مصر", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" dir="rtl">

      {/* الاسم والهاتف */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="الاسم الكامل"
          placeholder="محمد أحمد"
          error={errors.fullName?.message}
          required
          {...register("fullName")}
        />
        <Input
          label="رقم الهاتف"
          placeholder="01012345678"
          error={errors.phone?.message}
          required
          type="tel"
          {...register("phone")}
        />
      </div>

      {/* الدولة والمدينة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* الدولة — ثابتة */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#EDE8DF] font-[Tajawal]">
            الدولة <span className="text-[#D07070]">*</span>
          </label>
          <div className="bg-[#121212] border border-[#1A1A1A] rounded-lg px-4 py-2.5 text-sm text-[#484542] font-[Tajawal] cursor-not-allowed">
            🇪🇬 مصر
          </div>
        </div>

        {/* المدينة */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#EDE8DF] font-[Tajawal]">
            المدينة <span className="text-[#D07070]">*</span>
          </label>
          <select
            {...register("city")}
            className={cn(
              "w-full bg-[#121212] border rounded-lg px-4 py-2.5 text-sm font-[Tajawal]",
              "text-[#EDE8DF] focus:outline-none focus:border-[#C9A86E] transition-all",
              errors.city ? "border-[#D07070]" : "border-[#1A1A1A]"
            )}
          >
            <option value="">اختر المدينة</option>
            {EGYPT_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && (
            <p className="text-xs text-[#D07070] font-[Tajawal]">⚠ {errors.city.message}</p>
          )}
        </div>
      </div>

      {/* الحي */}
      <Input
        label="الحي"
        placeholder="مثال: المهندسين، الزمالك..."
        error={errors.district?.message}
        required
        {...register("district")}
      />

      {/* الشارع */}
      <Input
        label="عنوان الشارع"
        placeholder="مثال: ٢٤ شارع التحرير"
        error={errors.street?.message}
        required
        {...register("street")}
      />

      {/* رقم المبنى والرمز البريدي */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="رقم المبنى / الشقة"
          placeholder="مثال: عمارة ٥، شقة ١٢"
          error={errors.buildingNumber?.message}
          {...register("buildingNumber")}
        />
        <Input
          label="الرمز البريدي"
          placeholder="مثال: 12511"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
      </div>

      {/* ملاحظات إضافية */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#EDE8DF] font-[Tajawal]">
          ملاحظات للمندوب (اختياري)
        </label>
        <textarea
          {...register("additionalInfo")}
          rows={3}
          placeholder="مثال: الرجاء الاتصال قبل التسليم..."
          className="w-full bg-[#121212] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-[#EDE8DF] font-[Tajawal] placeholder:text-[#484542] focus:outline-none focus:border-[#C9A86E] resize-none transition-all"
        />
      </div>

      {/* حفظ كعنوان افتراضي */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input type="checkbox" className="sr-only peer" {...register("isDefault")} />
          <div className="w-5 h-5 rounded border-2 border-[#262626] peer-checked:bg-[#C9A86E] peer-checked:border-[#C9A86E] transition-all" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#060606" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <span className="text-sm text-[#8A8480] font-[Tajawal] group-hover:text-[#EDE8DF] transition-colors">
          حفظ كعنوان افتراضي
        </span>
      </label>

      <Button type="submit" fullWidth size="lg" loading={loading}>
        {submitLabel}
      </Button>
    </form>
  );
}

export default AddressForm;
