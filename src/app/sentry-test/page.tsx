'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'
import { AlertCircle, CheckCircle, Bug } from 'lucide-react'

export default function SentryTestPage() {
  const [lastTest, setLastTest] = useState<string>('')

  const testError = () => {
    try {
      throw new Error('Test error from Sentry test page')
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          test: 'manual',
          page: 'sentry-test'
        }
      })
      setLastTest('Error captured successfully!')
    }
  }

  const testMessage = () => {
    Sentry.captureMessage('Test message from Sentry test page', {
      level: 'info',
      tags: {
        test: 'manual',
        page: 'sentry-test'
      }
    })
    setLastTest('Message sent successfully!')
  }

  const testUserFeedback = () => {
    const eventId = Sentry.captureMessage('User feedback test')
    setLastTest(`Feedback captured with event ID: ${eventId}`)
  }

  const testPerformance = () => {
    const transaction = Sentry.startTransaction({
      name: 'Test Transaction',
      op: 'test'
    })

    // Simulate some work
    setTimeout(() => {
      transaction.finish()
      setLastTest('Performance metric captured!')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Bug className="w-10 h-10 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Sentry Error Monitoring Test
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Test error tracking and monitoring integration
              </p>
            </div>
          </div>

          {/* Sentry DSN Info */}
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Sentry Configured
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  DSN: {process.env.NEXT_PUBLIC_SENTRY_DSN?.substring(0, 50)}...
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Project: mansa-mentorship | Org: mansa
                </p>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={testError}
              className="p-4 border-2 border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
            >
              <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Test Error Capture
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Capture an exception and send to Sentry
              </p>
            </button>

            <button
              onClick={testMessage}
              className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all group"
            >
              <AlertCircle className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Test Message
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send an info message to Sentry
              </p>
            </button>

            <button
              onClick={testUserFeedback}
              className="p-4 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-all group"
            >
              <AlertCircle className="w-6 h-6 text-yellow-600 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Test User Feedback
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Capture user feedback event
              </p>
            </button>

            <button
              onClick={testPerformance}
              className="p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all group"
            >
              <AlertCircle className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Test Performance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track a performance transaction
              </p>
            </button>
          </div>

          {/* Last Test Result */}
          {lastTest && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-900 dark:text-emerald-100 font-medium">
                  {lastTest}
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              How to Verify
            </h3>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
              <li>Click any test button above</li>
              <li>Go to <a href="https://sentry.io" target="_blank" className="text-purple-600 hover:underline">sentry.io</a></li>
              <li>Login and navigate to Projects → mansa-mentorship</li>
              <li>Check the "Issues" tab for captured errors</li>
              <li>Check "Performance" tab for transactions</li>
            </ol>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> In development mode, errors are filtered out by default.
                To test in production mode, build and start the app:
              </p>
              <pre className="mt-2 text-xs bg-gray-900 text-gray-100 p-2 rounded overflow-x-auto">
                npm run build && npm start
              </pre>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex gap-4">
            <a
              href="https://sentry.io/organizations/mansa/issues/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <p className="font-medium text-gray-900 dark:text-white">View Issues</p>
              <p className="text-xs text-gray-500 mt-1">Sentry Dashboard →</p>
            </a>
            <a
              href="https://sentry.io/organizations/mansa/performance/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <p className="font-medium text-gray-900 dark:text-white">Performance</p>
              <p className="text-xs text-gray-500 mt-1">Sentry Dashboard →</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
