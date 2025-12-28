import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* العمود 1: حول الموقع */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">نجاحي برو</h3>
            <p className="text-gray-400 leading-relaxed">
              منصتكم التربوية الأولى في المغرب. نقدم دروساً، ملخصات، وامتحانات لجميع المستويات الدراسية من الابتدائي إلى العالي.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"><Youtube className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* العمود 2: روابط سريعة */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              <li><Link href="/category/doros" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>•</span> جميع الدروس</Link></li>
              <li><Link href="/category/imtihanat" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>•</span> الفروض والامتحانات</Link></li>
              <li><Link href="/category/moubaryat" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>•</span> المباريات والتوظيف</Link></li>
              <li><Link href="/category/tawjih" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>•</span> التوجيه المدرسي</Link></li>
            </ul>
          </div>

          {/* العمود 3: المستويات */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">المستويات الدراسية</h4>
            <ul className="space-y-3">
              <li><Link href="/category/2bac" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>•</span> الثانية باكالوريا</Link></li>
              <li><Link href="/category/1bac" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>•</span> الأولى باكالوريا</Link></li>
              <li><Link href="/category/3ac" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>•</span> الثالثة إعدادي</Link></li>
              <li><Link href="/category/primaire" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>•</span> التعليم الابتدائي</Link></li>
            </ul>
          </div>

          {/* العمود 4: معلومات الاتصال */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                <span>الدار البيضاء، المغرب</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <span>contact@najahipro.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500" />
                <span>+212 600 000 000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-right">
            © 2025 نجاحي برو. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-white transition-colors">شروط الاستخدام</Link>
            <Link href="/about" className="hover:text-white transition-colors">من نحن</Link>
            <Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}