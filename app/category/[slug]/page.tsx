import { client } from "@/sanity/lib/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FolderOpen, BookOpen } from "lucide-react"
import Link from "next/link"

const titles: Record<string, string> = {
  "doros": "جميع الدروس والمحاضرات",
  "imtihanat": "جميع الامتحانات والفروض",
  "moubaryat": "مستجدات المباريات والتوظيف",
  "akhbar": "آخر المستجدات والأخبار",
  "tawjih": "التوجيه المدرسي والمهني وأخبار الوزارة", // بدلت العنوان باش يكون معبر
  "2bac": "الثانية باكالوريا",
  "1bac": "الأولى باكالوريا",
  "tc": "الجذع المشترك",
  "3ac": "الثالثة إعدادي",
  "primaire": "التعليم الابتدائي",
  "university": "التعليم الجامعي",
}

async function getPostsStrict(slug: string) {
  let query = "";
  let params: any = { slug };

  // 1. الدروس (Cours ONLY)
  if (slug === "doros") {
    query = `*[_type == "post" && contentType == "cours"] | order(_createdAt desc)`;
  } 
  // 2. الامتحانات (Examen ONLY)
  else if (slug === "imtihanat") {
    query = `*[_type == "post" && contentType == "examen"] | order(_createdAt desc)`;
  } 
  // 3. المباريات (Concours ONLY)
  else if (slug === "moubaryat") {
    query = `*[_type == "post" && (contentType == "concours" || level in ["concours-primaire", "concours-secondaire", "master"])] | order(_createdAt desc)`;
  }
  // 4. التوجيه + الأخبار (هنا التعديل اللي طلبتي ✅)
  else if (slug === "tawjih") {
     // جيب ليا: التوجيه (orientation) + الأخبار (news) + أي حاجة الليفل ديالها tawjih
    query = `*[_type == "post" && (contentType == "orientation" || contentType == "news" || level == "tawjih")] | order(_createdAt desc)`;
  }
  // 5. صفحة خاصة بالأخبار فقط (إلا بغيتيها بوحدها)
  else if (slug === "akhbar") {
    query = `*[_type == "post" && contentType == "news"] | order(_createdAt desc)`;
  }

  // 6. المستويات الدراسية (هنا منعنا الأخبار باش ما تخلطش مع الدروس ✅)
  else {
    let levels = [slug];
    if (slug === "lycee") levels = ["tc", "1bac", "2bac"];
    if (slug === "college") levels = ["1ac", "2ac", "3ac"];
    if (slug === "primaire") levels = ["1ap", "2ap", "3ap", "4ap", "5ap", "6ap"];

    // الشرط: المستوى المحدد AND نوع المحتوى ماشي خبر
    query = `*[_type == "post" && level in $levels && contentType != "news"] | order(_createdAt desc)`;
    params = { levels };
  }

  const finalQuery = query.replace("}", `{
    _id, 
    title, 
    "slug": slug.current, 
    "category": level, 
    "type": contentType,
    "date": _createdAt, 
    "imageUrl": mainImage.asset->url
  }`);

  return await client.fetch(finalQuery, params);
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const articles = await getPostsStrict(slug)
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
                        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-sm">
                          {article.category}
                        </span>
                        {/* بادج النوع */}
                        <span className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded shadow-sm ${article.type === 'news' ? 'bg-red-500' : 'bg-orange-500'}`}>
                          {article.type === 'news' ? 'أخبار' : article.type}
                        </span>
                        </div>
                        <CardContent className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                            {article.title}
                        </h3>
                        <div className="flex items-center justify-between mt-4">
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">لا يوجد محتوى حالياً</h3>
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