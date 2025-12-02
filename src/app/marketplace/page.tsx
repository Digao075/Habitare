import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { User } from "lucide-react";

export const revalidate = 0;

export default async function MarketplacePage() {
  const { data: projects } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'marketplace')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Marketplace de Projetos</h1>
          <p className="text-gray-500">Inspire-se em projetos reais e compre os produtos.</p>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {projects?.map((proj) => (
            <Link href={`/projeto/${proj.slug}`} key={proj.id} className="block break-inside-avoid">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="relative">
                  <img 
                    src={proj.main_image_url} 
                    alt={proj.title} 
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                    Ver Produtos
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{proj.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={12} />
                    </div>
                    {proj.architect_name}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}