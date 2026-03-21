'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MonthlySummary {
  id: number;
  month_start: string;
  month_end: string;
  publication_date: string;
  title: string;
  theme: string | null;
  article_count: number;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export default function MonthlySummariesAdmin() {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState<MonthlySummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await fetch('/api/admin/summaries/monthly');
      const data = await response.json();
      setSummaries(data.summaries || []);
    } catch (error) {
      console.error('Error fetching summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewSummary = async () => {
    if (generating) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/admin/summaries/monthly/generate', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert(`Monthly report generated! ${data.articleCount} articles included.`);
        fetchSummaries();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  const togglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/summaries/monthly/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !currentStatus }),
      });

      if (response.ok) {
        fetchSummaries();
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const deleteSummary = async (id: number) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await fetch(`/api/admin/summaries/monthly/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSummaries();
        setSelectedSummary(null);
      }
    } catch (error) {
      console.error('Error deleting summary:', error);
    }
  };

  const filteredSummaries = summaries.filter(summary =>
    summary.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Monthly Reports</h1>
            </div>
            <button
              onClick={generateNewSummary}
              disabled={generating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main List */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {/* Search Bar */}
              <div className="p-4 border-b">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search the library"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Table Header */}
              <div className="px-6 py-3 border-b bg-gray-50">
                <div className="text-sm font-medium text-gray-500">Title</div>
              </div>

              {/* Summary List */}
              <div className="divide-y">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : filteredSummaries.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No reports found. Click "Create" to generate your first monthly report.
                  </div>
                ) : (
                  filteredSummaries.map((summary) => (
                    <div
                      key={summary.id}
                      onClick={() => setSelectedSummary(summary)}
                      className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedSummary?.id === summary.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-medium text-gray-900 mb-1">
                            {summary.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {summary.article_count} articles • {formatDate(summary.month_start)}
                            {summary.is_published ? (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                Published
                              </span>
                            ) : (
                              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                Draft
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Details */}
          {selectedSummary && (
            <div className="w-96">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {selectedSummary.title}
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">URL</p>
                    <Link
                      href={`/monthly/${selectedSummary.publication_date.substring(0, 7)}`}
                      target="_blank"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      /monthly/{selectedSummary.publication_date.substring(0, 7)}
                    </Link>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <p className="text-sm text-gray-900">
                      {selectedSummary.is_published ? 'Published' : 'Draft'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Created</p>
                    <p className="text-sm text-gray-900">
                      {formatShortDate(selectedSummary.created_at)}
                      {selectedSummary.created_by && ` by ${selectedSummary.created_by}`}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Modified</p>
                    <p className="text-sm text-gray-900">
                      {formatShortDate(selectedSummary.updated_at)}
                    </p>
                  </div>

                  {selectedSummary.published_at && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Published</p>
                      <p className="text-sm text-gray-900">
                        {formatShortDate(selectedSummary.published_at)}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Articles</p>
                    <p className="text-sm text-gray-900">
                      {selectedSummary.article_count} articles
                    </p>
                  </div>

                  {selectedSummary.theme && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Theme</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedSummary.theme.substring(0, 200)}...
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t space-y-2">
                  <Link
                    href={`/monthly/${selectedSummary.publication_date.substring(0, 7)}`}
                    target="_blank"
                    className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Preview
                  </Link>

                  <button
                    onClick={() => togglePublish(selectedSummary.id, selectedSummary.is_published)}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    {selectedSummary.is_published ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => deleteSummary(selectedSummary.id)}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
