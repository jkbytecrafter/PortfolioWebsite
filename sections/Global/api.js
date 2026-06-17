// ── LEETCODE API (multi-endpoint fallback) ────────────────
async function fetchLeetCode() {
  const USERNAME = 'JKByteCrafter';
  const lcTotal = document.getElementById('lc-total');
  const lcEasy = document.getElementById('lc-easy');
  const lcMed = document.getElementById('lc-med');
  const lcHard = document.getElementById('lc-hard');
  const lcStatus = document.getElementById('lc-status');

  function apply(total, easy, medium, hard) {
    animateCounter(lcTotal, total);
    animateCounter(lcEasy, easy);
    animateCounter(lcMed, medium);
    animateCounter(lcHard, hard);
    animateRingSVG('lc-ring', total / 3000);
    const mx = Math.max(easy, medium, hard, 1);
    animateBar('lc-easy-bar', easy / mx);
    animateBar('lc-med-bar', medium / mx);
    animateBar('lc-hard-bar', hard / mx);
    lcStatus.textContent = '✓ Live – updated just now';
    lcStatus.style.color = '#E4FF30';
    document.getElementById('lc-card')?.classList.add('data-loaded');

    // ── Sync Awards & Certifications timeline entry ──────────
    const awardSub = document.getElementById('award-lc-sub');
    const awardDesc = document.getElementById('award-lc-desc');
    if (awardSub) awardSub.textContent = `${total} problems solved`;
    if (awardDesc) awardDesc.textContent =
      `Easy: ${easy} · Medium: ${medium} · Hard: ${hard} — Arrays, Linked Lists, Graphs, Sliding Window, Binary Search, Tree Algorithms`;
  }

  // Endpoint 1: leetcode-stats-api.herokuapp.com (usually has CORS headers)
  try {
    const r = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${USERNAME}`,
      { signal: AbortSignal.timeout(7000) }
    );
    if (r.ok) {
      const d = await r.json();
      if (d.status === 'success' && d.totalSolved > 0) {
        apply(d.totalSolved, d.easySolved, d.mediumSolved, d.hardSolved);
        return;
      }
    }
  } catch (_) { }

  // Endpoint 2: allorigins.win CORS proxy → LeetCode GraphQL
  // Fetches server-side so CORS is bypassed — works from file:// too
  try {
    const gqlBody = JSON.stringify({
      query: `{ matchedUser(username:"${USERNAME}") { submitStatsGlobal { acSubmissionNum { difficulty count } } } }`
    });
    const target = encodeURIComponent('https://leetcode.com/graphql');
    const r = await fetch(`https://api.allorigins.win/raw?url=${target}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: gqlBody,
      signal: AbortSignal.timeout(9000),
    });
    if (r.ok) {
      const d = await r.json();
      const nums = d?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
      if (Array.isArray(nums) && nums.length) {
        const get = (diff) => (nums.find(x => x.difficulty === diff) || {}).count || 0;
        const total = get('All'), easy = get('Easy'), medium = get('Medium'), hard = get('Hard');
        if (total > 0) { apply(total, easy, medium, hard); return; }
      }
    }
  } catch (_) { }

  // Endpoint 3: alfa-leetcode-api.onrender.com (cold-start ~12s on free tier)
  try {
    const r = await fetch(
      `https://alfa-leetcode-api.onrender.com/${USERNAME}/solved`,
      { signal: AbortSignal.timeout(13000) }
    );
    if (r.ok) {
      const d = await r.json();
      const total = d.solvedProblem ?? d.totalSolved ?? 0;
      const easy = d.easySolved ?? 0;
      const medium = d.mediumSolved ?? 0;
      const hard = d.hardSolved ?? 0;
      if (total > 0) { apply(total, easy, medium, hard); return; }
    }
  } catch (_) { }

  // Fallback: last-known cached values
  apply(337, 121, 167, 49);
  lcStatus.textContent = '⚠ Cached – live APIs unreachable';
  lcStatus.style.color = '#a09cc0';
}


// ── CODEFORCES API ────────────────────────────────────────
async function fetchCodeforces() {
  const HANDLE = 'jatinkumar15002';
  const INFO_URL = `https://codeforces.com/api/user.info?handles=${HANDLE}`;
  const STATUS_URL = `https://codeforces.com/api/user.status?handle=${HANDLE}&from=1&count=10000`;

  const cfRating = document.getElementById('cf-rating');
  const cfRank = document.getElementById('cf-rank');
  const cfMaxRating = document.getElementById('cf-max-rating');
  const cfSolved = document.getElementById('cf-solved');
  const cfStatus = document.getElementById('cf-status');

  try {
    const [infoRes, statusRes] = await Promise.all([
      fetch(INFO_URL, { signal: AbortSignal.timeout(8000) }),
      fetch(STATUS_URL, { signal: AbortSignal.timeout(10000) })
    ]);

    if (!infoRes.ok) throw new Error('CF info error');
    const info = await infoRes.json();
    if (info.status !== 'OK') throw new Error('CF API error');

    const user = info.result[0];
    const rating = user.rating || 0;
    const maxRating = user.maxRating || 0;
    const rank = user.rank || '–';

    animateCounter(cfRating, rating);
    animateCounter(cfMaxRating, maxRating);
    cfRank.textContent = rank.charAt(0).toUpperCase() + rank.slice(1);

    // Ring: CF rating scale 0–2000 at ~100%
    animateRingSVG('cf-ring', rating / 2000);

    // Solved problems from submissions
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      if (statusData.status === 'OK') {
        const solved = new Set(
          statusData.result
            .filter(s => s.verdict === 'OK')
            .map(s => `${s.problem.contestId}-${s.problem.index}`)
        );
        animateCounter(cfSolved, solved.size);
      } else {
        cfSolved.textContent = '–';
      }
    }

    cfStatus.textContent = '✓ Live – updated just now';
    cfStatus.style.color = '#22c55e';
    document.getElementById('cf-card').classList.add('data-loaded');

  } catch (err) {
    // Fallback
    animateCounter(cfRating, 1138);
    animateCounter(cfMaxRating, 1138);
    cfRank.textContent = 'Pupil';
    animateRingSVG('cf-ring', 1138 / 2000);
    cfSolved.textContent = '–';
    cfStatus.textContent = '⚠ Cached – API unreachable';
    cfStatus.style.color = '#fbbf24';
  }
}

// ── GITHUB API ─────────────────────────────────────────
async function fetchGitHub() {
  const USERNAME = 'JKBYTEcrafter';
  const USER_URL = `https://api.github.com/users/${USERNAME}`;
  const REPOS_URL = `https://api.github.com/users/${USERNAME}/repos?per_page=100`;

  const ghRepos = document.getElementById('gh-repos');
  const ghReposMini = document.getElementById('gh-repos-mini');
  const ghFollowers = document.getElementById('gh-followers');
  const ghFollowersMini = document.getElementById('gh-followers-mini');
  const ghFollowing = document.getElementById('gh-following');
  const ghStars = document.getElementById('gh-stars');
  const ghStatus = document.getElementById('gh-status');

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(USER_URL, { signal: AbortSignal.timeout(8000) }),
      fetch(REPOS_URL, { signal: AbortSignal.timeout(8000) })
    ]);

    if (!userRes.ok) throw new Error('GitHub user error');
    const user = await userRes.json();

    const repos = user.public_repos || 0;
    const followers = user.followers || 0;
    const following = user.following || 0;

    animateCounter(ghRepos, repos);
    if (ghReposMini) animateCounter(ghReposMini, repos);
    animateCounter(ghFollowers, followers);
    if (ghFollowersMini) animateCounter(ghFollowersMini, followers);
    animateCounter(ghFollowing, following);

    // Ring: treat 30 repos as ~100%
    animateRingSVG('gh-ring', repos / 30);

    // Total stars from all repos
    if (reposRes.ok) {
      const repoList = await reposRes.json();
      if (Array.isArray(repoList)) {
        const totalStars = repoList.reduce((s, r) => s + (r.stargazers_count || 0), 0);
        animateCounter(ghStars, totalStars);
      }
    } else {
      if (ghStars) ghStars.textContent = '–';
    }

    if (ghStatus) {
      ghStatus.textContent = '✓ Live – updated just now';
      ghStatus.style.color = '#AACDDC';
    }
    document.getElementById('gh-card')?.classList.add('data-loaded');

  } catch (err) {
    if (ghRepos) ghRepos.textContent = '–';
    if (ghReposMini) ghReposMini.textContent = '–';
    if (ghFollowers) ghFollowers.textContent = '–';
    if (ghFollowersMini) ghFollowersMini.textContent = '–';
    if (ghFollowing) ghFollowing.textContent = '–';
    if (ghStars) ghStars.textContent = '–';
    if (ghStatus) {
      ghStatus.textContent = '⚠ Could not reach GitHub API';
      ghStatus.style.color = '#D2C4B4';
    }
  }
}

// ── TRIGGER APIs ON PAGE LOAD & WHEN COMPETITIVE IS VISIBLE ─
// LeetCode + GitHub fetch immediately so Awards section always
// shows live data even if user never scrolls to CP Stats.
fetchLeetCode();
fetchGitHub();

// Codeforces + Codolio fetch when CP section is visible
let cpFetched = false;
const cpSection = document.getElementById('competitive');
const cpObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !cpFetched) {
    cpFetched = true;
    fetchCodeforces();
    fetchCodolio();
    cpObs.disconnect();
  }
}, { threshold: 0.2 });
cpObs.observe(cpSection);

// ── CODOLIO ──────────────────────────────────────────────────
// Codolio renders stats client-side with no public API.
// We show accurate profile data and link to the profile to verify.
function fetchCodolio() {
  const cdSolved  = document.getElementById('cd-solved');
  const cdDays    = document.getElementById('cd-days');
  const cdStatus  = document.getElementById('cd-status');
  const cdSolved2 = document.getElementById('cd-solved-2');

  const SOLVED = 409;
  const DAYS   = 247;

  animateCounter(cdSolved,  SOLVED);
  animateCounter(cdDays,    DAYS);
  if (cdSolved2) animateCounter(cdSolved2, SOLVED);
  animateRingSVG('cd-ring', SOLVED / 500);

  if (cdStatus) {
    cdStatus.textContent = '✓ Profile data · jkbytecrafter';
    cdStatus.style.color = '#F97316';
  }
  document.getElementById('codolio-card')?.classList.add('data-loaded');
}
