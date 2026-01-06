'use client';

import { NewsArticle } from '@/lib/news/types';
import { trackArticleClick } from '@/lib/analytics';
import { encodeArticleId } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';

interface HeroArticleProps {
  article: NewsArticle;
}

export default function HeroArticle({ article }: HeroArticleProps) {
  const handleClick = () => {
    // Store scroll position for restoration
    sessionStorage.setItem('btn_scroll_position', window.scrollY.toString());

    // Track GA4 analytics
    trackArticleClick({
      articleTitle: article.title,
      articleUrl: article.url,
      source: article.source.name,
      position: 1, // Hero article is always position 1
      hasImage: !!article.imageUrl,
    });
  };

  return (
    <Link
      href={`/article/${encodeArticleId(article.id)}`}
      onClick={handleClick}
      className="block group cursor-pointer"
    >
        {/* Hero Image */}
        <div className="relative h-96 bg-gradient-to-br from-red-600 via-black to-green-600 rounded-lg overflow-hidden mb-6">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex space-x-4">
                <div className="w-8 h-64 bg-red-600 opacity-50"></div>
                <div className="w-8 h-64 bg-black opacity-50"></div>
                <div className="w-8 h-64 bg-green-600 opacity-50"></div>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
              Top Story
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Meta */}
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="font-semibold text-black">{article.source.name}</span>
            <span>•</span>
            <time dateTime={article.publishedAt.toISOString()}>
              {format(article.publishedAt, 'MMMM d, yyyy')}
            </time>
            {article.author && (
              <>
                <span>•</span>
                <span>By {article.author}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight group-hover:text-red-600 transition-colors">
            {article.title}
          </h2>

          {/* Excerpt */}
          <p className="text-xl text-gray-700 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {article.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More */}
          <div className="pt-2">
            <span className="inline-flex items-center text-black font-semibold group-hover:underline">
              Read full article
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </div>
        </div>
    </Link>
  );
}
