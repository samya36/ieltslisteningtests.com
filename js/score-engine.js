// 统一评分引擎（兼容旧页面 window.ScoreEngine.calculate 调用）
(function () {
    'use strict';

    const NUMBER_WORDS = {
        zero: '0',
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
        ten: '10'
    };

    function normalizeText(value) {
        if (value === null || value === undefined) return '';
        const text = String(value).trim().toLowerCase().replace(/\s+/g, ' ');
        return NUMBER_WORDS[text] || text;
    }

    function toArrayAnswer(value) {
        if (Array.isArray(value)) {
            return value.map(normalizeText).filter(Boolean);
        }
        const text = normalizeText(value);
        if (!text) return [];
        return text
            .split(/[,;/\s]+/)
            .map(normalizeText)
            .filter(Boolean);
    }

    function parseAlternatives(correctAnswer) {
        const text = normalizeText(correctAnswer);
        if (!text) return [];
        if (text.includes('|')) return text.split('|').map(normalizeText).filter(Boolean);
        if (text.includes('/')) return text.split('/').map(normalizeText).filter(Boolean);
        return [text];
    }

    function compareAnswer(userAnswer, correctAnswer) {
        if (Array.isArray(correctAnswer)) {
            const expected = correctAnswer.map(normalizeText).filter(Boolean);
            const actual = toArrayAnswer(userAnswer);
            if (expected.length === 0) return { score: 0, status: 'incorrect' };
            const matched = actual.filter(a => expected.includes(a)).length;
            const score = Math.min(1, matched / expected.length);
            if (score >= 1) return { score: 1, status: 'correct' };
            if (score > 0) return { score, status: 'partial' };
            return { score: 0, status: 'incorrect' };
        }

        const expectedAlternatives = parseAlternatives(correctAnswer);
        const actual = normalizeText(userAnswer);

        if (!actual || expectedAlternatives.length === 0) {
            return { score: 0, status: 'incorrect' };
        }

        if (expectedAlternatives.includes(actual)) {
            return { score: 1, status: 'correct' };
        }

        return { score: 0, status: 'incorrect' };
    }

    function parseSectionAndQuestion(key) {
        const sectionMatch = String(key).match(/section(\d+)_/i);
        const questionMatch = String(key).match(/_(\d+)/);
        const section = sectionMatch ? Math.max(1, Math.min(4, parseInt(sectionMatch[1], 10))) : 1;
        const questionNumber = questionMatch ? parseInt(questionMatch[1], 10) : 0;
        return { section, questionNumber };
    }

    function toBandScore(rawScore) {
        const score = Math.max(0, Math.min(40, Math.round(rawScore)));
        if (score >= 39) return 9.0;
        if (score >= 37) return 8.5;
        if (score >= 35) return 8.0;
        if (score >= 32) return 7.5;
        if (score >= 30) return 7.0;
        if (score >= 27) return 6.5;
        if (score >= 23) return 6.0;
        if (score >= 18) return 5.5;
        if (score >= 15) return 5.0;
        if (score >= 11) return 4.5;
        if (score >= 8) return 4.0;
        if (score >= 5) return 3.5;
        if (score >= 2) return 3.0;
        if (score >= 1) return 2.5;
        return 2.0;
    }

    function buildProblemAreas(sectionScores, sectionAnalysis) {
        const tips = [];

        for (let section = 1; section <= 4; section++) {
            const details = sectionAnalysis[`section${section}`] || [];
            if (details.length === 0) continue;

            const correctCount = details.filter(item => item.status === 'correct').length;
            const accuracy = correctCount / details.length;

            if (accuracy < 0.5) {
                tips.push(`Section ${section} 正确率偏低，建议优先复盘该部分错题。`);
            } else if (accuracy < 0.7) {
                tips.push(`Section ${section} 还有提升空间，建议加强关键词捕捉与同义替换识别。`);
            }
        }

        const partialCount = Object.values(sectionAnalysis)
            .flat()
            .filter(item => item.status === 'partial').length;
        if (partialCount > 0) {
            tips.push('存在部分得分题目，建议检查拼写与答案格式。');
        }

        return tips;
    }

    function calculate(userAnswers, answerKey) {
        const safeUserAnswers = userAnswers || {};
        const safeAnswerKey = answerKey || {};

        const result = {
            totalScore: 0,
            bandScore: 0,
            sectionScores: {
                section1: 0,
                section2: 0,
                section3: 0,
                section4: 0
            },
            sectionAnalysis: {
                section1: [],
                section2: [],
                section3: [],
                section4: []
            },
            problemAreas: []
        };

        Object.entries(safeAnswerKey).forEach(([key, correctAnswer]) => {
            const userAnswer = safeUserAnswers[key];
            const { section, questionNumber } = parseSectionAndQuestion(key);
            const compare = compareAnswer(userAnswer, correctAnswer);

            result.totalScore += compare.score;
            result.sectionScores[`section${section}`] += compare.score;
            result.sectionAnalysis[`section${section}`].push({
                questionNumber,
                userAnswer: Array.isArray(userAnswer) ? userAnswer.join(', ') : (userAnswer || ''),
                correctAnswer: Array.isArray(correctAnswer) ? correctAnswer.join(', ') : (correctAnswer || ''),
                status: compare.status,
                score: compare.score
            });
        });

        // 保持稳定输出
        result.totalScore = Number(result.totalScore.toFixed(1));
        for (let section = 1; section <= 4; section++) {
            const key = `section${section}`;
            result.sectionScores[key] = Number(result.sectionScores[key].toFixed(1));
        }

        result.bandScore = toBandScore(result.totalScore);
        result.problemAreas = buildProblemAreas(result.sectionScores, result.sectionAnalysis);

        return result;
    }

    window.ScoreEngine = {
        calculate
    };
})();

