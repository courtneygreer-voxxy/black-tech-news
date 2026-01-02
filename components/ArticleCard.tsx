'use client';

import { NewsArticle } from '@/lib/news/types';
import { trackArticleView } from '@/lib/api/articles';
import { trackArticleClick, trackExternalClick } from '@/lib/analytics';

interface ArticleCardProps {
  article: NewsArticle;
  featured?: boolean;
  position?: number; // Position in the list for analytics
}

export default function ArticleCard({
  article,
  featured = false,
  position = 0,
}: ArticleCardProps) {
  // Track article click with comprehensive analytics
  const handleClick = () => {
    // Track internal view count (Wolf Studio API)
    trackArticleView(article.url, article.title, article.source.name);

    // Track GA4 analytics
    trackArticleClick({
      articleTitle: article.title,
      articleUrl: article.url,
      source: article.source.name,
      position,
      hasImage: !!article.imageUrl,
    });

    // Track outbound click (traffic to partner sites)
    trackExternalClick({
      articleTitle: article.title,
      articleUrl: article.url,
      source: article.source.name,
      destination: article.url, // The external source URL
    });
  };

  if (featured) {
    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block group"
      >
        <article className="grid md:grid-cols-2 gap-8 pb-12 border-b-2 border-gray-200">
          {/* Featured Image */}
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
            {article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex space-x-2">
                  <div className="w-4 h-24 bg-red-600"></div>
                  <div className="w-4 h-24 bg-black"></div>
                  <div className="w-4 h-24 bg-green-600"></div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 text-xs font-bold tracking-wide uppercase bg-red-600 text-white">
                Featured
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {article.source.name}
              </span>
            </div>

            <h2 className="text-4xl font-bold leading-tight text-black group-hover:text-red-600 transition-colors">
              {article.title}
            </h2>

            {article.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            )}

            {article.author && (
              <div className="text-sm text-gray-500">
                By {article.author}
              </div>
            )}

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </a>
    );
  }

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block group"
    >
      <article className="pb-8 border-b border-gray-200">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Thumbnail */}
          <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
            {article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-12 bg-red-600"></div>
                  <div className="w-2 h-12 bg-black"></div>
                  <div className="w-2 h-12 bg-green-600"></div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                {article.category.replace('-', ' ')}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {article.source.name}
              </span>
            </div>

            <h3 className="text-xl font-bold leading-tight text-black group-hover:text-red-600 transition-colors">
              {article.title}
            </h3>

            {article.excerpt && (
              <p className="text-gray-600 leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            )}

            {article.author && (
              <div className="text-xs text-gray-500">
                By {article.author}
              </div>
            )}
          </div>
        </div>
      </article>
    </a>
  );
}
