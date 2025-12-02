import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Calendar } from "lucide-react";

export const revalidate = 60;

export default async function NewsPage() {
  const { data: news } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'news')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-2">Habitare News</h1>
        <p className="text-gray-500 mb-12">O melhor do design, arquitetura e tendências.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news?.map((post) => (
            <Link href={`/projeto/${post.slug}`} key={post.id} className="group cursor-pointer">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg mb-4">
                <img 
                  src={post.main_image_url} 
                  alt={post.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <Calendar size={12} />
                {new Date(post.created_at).toLocaleDateString()}
              </div>
              <h2 className="text-xl font-bold leading-tight group-hover:text-emerald-700 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                Clique para ler a matéria completa...
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}