import { ShoppableImage, ProductTag } from "@/components/ui/ShoppableImage";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, Newspaper, ShoppingBag } from "lucide-react";

async function getFeaturedProject() {
  const { data: post, error: postError } = await supabase
    .from('posts') 
    .select('*')
    .eq('category', 'marketplace')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (postError || !post) {
    console.error("Home: Nenhum projeto destaque encontrado.", postError);
    return null;
  }
  const { data: hotspots, error: hotspotsError } = await supabase
    .from('hotspots')
    .select(`
      id,
      x_position,
      y_position,
      products (
        name,
        brand,
        price,
        image_url
      )
    `)
    .eq('project_id', post.id);

  if (hotspotsError) {
    console.error("Home: Erro ao buscar hotspots.", hotspotsError);
    return null;
  }

  const formattedTags: ProductTag[] = hotspots.map((h: any) => ({
    id: h.id,
    x: h.x_position,
    y: h.y_position,
    product: {
      name: h.products.name,
      brand: h.products.brand,
      price: h.products.price,
      image_url: h.products.image_url,
      link: '#' 
    }
  }));

  return { post, formattedTags };
}

export const revalidate = 0; 

export default async function Home() {
  const data = await getFeaturedProject();

  return (
    <main className="min-h-screen bg-white font-sans">
      
      <section className="p-4 md:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">Destaque da Semana</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
                {data ? data.post.title : "Bem-vindo à Habitare"}
              </h1>
            </div>
            {data && (
              <Link 
                href={`/projeto/${data.post.slug}`} 
                className="hidden md:flex items-center gap-2 text-sm font-bold border-b-2 border-black hover:text-emerald-600 hover:border-emerald-600 transition"
              >
                Ver Projeto Completo <ArrowRight size={16}/>
              </Link>
            )}
          </div>
          {data ? (
            <div className="border-4 border-black rounded-2xl p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white relative">
              <ShoppableImage 
                imageUrl={data.post.main_image_url}
                alt={data.post.title}
                tags={data.formattedTags}
              />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold animate-pulse shadow-sm">
                Toque nos produtos 👆
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gray-200 rounded-2xl flex items-center justify-center flex-col gap-2 text-gray-500">
              <p>Nenhum projeto de Marketplace encontrado.</p>
              <p className="text-xs">Cadastre um post com category='marketplace' no Supabase.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">O que você procura hoje?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/marketplace" className="group block">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition duration-300 hover:border-emerald-500 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Marketplace</h3>
                <p className="text-gray-500">
                  Inspire-se em projetos de arquitetos renomados e explore os produtos usados na decoração com um clique.
                </p>
              </div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 z-0 opacity-50"></div>
            </div>
          </Link>
          <Link href="/noticias" className="group block">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition duration-300 hover:border-blue-500 relative overflow-hidden">
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition">
                  <Newspaper size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Blog & Notícias</h3>
                <p className="text-gray-500">
                  Fique por dentro das tendências de design, cobertura de eventos e artigos exclusivos da redação.
                </p>
              </div>
               <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 z-0 opacity-50"></div>
            </div>
          </Link>
        </div>
      </section>

    </main>
  );
}