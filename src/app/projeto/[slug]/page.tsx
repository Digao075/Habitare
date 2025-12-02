import { supabase } from "@/lib/supabase";
import { ShoppableImage, ProductTag } from "@/components/ui/ShoppableImage";
import { Calendar, User, ArrowLeft, Tag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;
export default async function SmartPostPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) {
    notFound();
  }

  const isMarketplace = post.category === 'marketplace';

  let formattedTags: ProductTag[] = [];
  
  if (isMarketplace) {
    const { data: hotspots } = await supabase
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

    if (hotspots) {
      formattedTags = hotspots.map((h: any) => ({
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
    }
  }

  return (
    <main className="min-h-screen bg-white font-sans pb-20">
      
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-3 text-sm text-gray-600 border-b border-gray-100">
        <Link href="/" className="hover:text-black transition-colors p-1 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={18}/>
        </Link>
        <span className="text-gray-300">|</span>
        <Link href={isMarketplace ? "/marketplace" : "/noticias"} className="hover:text-black font-medium uppercase tracking-wide text-xs">
          {isMarketplace ? 'Marketplace' : 'Editorial'}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold truncate max-w-[300px]">{post.title}</span>
      </div>

      {isMarketplace ? (
        <div className="w-full mb-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-0 bg-white shadow-sm border border-gray-200 rounded-b-xl overflow-hidden">
                          <div className="lg:col-span-2 relative h-[60vh] lg:h-[85vh] w-full bg-gray-100 border-r border-gray-200">
               <ShoppableImage 
                  imageUrl={post.main_image_url || 'https://via.placeholder.com/1200x800?text=Imagem+Indisponivel'} 
                  alt={post.title} 
                  tags={formattedTags} 
               />
                              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur text-gray-900 px-5 py-2.5 rounded-full text-xs font-bold shadow-xl border border-gray-200 flex items-center gap-2 animate-pulse pointer-events-none">
                  <Tag size={14} className="text-emerald-600" /> 
                  Toque nos pontos para ver preços
               </div>
             </div>

             <div className="p-8 lg:p-10 flex flex-col bg-white h-full overflow-y-auto">
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-[10px] uppercase tracking-widest mb-3 bg-emerald-50 w-fit px-2 py-1 rounded">
                    Projeto Verificado
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
                    {post.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 py-4 border-y border-gray-100">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Arquiteto Responsável</p>
                      <p className="font-medium text-gray-900">{post.architect_name || "Escritório Parceiro"}</p>
                    </div>
                  </div>
                </div>

                {/* Lista de Produtos (Sidecar) */}
                <div className="flex-1">
                  {formattedTags.length > 0 ? (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="font-bold mb-4 text-sm text-gray-900 flex items-center gap-2">
                        <ShoppingCart size={16} /> 
                        Itens neste ambiente:
                      </h3>
                      <div className="space-y-4">
                        {formattedTags.map(tag => (
                          <div key={tag.id} className="flex justify-between items-center text-sm group cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                            <div>
                              <span className="block text-gray-800 font-medium group-hover:text-emerald-700 transition-colors">{tag.product.name}</span>
                              <span className="text-xs text-gray-500 uppercase">{tag.product.brand}</span>
                            </div>
                            <span className="font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm group-hover:border-emerald-200">
                               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tag.product.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-end mb-4">
                          <span className="text-sm text-gray-500">Total do ambiente</span>
                          <span className="text-xl font-bold text-emerald-700">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                              formattedTags.reduce((acc, curr) => acc + curr.product.price, 0)
                            )}
                          </span>
                        </div>
                        <button className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-bold hover:bg-black transition shadow-lg hover:shadow-xl transform active:scale-[0.98] duration-200">
                          Comprar o Look Completo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <p className="text-sm text-gray-500">Nenhum produto marcado nesta foto ainda.</p>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      ) : (

        <article className="max-w-3xl mx-auto px-6 mt-12">
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-xs font-bold uppercase text-gray-600 tracking-wide">Notícia</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 border-t border-b border-gray-100 py-4 max-w-md mx-auto">
               <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(post.created_at).toLocaleDateString()}</span>
               <span className="flex items-center gap-2"><User size={14}/> Redação Habitare</span>
            </div>
          </header>

          <div className="aspect-[16/9] w-full relative mb-12 rounded-xl overflow-hidden bg-gray-200 shadow-sm">
             <img 
               src={post.main_image_url || 'https://via.placeholder.com/1200x600'} 
               alt={post.title} 
               className="w-full h-full object-cover"
             />
          </div>

          <div 
            className="prose prose-lg prose-headings:font-serif prose-p:text-gray-700 prose-a:text-emerald-600 prose-img:rounded-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content_html || "<p class='text-center text-gray-500 italic'>Conteúdo em processo de migração.</p>" }}
          />

          <hr className="my-16 border-gray-200" />
                    <div className="bg-emerald-50 p-8 rounded-2xl text-center border border-emerald-100">
            <h3 className="font-bold text-emerald-900 text-xl mb-2">Inspirado por esta matéria?</h3>
            <p className="text-emerald-700 mb-6">Descubra projetos reais que aplicam estas tendências.</p>
            <Link href="/marketplace" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-200">
              <ShoppingBag size={18} />
              Ir para o Marketplace
            </Link>
          </div>
        </article>
      )}
    </main>
  );
}