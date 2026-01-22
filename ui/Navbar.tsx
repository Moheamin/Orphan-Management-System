import {
  Baby,
  DollarSign,
  FileText,
  Heart,
  Home,
  Settings,
  Users,
} from "lucide-react";
import MyIcon from "../components/MyIcon";
import Button from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

type NavbarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const navItems = [
  { icon: Home, label: "لوحة التحكم", path: "/" },
  { icon: Users, label: "الأيتام", path: "/orphans" },
  { icon: Baby, label: "الكفلاء", path: "/sponsors" },
  { icon: Heart, label: "الكفالات", path: "/sponsorships" },
  { icon: DollarSign, label: "الرواتب الشهرية", path: "/salaries" },
  { icon: Settings, label: "الإعدادات", path: "/settings" },
];

export default function Navbar({ isOpen, setIsOpen }: NavbarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 cursor-pointer"
          />

          {/* Navbar */}
          <motion.aside
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 1, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
            }}
            className="fixed top-0 left-0 h-full w-64
            bg-[var(--backgroundColor)]
            border-2 border-[var(--borderColor)]
            flex flex-col justify-between px-2 z-40 shadow-xl"
          >
            <div>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-right flex flex-row gap-3 items-end justify-end
                my-[19px] border-b-2 border-[var(--borderColor)] pb-4"
              >
                <div className="flex flex-col items-end justify-end mr-2">
                  <h1 className="text-xl font-semibold text-[var(--textColor)]">
                    إدارة الأيتام
                  </h1>
                  <p className="text-[var(--textMuted)] text-sm">مؤسسة خيرية</p>
                </div>
                <div className="mr-4.5">
                  <MyIcon size={48} shape="rounded" color="var(--primeColor)">
                    <Heart size={24} color="white" />
                  </MyIcon>
                </div>
              </motion.div>

              {/* Navigation Items */}
              <div className="flex flex-col items-end justify-end mt-10 gap-4 mr-5">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + index * 0.05,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="w-full"
                  >
                    <NavLink
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `w-full block ${
                          isActive
                            ? "ring-2 ring-[var(--primeColor)] rounded-[20px]"
                            : ""
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <motion.div
                          whileHover={{ scale: 1.02, x: -5 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full"
                        >
                          <Button
                            adj={`w-full pl-20 pr-5 py-4 flex items-center justify-end gap-2
                            text-white rounded-[20px] cursor-pointer transition-all ${
                              isActive
                                ? "bg-[var(--primeColor)] shadow-lg"
                                : "bg-[var(--primeColor)]"
                            }`}
                          >
                            <span className="text-sm whitespace-nowrap">
                              {item.label}
                            </span>
                            <item.icon
                              size={16}
                              color="white"
                              className="flex-shrink-0"
                            />
                          </Button>
                        </motion.div>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="w-full bg-[var(--backgroundColor)]
              border-t-2 border-[var(--borderColor)]
              p-2 flex flex-col items-center justify-center"
            >
              <span className="text-[var(--textMuted)] w-full flex items-center justify-center mt-4 text-md">
                مهيمن رائد حميد
              </span>
            </motion.footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
