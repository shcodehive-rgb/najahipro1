import { client } from "@/sanity/lib/client" // تأكد من المسار
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FolderOpen, BookOpen, GraduationCap } from "lucide-react"
import Link from "next/link"

// 1. إعدادات المستويات (Levels)
// هنا كنجمعو المستويات الدراسية
const levelGroups: Record<string, string[]> = {
  // --- تجميعات المراحل ---
  "primaire": ["1ap", "2ap", "3ap", "4ap", "5ap", "6ap"],
  "college":  ["1ac", "2ac", "3ac"],
  "lycee":    ["tc", "1bac", "2bac"],
  "university": ["university"],
  
  // --- تجميعات المباريات والتوجيه ---
  "moubaryat": ["concours-primaire", "concours-secondaire", "master"],
  "tawjih": ["tawjih"]
}

// 2. إعدادات أنواع المحتوى (Content Types)
// ⚠️ هام: هاد الكلمات (cours, examen...) خاصها تكون هي نفسها اللي عندك فـ Sanity Value
const typeGroups: Record<string, string> = {
  "doros": "cours",       // رابط "الدروس" غايجيب type == cours
  "imtihanat": "examen",  // رابط "الامتحانات" غايجيب type == examen
  "akhbar": "news"        // رابط "الأخبار"
}

// عناوين الصفحات (للعرض فقط)
const titles: Record<string, string> = {
  "doros": "جميع الدروس والمحاضرات",
  "imtihanat": "جميع الامتحانات والفروض",
  "moubaryat": "مستجدات المباريات والتوظيف",
  "tawjih": "التوجيه المدرسي والمهني",
  "2bac": "الثانية باكالوريا",
  "1bac": "الأولى باكالوريا",
  "3ac": "الثالثة إعدادي",
  "primaire": "التعليم الابتدائي",
  "college": "التعليم الإعدادي",
  "lycee": "التعليم الثانوي التأهيلي",
  "university": "التعليم الجامعي",
}

// دالة الجلب الذكية (كتفهم واش بغيتي مستوى ولا نوع محتوى)
async function getPostsSmart(slug: string) {
  // واش هاد الـ Slug كيعني "نوع محتوى" (بحال doros)؟
  const contentType = typeGroups[slug];
  
  // واش هاد الـ Slug كيعني "مجموعة مستويات" (بحال lycee)؟
  const levels = levelGroups[slug] || [slug]; // إلا مالقاش المجموعة، كيعتبرو مستوى فردي (مثلاً 1bac)

  let query = "";
  let params: any = {};

  if (contentType) {
    // 🅰️ الحالة 1: الزائر ضغط على "الدروس" أو "الامتحانات"
    // كنجيبو ليه كاع المقالات اللي عندها هاد النوع، بغض النظر عن المستوى
    // ⚠️ ملاحظة: تأكد أن اسم الحقل فـ Sanity هو 'contentType' أو 'type'
    // إلا كان سميتو شي حاجة أخرى، بدلها هنا 👇
    query = `*[_type == "post" && contentType == $contentType] | order(_createdAt desc) {
      _id, title, "slug": slug.current, "category": level, 
      "date": _createdAt, "imageUrl": mainImage.asset->url
    }`;
    params = { contentType };
  } else {
    // 🅱️ الحالة 2: الزائر ضغط على "1bac" أو "lycee"
    // كنجيبو ليه كاع المقالات ديال هاد المستويات (دروس + امتحانات)
    query = `*[_type == "post" && level in $levels] | order(_createdAt desc) {
      _id, title, "slug": slug.current, "category": level, 
      "date": _createdAt, "imageUrl": mainImage.asset->url
    }`;
    params = { levels };
  }

  return await client.fetch(query, params);
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const articles = await getPostsSmart(slug)
  const pageTitle = titles[slug] || slug

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8">
                <div className="mb-8 border-b pb-4 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FolderOpen className="w-8 h-8 text-blue-600" />
                        {pageTitle}
                    </h1>
                    <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
                      {articles.length} موضوع
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.length > 0 ? (
                    articles.map((article: any) => (
                    <Card key={article._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-gray-100">
                        <div className="relative overflow-hidden h-48 bg-gray-100">
                        {article.imageUrl ? (
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50 font-bold text-xl opacity-50">NAJAHIPRO</div>
                        )}
                        {/* بادج صغير كيبين المستوى فوق الصورة */}
                        <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                          {article.category}
                        </span>
                        </div>
                        <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                            {article.title}
                        </h3>
                        <div className="flex items-center justify-between mt-4">
                            {/* 👇 هنا صلحنا الرابط ولا بـ Slug */}
                            <Link href={`/blog/${article.slug}`}>
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold gap-1 text-sm">
                                اقرأ المزيد <ArrowLeft className="w-4 h-4" />
                            </Button>
                            </Link>
                            <span className="text-xs text-gray-400">{new Date(article.date).toLocaleDateString('ar-MA')}</span>
                        </div>
                        </CardContent>
                    </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                          <BookOpen className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد مقالات في هذا القسم</h3>
                        <p className="text-gray-500 mb-8">نحن نعمل على إضافة المحتوى قريباً.</p>
                        <Link href="/"><Button className="bg-blue-600 hover:bg-blue-700">العودة للرئيسية</Button></Link>
                    </div>
                )}
                </div>
            </div>

            <aside className="lg:col-span-4 space-y-8">
                <Sidebar />
            </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}