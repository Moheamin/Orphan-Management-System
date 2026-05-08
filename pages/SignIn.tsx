import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import "../src/index.css";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  User,
  Heart,
  Users,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../utils/Supabase/Auth/signin";
import { resetPassword } from "../utils/Supabase/Auth/resetPassword";
import { useAuthUser } from "../utils/Supabase/Auth/useAuthUser";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthUser();

  // حسابات التجربة السريعة
  const QUICK_ACCOUNTS = [
    {
      label: "مدير النظام",
      email: "moheamin852@gmail.com",
      pass: "hemo2004",
      icon: <ShieldCheck size={16} />,
    },
    {
      label: "مشرف الأيتام",
      email: "fatimazahra9@gmail.com",
      pass: "FatimA313",
      icon: <Heart size={16} />,
    },
    {
      label: "مشرف الكفلاء",
      email: "mohamadali313@gmail.com",
      pass: "MohamaD313",
      icon: <Users size={16} />,
    },
    {
      label: "مستخدم",
      email: "moheamin07@gmail.com",
      pass: "hemo2710",
      icon: <User size={16} />,
    },
  ];

  // التحقق من حالة تسجيل الدخول
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  // وظيفة تسجيل الدخول الموحدة
  const performSignIn = async (eEmail: string, ePass: string) => {
    setLoading(true);
    setError("");
    try {
      await signIn({ email: eEmail.trim(), password: ePass });
      setSuccess(true);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول اليدوي
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !isEmailValid || !password || !isPasswordValid) {
      setError(
        "يرجى التأكد من إدخال بريد إلكتروني صحيح وكلمة مرور (6 أحرف على الأقل)",
      );
      return;
    }
    performSignIn(email, password);
  };

  // تسجيل الدخول السريع (الأزرار الأربعة)
  const handleQuickSignIn = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    performSignIn(quickEmail, quickPass);
  };

  // استعادة كلمة المرور
  const handleReset = async () => {
    setError("");
    setResetSent(false);
    if (!email.trim() || !isEmailValid) {
      setError("يرجى إدخال بريد إلكتروني صحيح أولاً لإرسال رابط الاستعادة");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || "حدث خطأ في إرسال رابط إعادة التعيين");
    } finally {
      setLoading(false);
    }
  };

  // شاشة التحميل الأولية
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--backgroundColor)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primeColor)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[var(--primeColor)]/5 via-[var(--fillColor)]/40 to-[var(--backgroundColor)] p-4"
    >
      <div className="w-full max-w-md p-7 md:p-8 space-y-6 bg-[var(--backgroundColor)] rounded-3xl shadow-[var(--cardShadow)] border border-[var(--borderColor)] animate-fadeIn">
        {/* الترويسة */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primeColor)]/10 mb-1">
            <Lock size={28} className="text-[var(--primeColor)]" />
          </span>
          <h2 className="text-2xl font-bold text-[var(--textColor)]">
            تسجيل الدخول
          </h2>
          <p className="text-xs text-[var(--textMuted)]">
            مرحبًا بعودتك! اختر حساباً للتجربة أو أدخل بياناتك
          </p>
        </div>

        {/* قسم الوصول السريع (الأزرار الأربعة) */}
        <div className="grid grid-cols-2 gap-2.5">
          {QUICK_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => handleQuickSignIn(acc.email, acc.pass)}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] hover:border-[var(--primeColor)] hover:bg-[var(--primeColor)]/5 transition-all duration-200 group disabled:opacity-50"
            >
              <span className="text-[var(--primeColor)] opacity-70 group-hover:opacity-100 transition-opacity">
                {acc.icon}
              </span>
              <span className="text-[11px] font-bold text-[var(--textColor)]">
                {acc.label}
              </span>
            </button>
          ))}
        </div>

        {/* فاصل مرئي */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--borderColor)]"></span>
          </div>
          <div className="relative flex justify-center text-[10px] font-medium">
            <span className="bg-[var(--backgroundColor)] px-3 text-[var(--textMuted)]">
              أو عبر البريد الإلكتروني
            </span>
          </div>
        </div>

        {/* نموذج تسجيل الدخول اليدوي */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--primeColor)] opacity-60"
              size={18}
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] text-sm text-[var(--textColor)] focus:outline-none focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="relative flex items-center">
            <Lock
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--primeColor)] opacity-60"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              className="w-full px-11 py-2.5 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] text-sm text-[var(--textColor)] focus:outline-none focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute left-3.5 text-[var(--textMuted)] hover:text-[var(--primeColor)] transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* رسائل التنبيه والنجاح */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs animate-shake">
              <AlertCircle size={14} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs">
              <p>تم تسجيل الدخول بنجاح، جاري التوجيه...</p>
            </div>
          )}
          {resetSent && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs">
              <p>تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.</p>
            </div>
          )}

          <Button
            type="submit"
            adj="w-full py-3 rounded-xl bg-[var(--primeColor)] text-white font-bold text-sm shadow-md hover:brightness-105 hover:shadow-lg transition-all transform active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>جاري المعالجة...</span>
              </div>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>

        {/* التذييل (إنشاء حساب + نسيت كلمة المرور) */}
        <div className="text-center pt-4 border-t border-[var(--borderColor)] flex flex-col gap-3">
          <span className="text-xs text-[var(--textMuted)]">
            ليس لديك حساب؟{" "}
            <Link
              to="/signup"
              className="text-[var(--primeColor)] font-bold hover:underline underline-offset-4 transition-all"
            >
              إنشاء حساب جديد
            </Link>
          </span>

          <button
            type="button"
            className="text-xs text-[var(--textMuted)] hover:text-[var(--primeColor)] transition-colors hover:underline underline-offset-4 disabled:opacity-50"
            onClick={handleReset}
            disabled={loading}
          >
            نسيت كلمة المرور؟
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
