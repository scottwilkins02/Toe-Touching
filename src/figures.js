/* ---------- Figure renderer v3: flat organic illustration style ---------- */
const FIG = {
  skin:'#D9A27F', skinF:'#BF8664', hair:'#4A4542', nose:'#C98F6C',
  top:'#F3EDE4', topF:'#DCD4C8', shorts:'#2E3238', shortsF:'#23262B',
  hi:'#FFC83D', strap:'#C2643F',
};

// Each pose: joints (side view, floor at y≈162) + tile colours + optional end pose "b" for motion.
const POSES = {
  march:{ bg:'#C9D5DE', mat:'#6E7681', facing:1, head:[120,30], torso:[[120,50],[120,98]],
    far:{arm:[[120,54],[131,75],[140,90]], leg:[[120,98],[119,130],[118,158],[129,161]]},
    near:{arm:[[120,54],[110,75],[103,91]], leg:[[120,98],[144,104],[142,132],[153,134]]},
    hi:[], period:1.3,
    b:{ far:{arm:[[120,54],[110,75],[103,91]], leg:[[120,98],[144,104],[142,132],[153,134]]},
        near:{arm:[[120,54],[131,75],[140,90]], leg:[[120,98],[119,130],[118,158],[129,161]]} } },
  swing:{ bg:'#A8BFD4', mat:'#55728F', wallC:'#93ACC4', facing:1, wall:58, head:[112,30], torso:[[112,50],[112,98]],
    far:{arm:[[112,54],[94,63],[72,64]], leg:[[112,98],[111,130],[110,158],[121,161]]},
    near:{arm:[[112,54],[123,73],[129,89]], leg:[[112,98],[138,116],[160,130],[168,124]]},
    hi:['nThigh'], period:2.4,
    b:{ near:{arm:[[112,54],[104,74],[100,90]], leg:[[112,98],[103,129],[92,155],[99,161]]} } },
  strap:{ bg:'#7F958B', mat:'#B8893D', facing:1, lying:true, head:[42,142], torso:[[60,149],[120,151]],
    far:{arm:[[59,150],[82,132],[100,116]], leg:[[120,151],[154,152],[186,153],[191,145]]},
    near:{arm:[[61,147],[84,128],[103,112]], leg:[[120,151],[128,117],[136,83],[146,79]]},
    hi:['nThigh'], period:8,
    b:{ near:{arm:[[61,147],[82,126],[100,109]], leg:[[120,151],[125,117],[129,82],[139,77]]}, far:{arm:[[59,150],[80,130],[97,113]]} },
    extra:p => { const h = p.near.arm[2], f = p.near.leg[2], h2 = p.far.arm[2];
      return `<path d="M${r1(h[0])} ${r1(h[1])}L${r1(f[0]+3)} ${r1(f[1]-3)}M${r1(h2[0])} ${r1(h2[1])}L${r1(f[0]+6)} ${r1(f[1]+2)}" stroke="${FIG.strap}" stroke-width="3" stroke-linecap="round" fill="none"/>`; } },
  fold:{ bg:'#46608C', mat:'#7D3240', facing:1, torsoFront:true, head:[142,137], torso:[[132,120],[106,92]],
    far:{arm:[[132,120],[132,136],[127,149]], leg:[[106,92],[111,126],[115,158],[127,161]]},
    near:{arm:[[132,120],[128,136],[122,148]], leg:[[106,92],[107,126],[109,158],[121,161]]},
    hi:['nThigh'], period:8,
    b:{ head:[139,143], torso:[[130,125],[106,92]],
        far:{arm:[[130,125],[129,141],[124,155]]}, near:{arm:[[130,125],[125,141],[118,154]]} } },
  calf:{ bg:'#A65B3E', mat:'#2F4A44', wallC:'#934F35', facing:1, wall:196, head:[163,41], torso:[[153,59],[128,100]],
    far:{arm:[[151,62],[171,71],[193,67]], leg:[[128,100],[152,124],[150,158],[162,161]]},
    near:{arm:[[153,60],[173,65],[193,60]], leg:[[128,100],[110,130],[93,157],[106,161]]},
    hi:['nShin'], period:8,
    b:{ head:[167,43], torso:[[157,61],[132,102]],
        far:{arm:[[155,64],[174,72],[193,67]], leg:[[132,102],[155,126],[150,158],[162,161]]},
        near:{arm:[[157,62],[175,66],[193,60]], leg:[[132,102],[112,131],[93,157],[106,161]]} } },
  soleus:{ bg:'#6F8754', mat:'#2C3B52', wallC:'#627A49', facing:1, wall:196, head:[162,46], torso:[[152,64],[128,104]],
    far:{arm:[[150,67],[170,75],[193,72]], leg:[[128,104],[154,126],[152,158],[164,161]]},
    near:{arm:[[152,65],[172,70],[193,65]], leg:[[128,104],[115,134],[101,157],[113,161]]},
    hi:['nShin'], period:8,
    b:{ head:[162,50], torso:[[152,68],[127,109]],
        far:{arm:[[150,71],[171,78],[193,74]], leg:[[127,109],[155,129],[152,158],[164,161]]},
        near:{arm:[[152,69],[172,73],[193,68]], leg:[[127,109],[117,138],[101,157],[113,161]]} } },
  fig4:{ bg:'#5E4C6E', mat:'#C7A15A', facing:1, lying:true, head:[42,142], torso:[[60,149],[120,151]],
    far:{arm:[[59,150],[94,137],[133,132]], leg:[[120,151],[150,117],[170,153],[183,156]]},
    near:{arm:[[61,147],[96,131],[137,126]], leg:[[120,151],[133,120],[154,116],[162,108]]},
    hi:['hip'], period:8,
    b:{ far:{arm:[[59,150],[90,134],[127,128]], leg:[[120,151],[144,113],[166,149],[179,153]]},
        near:{arm:[[61,147],[92,128],[131,122]], leg:[[120,151],[129,117],[149,112],[157,104]]} } },
  knees:{ bg:'#4C6D63', mat:'#6B4A78', facing:1, lying:true, head:[42,142], torso:[[60,149],[118,151]],
    far:{arm:[[59,150],[76,131],[96,117]], leg:[[118,151],[97,116],[119,130],[125,124]]},
    near:{arm:[[61,147],[78,128],[93,120]], leg:[[118,151],[94,119],[116,134],[122,128]]},
    hi:['lowback'], period:8,
    b:{ far:{arm:[[59,150],[74,129],[91,114]], leg:[[118,151],[92,113],[114,126],[120,120]]},
        near:{arm:[[61,147],[76,127],[89,117]], leg:[[118,151],[89,116],[111,130],[117,124]]} } },
};

const r1 = n => Math.round(n * 10) / 10;
const lerpPt = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const lerpArr = (a, b, t) => a.map((p, i) => lerpPt(p, b[i], t));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const unit = v => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };

// point along a polyline at arc-length fraction s
function along(pts, s){
  const seg = []; let tot = 0;
  for (let i = 0; i < pts.length - 1; i++){ const l = Math.hypot(pts[i+1][0] - pts[i][0], pts[i+1][1] - pts[i][1]); seg.push(l); tot += l; }
  let d = Math.max(0, Math.min(1, s)) * tot;
  for (let i = 0; i < seg.length; i++){ if (d <= seg[i] || i === seg.length - 1) return lerpPt(pts[i], pts[i+1], seg[i] ? Math.min(1, d / seg[i]) : 0); d -= seg[i]; }
  return pts[pts.length - 1];
}
const firstFrac = pts => { const a = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), b = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]); return a / (a + b); };
function prof(P, s){ for (let i = 0; i < P.length - 1; i++) if (s <= P[i+1][0]) { const t = (s - P[i][0]) / ((P[i+1][0] - P[i][0]) || 1); return P[i][1] + (P[i+1][1] - P[i][1]) * t; } return P[P.length - 1][1]; }

// smooth closed path through points (Catmull-Rom -> cubic Bezier)
function smooth(P){
  const n = P.length; let d = `M${r1(P[0][0])} ${r1(P[0][1])}`;
  for (let i = 0; i < n; i++){
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d + 'Z';
}

// organic tapered limb along a spine polyline; radius profile P over s in [0,1]
function tube(pts, P, fill, s0 = 0, s1 = 1, cap0 = true, cap1 = true, add = 0, n = 14){
  const L = [], R = [], e = 0.012;
  let first, last;
  for (let i = 0; i <= n; i++){
    const s = s0 + (s1 - s0) * i / n, p = along(pts, s);
    const t = unit(sub(along(pts, s + e), along(pts, s - e))), nm = [-t[1], t[0]], r = prof(P, s) + add;
    L.push([p[0] + nm[0] * r, p[1] + nm[1] * r]); R.push([p[0] - nm[0] * r, p[1] - nm[1] * r]);
    if (i === 0) first = { p, t, nm, r }; if (i === n) last = { p, t, nm, r };
  }
  const out = L.slice();
  const arc = (c, from, to, k) => { for (let j = 1; j < k; j++){ const a = Math.PI * j / k; out.push([c.p[0] + c.r * (Math.cos(a) * from[0] + Math.sin(a) * to[0]), c.p[1] + c.r * (Math.cos(a) * from[1] + Math.sin(a) * to[1])]); } };
  if (cap1) arc(last, last.nm, last.t, 5);
  for (let i = R.length - 1; i >= 0; i--) out.push(R[i]);
  if (cap0) arc(first, [-first.nm[0], -first.nm[1]], [-first.t[0], -first.t[1]], 5);
  return `<path d="${smooth(out)}" fill="${fill}"/>`;
}

function poseAt(key, t){
  const A = POSES[key], B = A.b || {};
  if (!t) return A;
  const side = s => ({ arm: lerpArr(A[s].arm, (B[s] && B[s].arm) || A[s].arm, t), leg: lerpArr(A[s].leg, (B[s] && B[s].leg) || A[s].leg, t) });
  return Object.assign({}, A, { head: lerpPt(A.head, B.head || A.head, t), torso: lerpArr(A.torso, B.torso || A.torso, t), near: side('near'), far: side('far') });
}

function poseSVG(key, ratio = 1, t = 0){
  const A = POSES[key], p = poseAt(key, t), pts = [];
  [A.torso, A.near.arm, A.near.leg, A.far.arm, A.far.leg].forEach(a => a.forEach(q => pts.push(q)));
  if (A.b){ ['near','far'].forEach(s => { if (A.b[s]) ['arm','leg'].forEach(k => A.b[s][k] && A.b[s][k].forEach(q => pts.push(q))); }); }
  pts.push(A.head);
  if (A.wall) pts.push([A.wall + 10, 40]);
  let x0 = Math.min(...pts.map(q => q[0])) - 26, x1 = Math.max(...pts.map(q => q[0])) + 26;
  let y0 = Math.min(...pts.map(q => q[1])) - 26, y1 = 176;
  let w = x1 - x0, h = y1 - y0;
  if (w / h < ratio){ const nw = h * ratio; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / ratio; y0 -= (nh - h) * 0.6; h = nh; }
  const hi = new Set(A.hi || []);
  const HI = (svg) => `<g class="glow" opacity=".62">${svg}</g>`;

  const legShape = (arr, near, k) => {
    const sk = near ? FIG.skin : FIG.skinF, sh = near ? FIG.shorts : FIG.shortsF, [hp, kn, an, to] = arr;
    const spine = [hp, kn, an], f = firstFrac(spine);
    const P = [[0,9.8],[f * .35,8.9],[f * .88,6.1],[f,5.7],[f + (1 - f) * .22,6.5],[f + (1 - f) * .6,4.6],[1,3.3]];
    const fd = unit(sub(to, an));
    let s = tube([[an[0] - fd[0] * 3, an[1] - fd[1] * 3], to], [[0,3.6],[.35,3.8],[1,2.3]], sk);
    s += tube(spine, P, sk);
    s += tube(spine, P, sh, 0, f * .58, true, false, .8);
    if (hi.has(k + 'Thigh')) s += HI(tube(spine, P, FIG.hi, f * .6, f * .97, false, false, .2));
    if (hi.has(k + 'Shin')) s += HI(tube(spine, P, FIG.hi, f + (1 - f) * .08, f + (1 - f) * .9, false, false, .2));
    return s;
  };
  const armShape = (arr, near) => {
    const sk = near ? FIG.skin : FIG.skinF, tp = near ? FIG.top : FIG.topF, [s0, el, hd] = arr;
    const ed = unit(sub(hd, el)), wr = lerpPt(el, hd, .72);
    const spine = [s0, el, wr], f = firstFrac(spine);
    const P = [[0,5.6],[f * .4,4.8],[f,3.8],[f + (1 - f) * .3,4.1],[1,2.7]];
    let s = tube([wr, [hd[0] + ed[0] * 2.5, hd[1] + ed[1] * 2.5]], [[0,2.7],[.5,3.3],[1,2.4]], sk);
    s += tube(spine, P, sk);
    s += tube(spine, P, tp, 0, f * .45, true, false, .9);
    return s;
  };

  let g = `<rect x="${r1(x0 - 400)}" y="${r1(y0 - 400)}" width="${r1(w + 800)}" height="${r1(h + 800)}" fill="${A.bg}"/>`;
  if (A.wall){
    const leftWall = A.wall < A.torso[1][0];
    const wx = leftWall ? x0 - 400 : A.wall, ww = leftWall ? A.wall + 10 - wx : x0 + w + 400 - A.wall;
    g += `<rect x="${r1(wx)}" y="${r1(y0 - 400)}" width="${r1(ww)}" height="${r1(166 - y0 + 400)}" fill="${A.wallC}"/>`;
  }
  // mat drawn as a slightly skewed slab, like a floor in perspective
  const xs = [p.near.leg[3][0], p.far.leg[3][0], p.near.leg[2][0], p.far.leg[2][0]];
  let mx0, mx1;
  if (A.lying){ mx0 = p.head[0] - 22; mx1 = Math.max(...A.far.leg.map(q => q[0]), ...A.near.leg.map(q => q[0])) + 16; }
  else { const c = xs.reduce((a, b) => a + b, 0) / 4; mx0 = c - 46; mx1 = c + 46; }
  g += `<path d="M${r1(mx0 + 7)} 158L${r1(mx1 + 7)} 158L${r1(mx1 - 3)} 168L${r1(mx0 - 3)} 168Z" fill="${A.mat}"/>`;

  // far limbs
  g += armShape(p.far.arm, false) + legShape(p.far.leg, false, 'f');
  if (A.torsoFront) g += legShape(p.near.leg, true, 'n');
  // neck, torso
  const sh0 = p.torso[0], hip = p.torso[1], td = unit(sub(hip, sh0));
  const tsp = [[sh0[0] - td[0] * 3, sh0[1] - td[1] * 3], hip];
  const TP = [[0,9.6],[.14,12],[.45,11.5],[.78,10.4],[1,11]];
  g += tube([sh0, lerpPt(sh0, p.head, .75)], [[0,5],[1,4.4]], FIG.skinF);
  g += tube(tsp, TP, FIG.top);
  g += tube(tsp, TP, FIG.shorts, .8, 1, false, true, .5);
  if (hi.has('lowback')) g += HI(tube(tsp, TP, FIG.hi, .52, .92, false, false, .3));
  if (!A.torsoFront) g += legShape(p.near.leg, true, 'n');
  if (hi.has('hip')) g += `<g class="glow"><ellipse cx="${r1(hip[0] + 3)}" cy="${r1(hip[1] - 4)}" rx="8.5" ry="6.5" fill="${FIG.hi}"/></g>`;
  // head
  const cv = unit(sub(p.head, sh0)), f = A.facing || 1, look = [-cv[1] * f, cv[0] * f];
  const ang = Math.atan2(cv[1], cv[0]) * 180 / Math.PI + 90;
  const ell = (c, rx, ry, fill) => `<ellipse cx="${r1(c[0])}" cy="${r1(c[1])}" rx="${rx}" ry="${ry}" transform="rotate(${r1(ang)} ${r1(c[0])} ${r1(c[1])})" fill="${fill}"/>`;
  g += ell([p.head[0] - look[0] * 2 + cv[0] * 1.4, p.head[1] - look[1] * 2 + cv[1] * 1.4], 10.4, 11.6, FIG.hair);
  g += ell([p.head[0] + look[0] * 1.3 - cv[0] * .9, p.head[1] + look[1] * 1.3 - cv[1] * .9], 9.4, 10.6, FIG.skin);
  g += `<circle cx="${r1(p.head[0] + look[0] * 10.2 - cv[0] * 1.5)}" cy="${r1(p.head[1] + look[1] * 10.2 - cv[1] * 1.5)}" r="2.1" fill="${FIG.skin}"/>`;
  g += `<ellipse cx="${r1(p.head[0] - look[0] * .8 - cv[0] * .5)}" cy="${r1(p.head[1] - look[1] * .8 - cv[1] * .5)}" rx="2" ry="2.8" transform="rotate(${r1(ang)} ${r1(p.head[0] - look[0] * .8 - cv[0] * .5)} ${r1(p.head[1] - look[1] * .8 - cv[1] * .5)})" fill="${FIG.nose}"/>`;
  if (A.extra) g += A.extra(p);
  g += armShape(p.near.arm, true);
  return `<svg viewBox="${r1(x0)} ${r1(y0)} ${r1(w)} ${r1(h)}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${g}</svg>`;
}
