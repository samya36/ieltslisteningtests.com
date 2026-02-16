// WebMCP Tools for IELTS Listening Score Analyzer
// Requires Chrome 146+ with chrome://flags/#enable-webmcp-testing

;(function () {
  if (!('modelContext' in navigator) || !navigator.modelContext) return

  function jsonRes(data) {
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
  }

  // Score conversion table (same as calculator.js)
  var SCORE_TABLE = [
    { min: 39, max: 40, score: 9.0 },
    { min: 37, max: 38, score: 8.5 },
    { min: 35, max: 36, score: 8.0 },
    { min: 33, max: 34, score: 7.5 },
    { min: 30, max: 32, score: 7.0 },
    { min: 27, max: 29, score: 6.5 },
    { min: 23, max: 26, score: 6.0 },
    { min: 20, max: 22, score: 5.5 },
    { min: 16, max: 19, score: 5.0 },
    { min: 13, max: 15, score: 4.5 },
    { min: 10, max: 12, score: 4.0 },
    { min: 6, max: 9, score: 3.5 },
    { min: 4, max: 5, score: 3.0 },
    { min: 3, max: 3, score: 2.5 },
    { min: 2, max: 2, score: 2.0 },
    { min: 1, max: 1, score: 1.0 },
    { min: 0, max: 0, score: 0.0 }
  ]

  function calcScore(correct) {
    for (var i = 0; i < SCORE_TABLE.length; i++) {
      if (correct >= SCORE_TABLE[i].min && correct <= SCORE_TABLE[i].max) {
        return SCORE_TABLE[i].score
      }
    }
    return 0.0
  }

  // 1. calculate_score — Convert correct answers to IELTS band score
  navigator.modelContext.registerTool({
    name: 'calculate_score',
    description:
      'Calculate the IELTS Listening band score from the number of correct answers (0-40). Returns the band score (0.0-9.0) based on the official conversion table.',
    inputSchema: {
      type: 'object',
      properties: {
        correct_answers: {
          type: 'number',
          description: 'Number of correct answers, between 0 and 40.'
        }
      },
      required: ['correct_answers']
    },
    annotations: { readOnlyHint: 'true' },
    execute: function (params) {
      var n = Math.round(Number(params.correct_answers))
      if (isNaN(n) || n < 0 || n > 40) {
        return jsonRes({ success: false, error: 'correct_answers must be between 0 and 40.' })
      }
      var band = calcScore(n)

      // Also update the calculator UI on the homepage
      var input = document.getElementById('correct-answers')
      var result = document.getElementById('score-result')
      if (input && result) {
        input.value = n
        result.textContent = band.toFixed(1)
        result.style.color = '#1E88E5'
      }

      return jsonRes({
        success: true,
        correct_answers: n,
        band_score: band,
        message: n + ' correct answers = Band ' + band.toFixed(1)
      })
    }
  })

  // 2. get_score_table — Get the full IELTS listening score conversion table
  navigator.modelContext.registerTool({
    name: 'get_score_table',
    description:
      'Get the complete IELTS Listening score conversion table showing the mapping from number of correct answers to band scores.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: 'true' },
    execute: function () {
      return jsonRes({
        success: true,
        total_questions: 40,
        conversion_table: SCORE_TABLE.map(function (row) {
          return {
            correct_answers: row.min === row.max ? String(row.min) : row.min + '-' + row.max,
            band_score: row.score
          }
        })
      })
    }
  })

  // 3. get_available_tests — List available listening tests
  navigator.modelContext.registerTool({
    name: 'get_available_tests',
    description:
      'List all available IELTS listening tests on this site with their themes, difficulty, and links.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: 'true' },
    execute: function () {
      var tests = [
        {
          id: 'test1',
          name: 'Test 1',
          difficulty: 'Intermediate',
          themes: ['Amateur Drama Club', 'Winsham Farm', 'Bolton Island Field Trip', 'Plastics Development'],
          url: 'pages/test.html',
          enhanced_url: 'pages/enhanced-test1.html'
        },
        {
          id: 'test2',
          name: 'Test 2',
          difficulty: 'Intermediate',
          themes: ['Winsham Farm Work', 'Queensland Festivals', 'Environmental Science', 'Photic Sneeze Reflex'],
          url: 'pages/test2.html'
        },
        {
          id: 'test3',
          name: 'Test 3',
          difficulty: 'Intermediate-Advanced',
          themes: ['Airline Complaints', 'Spring Festival', 'Iceland Geology', 'Tire Recycling'],
          url: 'pages/test3.html'
        }
      ]

      return jsonRes({
        success: true,
        count: tests.length,
        tests: tests,
        note: 'Each test has 40 questions and takes approximately 30 minutes.'
      })
    }
  })

  // 4. navigate_to — Navigate to a specific page on the site
  navigator.modelContext.registerTool({
    name: 'navigate_to',
    description:
      'Navigate to a specific page on the IELTS Listening site. Available pages: home, scoring, cases, practice, progress, test1, test2, test3, enhanced-test1.',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'string',
          enum: ['home', 'scoring', 'cases', 'practice', 'progress', 'test1', 'test2', 'test3', 'enhanced-test1'],
          description: 'The page to navigate to.'
        }
      },
      required: ['page']
    },
    execute: function (params) {
      var pages = {
        home: 'index.html',
        scoring: 'pages/scoring.html',
        cases: 'pages/cases.html',
        practice: 'pages/practice.html',
        progress: 'pages/progress.html',
        test1: 'pages/test.html',
        test2: 'pages/test2.html',
        test3: 'pages/test3.html',
        'enhanced-test1': 'pages/enhanced-test1.html'
      }
      var url = pages[params.page]
      if (!url) {
        return jsonRes({ success: false, error: 'Unknown page: ' + params.page })
      }

      // Handle relative paths from subpages
      var base = window.location.pathname
      if (base.indexOf('/pages/') !== -1) {
        url = url.startsWith('pages/') ? url.replace('pages/', '') : '../' + url
      }

      window.location.href = url
      return jsonRes({ success: true, message: 'Navigating to ' + params.page })
    }
  })

  console.log('WebMCP: 4 imperative tools registered for IELTS Listening Score Analyzer')
})()
