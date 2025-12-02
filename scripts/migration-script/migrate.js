require('dotenv').config({ path: '../.env.local' }); // Pega as chaves da pasta raiz
const axios = require('axios');
const cheerio = require('cheerio');
const slugify = require('slugify');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://www.revistahabitare.com.br';
const BLOG_LIST_URL = 'https://www.revistahabitare.com.br/materias';

async function migrate() {
  console.log('🚀 Iniciando a migração...');

  try {
    console.log(`📡 Acessando lista: ${BLOG_LIST_URL}`);
    const { data: listHtml } = await axios.get(BLOG_LIST_URL);
    const $ = cheerio.load(listHtml);

    const postLinks = [];
    $('a.blog-post-link').each((i, el) => {
      const link = $(el).attr('href');
      if (link) postLinks.push(link.startsWith('http') ? link : BASE_URL + link);
    });

    console.log(`📝 Encontrados ${postLinks.length} posts para migrar.`);
    for (const link of postLinks) {
      await scrapeAndSavePost(link);
      await new Promise(r => setTimeout(r, 1000)); 
    }

    console.log('✅ Migração concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
  }
}

async function scrapeAndSavePost(url) {
  try {
    console.log(`   ➡️ Processando: ${url}`);
    const { data: postHtml } = await axios.get(url);
    const $ = cheerio.load(postHtml);

    const title = $('h1').first().text().trim(); 
    const contentHtml = $('div.post-content').html();
    const mainImage = $('img.main-post-image').attr('src');
    const dateString = $('span.date').text().trim();

    if (!title || !contentHtml) {
      console.warn(`      ⚠️ Pulei: Não achei título ou conteúdo em ${url}`);
      return;
    }

    const slug = slugify(title, { lower: true, strict: true });
    const { error } = await supabase
      .from('posts')
      .upsert({ 
        slug: slug, 
        title: title,
        content_html: contentHtml,
        main_image_url: mainImage || 'https://via.placeholder.com/800x400',
        category: 'news', 
        is_shoppable: false,
        created_at: dateString ? new Date(dateString) : new Date(),
        architect_name: 'Redação Habitare'
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`      ❌ Erro ao salvar no banco: ${error.message}`);
    } else {
      console.log(`      ✅ Salvo: ${title}`);
    }

  } catch (err) {
    console.error(`      ❌ Erro ao processar ${url}: ${err.message}`);
  }
}

migrate();