/* ---------- Figure renderer v2 ---------- */
const FIG = { skin:'#E7B08A', skinF:'#C98E6C', hair:'#5A5450', shirt:'#2D4C78', shirtF:'#213A5D', shorts:'#2B3038', shortsF:'#1D2128',
  mat:'#C6CED8', matEdge:'#B4BDC9', wall:'#D2D8E0', floor:'#D6DCE3', shadow:'rgba(24,32,44,.13)', strap:'#2F8F83', tape:'#F5C518', tapeSoft:'#F7CF3D' };

const POSES = {
  march:{ facing:1, head:[120,30], torso:[[120,50],[120,98]],
    far:{arm:[[120,54],[131,75],[140,90]], leg:[[120,98],[119,130],[118,158],[129,161]]},
    near:{arm:[[120,54],[110,75],[103,91]], leg:[[120,98],[144,104],[142,132],[153,134]]},
    hi:[], period:1.3,
    b:{ far:{arm:[[120,54],[110,75],[103,91]], leg:[[120,98],[144,104],[142,132],[153,134]]},
        near:{arm:[[120,54],[131,75],[140,90]], leg:[[120,98],[119,130],[118,158],[129,161]]} } },
  swing:{ facing:1, wall:58, head:[112,30], torso:[[112,50],[112,98]],
    far:{arm:[[112,54],[94,63],[72,64]], leg:[[112,98],[111,130],[110,158],[121,161]]},
    near:{arm:[[112,54],[123,73],[129,89]], leg:[[112,98],[138,116],[160,130],[168,124]]},
    hi:['nThigh'], period:2.4,
    b:{ near:{arm:[[112,54],[104,74],[100,90]], leg:[[112,98],[103,129],[92,155],[99,161]]} } },
  strap:{ facing:1, mat:true, head:[42,142], torso:[[60,149],[120,151]],
    far:{arm:[[59,150],[82,132],[100,116]], leg:[[120,151],[154,152],[186,153],[191,145]]},
    near:{arm:[[61,147],[84,128],[103,112]], leg:[[120,151],[128,117],[136,83],[146,79]]},
    hi:['nThigh'], period:8,
    b:{ near:{arm:[[61,147],[82,126],[100,109]], leg:[[120,151],[125,117],[129,82],[139,77]]}, far:{arm:[[59,150],[80,130],[97,113]]} },
    extra:p => { const h = p.near.arm[2], f = p.near.leg[2], h2 = p.far.arm[2];
      return `<path d="M${h[0]} ${h[1]}L${f[0]+2} ${f[1]-2}M${h2[0]} ${h2[1]}L${f[0]+5} ${f[1]+2}" stroke="${FIG.strap}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`; } },
  fold:{ facing:1, torsoFront:true, head:[142,137], torso:[[132,120],[106,92]],
    far:{arm:[[132,120],[132,136],[127,149]], leg:[[106,92],[111,126],[115,158],[127,161]]},
    near:{arm:[[132,120],[128,136],[122,148]], leg:[[106,92],[107,126],[109,158],[121,161]]},
    hi:['nThigh','fThigh'], period:8,
    b:{ head:[139,143], torso:[[130,125],[106,92]],
        far:{arm:[[130,125],[129,141],[124,155]]}, near:{arm:[[130,125],[125,141],[118,154]]} } },
  calf:{ facing:1, wall:196, head:[163,41], torso:[[153,59],[128,100]],
    far:{arm:[[151,62],[171,71],[193,67]], leg:[[128,100],[152,124],[150,158],[162,161]]},
    near:{arm:[[153,60],[173,65],[193,60]], leg:[[128,100],[110,130],[93,157],[106,161]]},
    hi:['nShin'], period:8,
    b:{ head:[167,43], torso:[[157,61],[132,102]],
        far:{arm:[[155,64],[174,72],[193,67]], leg:[[132,102],[155,126],[150,158],[162,161]]},
        near:{arm:[[157,62],[175,66],[193,60]], leg:[[132,102],[112,131],[93,157],[106,161]]} } },
  soleus:{ facing:1, wall:196, head:[162,46], torso:[[152,64],[128,104]],
    far:{arm:[[150,67],[170,75],[193,72]], leg:[[128,104],[154,126],[152,158],[164,161]]},
    near:{arm:[[152,65],[172,70],[193,65]], leg:[[128,104],[115,134],[101,157],[113,161]]},
    hi:['nShin'], period:8,
    b:{ head:[162,50], torso:[[152,68],[127,109]],
        far:{arm:[[150,71],[171,78],[193,74]], leg:[[127,109],[155,129],[152,158],[164,161]]},
        near:{arm:[[152,69],[172,73],[193,68]], leg:[[127,109],[117,138],[101,157],[113,161]]} } },
  fig4:{ facing:1, mat:true, head:[42,142], torso:[[60,149],[120,151]],
    far:{arm:[[59,150],[94,137],[133,132]], leg:[[120,151],[150,117],[170,153],[183,156]]},
    near:{arm:[[61,147],[96,131],[137,126]], leg:[[120,151],[133,120],[154,116],[162,108]]},
    hi:['hip'], period:8,
    b:{ far:{arm:[[59,150],[90,134],[127,128]], leg:[[120,151],[144,113],[166,149],[179,153]]},
        near:{arm:[[61,147],[92,128],[131,122]], leg:[[120,151],[129,117],[149,112],[157,104]]} } },
  knees:{ facing:1, mat:true, head:[42,142], torso:[[60,149],[118,151]],
    far:{arm:[[59,150],[80,133],[99,122]], leg:[[118,151],[104,118],[131,107],[139,99]]},
    near:{arm:[[61,147],[82,129],[101,118]], leg:[[118,151],[100,121],[127,112],[135,104]]},
    hi:['lowback'], period:8,
    b:{ far:{arm:[[59,150],[77,132],[95,120]], leg:[[118,151],[100,116],[126,104],[134,96]]},
        near:{arm:[[61,147],[79,128],[97,116]], leg:[[118,151],[96,119],[122,109],[130,101]]} } },
};

const r1 = n => Math.round(n * 10) / 10;
function pill(a, b, ra, rb, fill){
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return `<path fill="${fill}" d="M${r1(a[0]+nx*ra)} ${r1(a[1]+ny*ra)}L${r1(b[0]+nx*rb)} ${r1(b[1]+ny*rb)}L${r1(b[0]-nx*rb)} ${r1(b[1]-ny*rb)}L${r1(a[0]-nx*ra)} ${r1(a[1]-ny*ra)}Z"/>`
       + `<circle cx="${r1(a[0])}" cy="${r1(a[1])}" r="${ra}" fill="${fill}"/><circle cx="${r1(b[0])}" cy="${r1(b[1])}" r="${rb}" fill="${fill}"/>`;
}
const lerpPt = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const lerpArr = (a, b, t) => a.map((p, i) => lerpPt(p, b[i], t));
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
  let x0 = Math.min(...pts.map(q => q[0])) - 24, x1 = Math.max(...pts.map(q => q[0])) + 24;
  let y0 = Math.min(...pts.map(q => q[1])) - 26, y1 = 172;
  let w = x1 - x0, h = y1 - y0;
  if (w / h < ratio){ const nw = h * ratio; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / ratio; y0 -= (nh - h) * 0.6; h = nh; }

  const hi = new Set(A.hi || []);
  const glowUnder = (a, b, ra, rb) => `<g class="glow" filter="url(#ttGlow)">${pill(a, b, ra + 5, rb + 5, FIG.tape)}</g>`;
  const glowOver = (a, b, ra, rb) => `<g opacity=".93">${pill(a, b, ra, rb, FIG.tapeSoft)}</g>`;

  const leg = (arr, near, k) => {
    const sk = near ? FIG.skin : FIG.skinF, sh = near ? FIG.shorts : FIG.shortsF, [hp, kn, an, to] = arr;
    let s = '';
    if (hi.has(k + 'Thigh')) s += glowUnder(hp, kn, 8.6, 6.3);
    if (hi.has(k + 'Shin')) s += glowUnder(kn, an, 6, 4.2);
    s += pill(an, to, 3.8, 2.7, sk) + pill(kn, an, 6, 4.1, sk) + pill(hp, kn, 8.6, 6.3, sk);
    s += pill(hp, lerpPt(hp, kn, .6), 9.8, 8.3, sh);
    if (hi.has(k + 'Thigh')) s += glowOver(hp, kn, 10, 6.4);
    if (hi.has(k + 'Shin')) s += glowOver(kn, an, 6, 4.1);
    return s;
  };
  const arm = (arr, near) => {
    const sk = near ? FIG.skin : FIG.skinF, sh = near ? FIG.shirt : FIG.shirtF, [s0, el, ha] = arr;
    return pill(el, ha, 4.1, 3.2, sk) + pill(s0, el, 5.1, 4.2, sk) + pill(s0, lerpPt(s0, el, .42), 6.4, 5.6, sh)
         + `<circle cx="${r1(ha[0])}" cy="${r1(ha[1])}" r="4" fill="${sk}"/>`;
  };

  let g = '';
  // ground
  if (A.mat){
    g += `<rect x="${r1(x0 + 12)}" y="157" width="${r1(w - 24)}" height="10" rx="5" fill="${FIG.matEdge}"/><rect x="${r1(x0 + 12)}" y="156" width="${r1(w - 24)}" height="7" rx="3.5" fill="${FIG.mat}"/>`;
  } else {
    const fx = (p.near.leg[3][0] + p.far.leg[3][0] + p.near.leg[2][0] + p.far.leg[2][0]) / 4;
    g += `<line x1="${r1(x0 + 12)}" y1="164" x2="${r1(x0 + w - 12)}" y2="164" stroke="${FIG.floor}" stroke-width="2" stroke-linecap="round"/>`;
    g += `<ellipse cx="${r1(fx)}" cy="164" rx="30" ry="3.6" fill="${FIG.shadow}"/>`;
  }
  if (A.wall) g += `<rect x="${A.wall}" y="${r1(y0 + 6)}" width="10" height="${r1(164 - y0 - 6)}" rx="3" fill="${FIG.wall}"/>`;

  // far side
  g += arm(p.far.arm, false) + leg(p.far.leg, false, 'f');
  if (A.torsoFront) g += leg(p.near.leg, true, 'n');
  // neck + torso
  const sh0 = p.torso[0], hip = p.torso[1];
  g += pill(sh0, lerpPt(sh0, p.head, .72), 4.8, 4.4, FIG.skinF);
  if (hi.has('lowback')) g += glowUnder(lerpPt(sh0, hip, .5), hip, 10.5, 10);
  g += `<circle cx="${r1(hip[0])}" cy="${r1(hip[1])}" r="10.6" fill="${FIG.shorts}"/>`;
  g += pill(sh0, lerpPt(sh0, hip, .86), 11.6, 10.6, FIG.shirt);
  if (hi.has('lowback')) g += glowOver(lerpPt(sh0, hip, .5), hip, 10.4, 10.4);
  if (hi.has('hip')) g += `<g class="glow" filter="url(#ttGlow)">` + `<circle cx="${r1(hip[0])}" cy="${r1(hip[1])}" r="15" fill="${FIG.tape}"/></g>`;
  // near leg
  if (!A.torsoFront) g += leg(p.near.leg, true, 'n');
  if (hi.has('hip')) g += `<g opacity=".93"><circle cx="${r1(hip[0] + 2)}" cy="${r1(hip[1] - 3)}" r="9.5" fill="${FIG.tape}"/></g>`;
  // head
  const cv = [p.head[0] - sh0[0], p.head[1] - sh0[1]], cl = Math.hypot(cv[0], cv[1]) || 1, crown = [cv[0] / cl, cv[1] / cl];
  const f = A.facing || 1, look = [-crown[1] * f, crown[0] * f];
  g += `<circle cx="${r1(p.head[0] - look[0] * 1.8 + crown[0] * 1.4)}" cy="${r1(p.head[1] - look[1] * 1.8 + crown[1] * 1.4)}" r="11.8" fill="${FIG.hair}"/>`;
  g += `<circle cx="${r1(p.head[0] + look[0] * 1.3 - crown[0] * .6)}" cy="${r1(p.head[1] + look[1] * 1.3 - crown[1] * .6)}" r="10.3" fill="${FIG.skin}"/>`;
  if (A.extra) g += A.extra(p);
  g += arm(p.near.arm, true);
  return `<svg viewBox="${r1(x0)} ${r1(y0)} ${r1(w)} ${r1(h)}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${g}</svg>`;
}
