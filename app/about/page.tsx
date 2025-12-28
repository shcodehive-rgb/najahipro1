import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Target, Users, BookOpen, Star } from "lucide-react"

export const metadata = {
  title: "من نحن | نجاحي برو",
  description: "تعرف على فريق ورؤية منصة نجاحي برو للدعم التربوي في المغرب.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* قسم العنوان */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
             من نحن؟
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            منصة "نجاحي برو" هي بوابتك الأولى نحو التفوق الدراسي والنجاح المهني في المغرب.
          </p>
        </div>

        {/* قسم المحتوى الرئيسي */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6 text-lg text-gray-700 leading-loose">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">رؤيتنا</h2>
            <p>
              تأسست منصة <strong>نجاحي برو</strong> بهدف سد الفجوة في المحتوى التعليمي الرقمي في المغرب. نحن نؤمن بأن التعليم الجيد يجب أن يكون متاحاً للجميع، في أي وقت وفي أي مكان.
            </p>
            <p>
              نطمح لأن نكون المرجع الأول للتلميذ والطالب المغربي، من التعليم الابتدائي وصولاً إلى التعليم الجامعي ومباريات التوظيف، من خلال توفير محتوى دقيق، مبسط، ومواكب للمستجدات.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="font-bold block">دروس شاملة</span>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <span className="font-bold block">توجيه دقيق</span>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-2xl">
              <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <span className="font-bold block">جودة عالية</span>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-2xl">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <span className="font-bold block">مجتمع داعم</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-6">لماذا نجاحي برو؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
             <div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">1. محتوى محين وموثوق</h3>
                <p className="text-gray-600">يتم مراجعة وتحديث جميع الدروس والامتحانات بشكل دوري لتوافق المقررات الوزارية الجديدة.</p>
             </div>
             <div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">2. سهولة الوصول</h3>
                <p className="text-gray-600">تصميم بسيط وسريع يسمح لك بالوصول إلى المعلومة التي تبحث عنها في ثوانٍ معدودة.</p>
             </div>
             <div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">3. مجانية التعليم</h3>
                <p className="text-gray-600">نؤمن بأن العلم حق للجميع، لذلك نوفر أغلب خدماتنا بشكل مجاني تماماً لدعم تكافؤ الفرص.</p>
             </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">انضم إلى رحلة النجاح</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              سواء كنت تلميذاً، طالباً، أو باحثاً عن عمل، نحن هنا لدعمك في كل خطوة.
            </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}