'use client';

import { NewsArticle } from '@/lib/news/types';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, ExternalLink, Share2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { appendUTMParams } from '@/lib/analytics';
import { encodeArticleId } from '@/lib/utils';

interface ArticlePreviewProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
  onBackClick: () => void;
  onExternalClick: () => void;
}

export default function ArticlePreview({
  article,
  relatedArticles,
  onBackClick,
  onExternalClick,
}: ArticlePreviewProps) {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate UTM-tagged URL for outbound tracking
  const taggedArticleUrl = useMemo(() => {
    return appendUTMParams(article.url, {
      campaign: 'article_preview',
      content: article.category,
    });
  }, [article.url, article.category]);

  const handleShare = (platform: 'twitter' | 'reddit' | 'linkedin') => {
    // Share the original article URL (not our preview page)
    const url = encodeURIComponent(article.url);
    const title = encodeURIComponent(article.title);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${url}&title=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShareMenuOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShareMenuOpen(false);
    }, 2000);
  };

  return (
    <main className="max-w-4xl mx-auto px-8 lg:px-16 py-12">
      {/* Back Button */}
      <button
        onClick={onBackClick}
        className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Feed</span>
      </button>

      {/* Article Header */}
      <article className="space-y-8">
        {/* Source Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 text-xs font-bold tracking-wide uppercase bg-red-600 text-white">
              {article.category.replace('-', ' ')}
            </span>
            <span className="text-sm text-gray-500 uppercase tracking-wide">
              {article.source.name}
            </span>
          </div>

          {/* Share Button */}
          <div className="relative">
            <button
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-black transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>

            {shareMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg z-10">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm"
                >
                  Share on Twitter
                </button>
                <button
                  onClick={() => handleShare('reddit')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm"
                >
                  Share on Reddit
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm"
                >
                  Share on LinkedIn
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm border-t border-gray-200"
                >
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-black">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {article.author && (
            <>
              <span>By {article.author}</span>
              <span>•</span>
            </>
          )}
          <span>
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </span>
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="py-8 border-y border-gray-200">
          <a
            href={taggedArticleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onExternalClick}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors group"
          >
            <span>Read Full Article on {article.source.name}</span>
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-8">
            More from {article.source.name}
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/article/${encodeArticleId(related.id)}`}
                className="group"
                onClick={() => {
                  // Store scroll position before navigating
                  sessionStorage.setItem('btn_scroll_position', window.scrollY.toString());
                }}
              >
                <article className="space-y-3">
                  {/* Thumbnail */}
                  {related.imageUrl ? (
                    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-[16/10] bg-gray-100 flex items-center justify-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-12 bg-red-600"></div>
                        <div className="w-2 h-12 bg-black"></div>
                        <div className="w-2 h-12 bg-green-600"></div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="text-lg font-bold leading-tight text-black group-hover:text-red-600 transition-colors line-clamp-2">
                    {related.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(related.publishedAt), { addSuffix: true })}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
