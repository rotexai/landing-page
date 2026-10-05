import { Component, Fragment } from 'react'
import './landing.css'

// Turns a CSS declaration string ("a:b;c:d") into a React style object.
// The design's edge/arrow geometry arrives as raw CSS strings.
const css = (str) => {
  const out = {}
  for (const decl of String(str || '').split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const k = decl.slice(0, i).trim()
    out[k.startsWith('--') ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = decl.slice(i + 1).trim()
  }
  return out
}

class App extends Component {
  state = {};
  scenario() {
    return {
      prompt: 'Quản lý đơn hàng, kho và hoá đơn cho quán cà phê của tôi. Đơn lớn cần chủ quán duyệt.',
      brand: 'Cà Phê Mộc', domain: 'caphemoc.example.vn/don-hang',
      customer: 'Chị Lan', product: 'Cà phê rang mộc 500g', qty: 2, stock: 24,
      price: '185.000 ₫', total: '370.000 ₫', phone: '0912 345 678'
    };
  }
  seq() {
    const sc = this.scenario();
    const ty = (t) => Math.ceil(t.length / (t.length > 8 ? 2 : 1)) + 1;
    return [
      { id: 'idle', d: 6, cur: 0 },
      { id: 'toNew', d: 7, cur: 1 },
      { id: 'clickNew', d: 3, cur: 1, click: true },
      { id: 'toKhach', d: 7, cur: 2, open: true },
      { id: 'typeKhach', d: ty(sc.customer), cur: 2, open: true, field: 'khach' },
      { id: 'toHang', d: 6, cur: 3, open: true },
      { id: 'typeHang', d: ty(sc.product), cur: 3, open: true, field: 'hang' },
      { id: 'toSl', d: 6, cur: 4, open: true },
      { id: 'typeSl', d: 3, cur: 4, open: true, field: 'sl' },
      { id: 'toSdt', d: 6, cur: 5, open: true },
      { id: 'typeSdt', d: ty(sc.phone), cur: 5, open: true, field: 'sdt' },
      { id: 'toCreate', d: 6, cur: 6, open: true },
      { id: 'clickCreate', d: 3, cur: 6, open: true, click: true },
      { id: 'toConfirm', d: 9, cur: 7 },
      { id: 'clickConfirm', d: 3, cur: 7, click: true },
      { id: 'flow', d: 45, cur: 8 },
      { id: 'hold', d: 22, cur: 8 }
    ];
  }
  total() { return this.seq().reduce((a, x) => a + x.d, 0); }
  componentDidMount() {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      this.setState({ stage: 'ready', typed: this.scenario().prompt.length, b: 4, rk: this.total() - 1, reduce: true });
      return;
    }
    this.tick = setInterval(() => this.step(), 90);
  }
  componentWillUnmount() { clearInterval(this.tick); }
  step() {
    const s = this.state || {};
    this.setState({ g: (s.g ?? 0) + 1 });
    if (s.slT != null && s.slT !== (s.sl ?? 50)) {
      const cur = s.sl ?? 50;
      const diff = s.slT - cur;
      this.setState({ sl: Math.abs(diff) <= 12 ? s.slT : cur + Math.sign(diff) * 12 });
    }
    const stage = s.stage ?? 'typing';
    const k = (s.k ?? 0) + 1;
    const P = this.scenario().prompt;
    if (stage === 'typing') {
      const typed = Math.min(P.length, (s.typed ?? 0) + 2);
      this.setState(typed >= P.length ? { typed, stage: 'hold', k: 0 } : { typed, k });
    } else if (stage === 'hold') {
      this.setState(k > 8 ? { stage: 'building', k: 0, b: 0 } : { k });
    } else if (stage === 'building') {
      if (k % 9 === 0) {
        const b = (s.b ?? 0) + 1;
        this.setState(b >= 4 ? { stage: 'ready', b: 4, k: 0, rk: 0, picked: null } : { b, k });
      } else this.setState({ k });
    } else if (stage === 'ready') {
      const rk = (s.rk ?? 0) + 1;
      this.setState(rk >= this.total() ? { rk: 0, picked: null } : { rk });
    }
  }
  renderVals() {
    const blue = '#2445E8', orange = '#F26A1B';
    const s = this.state || {};
    const stage = s.stage ?? 'typing';
    const sc = this.scenario();
    const typed = s.typed ?? 0;
    const picked = s.picked;
    const fmt = (ms) => (ms / 1000).toFixed(2).replace('.', ',') + ' s';
    const isIdle = stage === 'typing' || stage === 'hold';
    const isBuilding = stage === 'building';
    const isReady = stage === 'ready';
    const b = Math.min(s.b ?? 0, 4);

    // ---------- composer ----------
    const typedText = isIdle ? sc.prompt.slice(0, typed) : sc.prompt;
    const skel = [86, 52, 52, 52, 64].map((h, i) => ({ h, bg: i <= b ? '#E2E7EB' : '#F1F4F6' }));
    const btNames = ['Bảng dữ liệu: khách, hàng, đơn, hoá đơn', 'Luồng xử lý: Xác nhận đơn', 'Giao diện: màn hình Đơn hàng', 'Nối nút bấm với luồng'];
    const btasks = btNames.map((label, i) => {
      const st = b > i ? 'done' : b === i ? 'run' : 'wait';
      return {
        label, done: st === 'done',
        dot: st === 'done' ? blue : st === 'run' ? orange : '#E2E7EB',
        dotClass: st === 'run' ? 'rx-pulse' : '',
        border: st === 'run' ? orange : '#E2E7EB',
        bg: st === 'run' ? '#FFF7F2' : '#FFFFFF',
        color: st === 'wait' ? '#55626E' : '#0E1A24'
      };
    });

    // ---------- scripted loop (web UI + flow) ----------
    const rk = s.rk ?? 0;
    const seq = this.seq();
    const starts = {};
    let acc = 0;
    seq.forEach((st) => { starts[st.id] = acc; acc += st.d; });
    let idx = seq.length - 1, off = 0;
    for (let i = 0; i < seq.length; i++) {
      if (rk < starts[seq[i].id] + seq[i].d) { idx = i; off = rk - starts[seq[i].id]; break; }
    }
    const cs = seq[idx];
    const idxOf = (id) => seq.findIndex((x) => x.id === id);
    const popOpen = isReady && !!cs.open;
    const orderAdded = isReady && idx > idxOf('clickCreate');
    const rkf = rk - (starts['clickConfirm'] + 2);
    const flowStarted = isReady && rkf >= 0;
    const p = flowStarted ? Math.min(5, Math.floor(rkf / 9)) : 0;
    const run = flowStarted && p < 5;
    const finished = flowStarted && !run;

    const fieldDefs = { khach: sc.customer, hang: sc.product, sl: String(sc.qty), sdt: sc.phone };
    const phs = { khach: 'Tên khách', hang: 'Chọn hàng', sl: 'Số lượng', sdt: 'Số điện thoại' };
    const ff = {};
    Object.keys(fieldDefs).forEach((key) => {
      const full = fieldDefs[key];
      const si = seq.findIndex((x) => x.field === key);
      let text = '';
      if (idx > si) text = full;
      else if (idx === si) text = full.slice(0, off * (full.length > 8 ? 2 : 1));
      ff[key] = { text: text || phs[key], color: text ? '#0E1A24' : '#6B7886', border: idx === si ? blue : '#C9D1D8', caret: idx === si };
    });

    const targets = [
      { x: 'calc(50% - 190px)', y: 300 }, { x: 'calc(50% - 70px)', y: 100 },
      { x: '118px', y: 231 }, { x: '118px', y: 311 }, { x: '98px', y: 391 }, { x: '275px', y: 391 },
      { x: '313px', y: 448 }, { x: 'calc(50% - 83px)', y: 170 }, { x: 'calc(50% - 150px)', y: 330 }
    ];
    const tg = targets[cs.cur];
    const clicking = !!cs.click && off < 2;
    const hovConfirm = cs.id === 'clickConfirm' || (cs.id === 'toConfirm' && off >= 6);

    // ---------- portal graph ----------
    const after = sc.stock - sc.qty;
    const raw = [
      { name: 'Lưu đơn', input: sc.customer + ', ' + sc.product + ' × ' + sc.qty, output: 'Đơn #1042 đã lưu', ms: 120 },
      { name: 'Kiểm tra kho', input: sc.product + ' × ' + sc.qty, output: 'Còn ' + sc.stock + ', đủ hàng', ms: 80 },
      { name: 'Trừ kho', input: sc.stock + ' − ' + sc.qty, output: 'Còn ' + after, ms: 50 },
      { name: 'Tạo hoá đơn', input: sc.qty + ' × ' + sc.price, output: 'HD-1042, ' + sc.total, ms: 210 },
      { name: 'Nhắn khách', input: 'SĐT ' + sc.phone, output: 'Đã gửi tin cho khách', ms: 400 }
    ];
    const state = (i) => i < p ? 'done' : (i === p && run ? 'run' : 'wait');
    const pct = (x) => (x / 628 * 100).toFixed(3) + '%';
    const defs = [
      { id: 'trig', name: 'Nút Xác nhận', x: 4, y: 8, kind: 'trig' },
      { id: 'luu', step: 0, name: 'Lưu đơn', x: 168, y: 8 },
      { id: 'kho', step: 1, name: 'Kiểm tra kho', x: 332, y: 8 },
      { id: 'tru', step: 2, name: 'Trừ kho', x: 496, y: 8 },
      { id: 'het', name: 'Báo hết hàng', x: 332, y: 95, kind: 'skip' },
      { id: 'hd', step: 3, name: 'Tạo hoá đơn', x: 496, y: 95 },
      { id: 'sms', step: 4, name: 'Nhắn khách', x: 496, y: 182 }
    ];
    const sts = {};
    defs.forEach((df) => { sts[df.id] = df.kind === 'trig' ? (flowStarted ? 'done' : 'wait') : df.kind === 'skip' ? 'skip' : state(df.step); });
    const selId = picked || (flowStarted ? (run ? ['luu', 'kho', 'tru', 'hd', 'sms'][Math.min(p, 4)] : 'sms') : 'trig');
    const look = {
      done: { bg: '#EEF1FE', border: '#2445E8', color: '#0E1A24', bs: 'solid' },
      run: { bg: '#FFF7F2', border: '#F26A1B', color: '#0E1A24', bs: 'solid' },
      err: { bg: '#FDECEA', border: '#B42318', color: '#0E1A24', bs: 'solid' },
      wait: { bg: '#FFFFFF', border: '#C9D1D8', color: '#55626E', bs: 'solid' },
      skip: { bg: '#F5F7F8', border: '#B6C0CA', color: '#55626E', bs: 'dashed' }
    };
    const nodes = defs.map((df) => {
      const st = sts[df.id];
      const isTrig = df.kind === 'trig';
      const lk = isTrig ? { bg: '#0E1A24', border: '#0E1A24', color: '#FFFFFF', bs: 'solid' } : look[st];
      const ms = df.step != null ? raw[df.step].ms : 0;
      const sub = isTrig ? (flowStarted ? 'Đơn #1042' : 'chờ thao tác') : st === 'done' ? fmt(ms) : st === 'run' ? 'đang chạy' : st === 'skip' ? 'không chạy' : '';
      const isSel = selId === df.id;
      return {
        name: df.name, sub,
        left: pct(df.x), top: df.y + 'px', w: pct(128),
        bg: lk.bg, border: lk.border, bs: lk.bs, color: lk.color,
        subColor: isTrig ? '#C9D1D8' : '#55626E',
        pulse: st === 'run' ? 'rx-pulse' : '',
        sel: isSel,
        shadow: isSel ? '0 0 0 3px rgba(36,69,232,.28)' : 'none',
        pick: () => this.setState({ picked: picked === df.id ? null : df.id })
      };
    });
    const edgeDefs = [
      { from: [132, 38], to: [168, 38], dir: 'h', target: 'luu' },
      { from: [296, 38], to: [332, 38], dir: 'h', target: 'kho' },
      { from: [460, 38], to: [496, 38], dir: 'h', target: 'tru' },
      { from: [396, 68], to: [396, 95], dir: 'v', target: 'het' },
      { from: [560, 68], to: [560, 95], dir: 'v', target: 'hd' },
      { from: [560, 155], to: [560, 182], dir: 'v', target: 'sms' }
    ];
    const edges = edgeDefs.map((ed) => {
      const ts = sts[ed.target];
      const es = ts === 'run' ? 'active' : (ts === 'done' || ts === 'err') ? 'done' : ts === 'skip' ? 'skip' : 'wait';
      const col = es === 'done' ? '#2445E8' : es === 'active' ? '#F26A1B' : es === 'skip' ? '#B6C0CA' : '#C9D1D8';
      const ang = ed.dir === 'h' ? '90deg' : '180deg';
      const bg = es === 'active' ? 'repeating-linear-gradient(' + ang + ', #F26A1B 0 6px, transparent 6px 12px)'
        : es === 'skip' ? 'repeating-linear-gradient(' + ang + ', #B6C0CA 0 4px, transparent 4px 8px)' : col;
      const extra = es === 'active' ? (ed.dir === 'h' ? 'animation: rxdashx .5s linear infinite;' : 'animation: rxdashy .5s linear infinite;') : '';
      const arrow = ed.dir === 'h'
        ? 'position:absolute;right:-1px;top:50%;margin-top:-5px;width:0;height:0;border-left:8px solid ' + col + ';border-top:5px solid transparent;border-bottom:5px solid transparent;'
        : 'position:absolute;bottom:-1px;left:50%;margin-left:-5px;width:0;height:0;border-top:8px solid ' + col + ';border-left:5px solid transparent;border-right:5px solid transparent;';
      const geo = ed.dir === 'h'
        ? { left: pct(ed.from[0]), top: (ed.from[1] - 1.5) + 'px', w: pct(ed.to[0] - ed.from[0]), h: '3px' }
        : { left: 'calc(' + pct(ed.from[0]) + ' - 1.5px)', top: ed.from[1] + 'px', w: '3px', h: (ed.to[1] - ed.from[1]) + 'px' };
      return { left: geo.left, top: geo.top, w: geo.w, h: geo.h, bg, extra, arrow };
    });
    const ports = [[132, 38], [296, 38], [460, 38], [396, 68], [560, 68], [560, 155]].map((q) => ({ left: 'calc(' + pct(q[0]) + ' - 5px)', top: (q[1] - 5) + 'px' }));
    const ss = sts[selId];
    const dm = {
      trig: flowStarted
        ? { name: 'Nút Xác nhận', input: 'Đơn #1042 trên màn hình Đơn hàng', output: 'Bắt đầu luồng Xác nhận đơn', status: 'Đã kích hoạt' }
        : { name: 'Nút Xác nhận', input: '—', output: 'Chưa có sự kiện', status: 'Chờ thao tác' },
      het: { name: 'Báo hết hàng', input: '—', output: 'Không chạy vì kho còn đủ hàng', status: 'Nhánh này không được dùng' }
    };
    const dfSel = defs.find((x) => x.id === selId);
    const d = dm[selId] || {
      name: dfSel.name,
      input: raw[dfSel.step].input,
      output: ss === 'done' ? raw[dfSel.step].output : ss === 'run' ? 'đang xử lý' : 'chưa chạy',
      status: ss === 'done' ? 'Thành công, ' + fmt(raw[dfSel.step].ms) : ss === 'run' ? 'Đang chạy' : 'Chờ'
    };
    d.outColor = '#0E1A24';
    const runText = !flowStarted ? 'Chờ thao tác' : run ? 'Đang chạy · ' + p + '/5' : 'Hoàn tất · 5/5 · 0,86 s';
    const runBg = !flowStarted ? '#EEF1F3' : run ? '#FFF1E8' : '#EEF1FE';
    const runColor = !flowStarted ? '#55626E' : run ? '#8A3306' : '#1B35B8';

    // ---------- scenes below the hero ----------
    const g = s.g ?? 0;
    const reduce = !!s.reduce;
    const T = (L) => (reduce ? L - 1 : g % L);
    const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const ringOf = (t, list) => list.some((a) => t >= a && t < a + 2);

    // A. black box vs glass box
    const tA = T(68);
    const aF = tA < 4 ? 0 : tA < 16 ? 0.5 * (tA - 4) / 12 : tA < 34 ? 0.5 : tA < 44 ? 0.5 + 0.5 * (tA - 34) / 10 : 1;
    const bF = cl((tA - 4) / 36, 0, 1);
    const sA = {
      aDot: ((0.5 + aF * 2) / 3 * 100).toFixed(2),
      aDotOp: ((tA >= 4 && tA < 16) || (tA >= 34 && tA < 44)) ? 1 : 0,
      aFillW: (aF * 66.667).toFixed(2) + '%',
      aPulse: (tA >= 16 && tA < 34) ? 'rx-pulse' : '',
      aResOp: tA >= 44 ? 1 : 0,
      bDot: ((0.5 + bF * 6) / 7 * 100).toFixed(2),
      bDotOp: (tA >= 4 && tA < 40) ? 1 : 0,
      bFillW: (bF * 85.714).toFixed(2) + '%'
    };
    const bNames = [['Lưu đơn', '0,12 s'], ['Kiểm tra kho', '0,08 s'], ['Trừ kho', '0,05 s'], ['Tạo hoá đơn', '0,21 s'], ['Nhắn khách', 'số thiếu']];
    const bcols = [{ label: 'Bấm nút', sub: '', bg: '#0E1A24', border: '#0E1A24', color: '#FFFFFF', subColor: '#C9D1D8', pulse: '', op: 1 }]
      .concat(bNames.map((nm, i) => {
        const k = i + 1, thr = k / 6;
        const st = bF >= thr + 0.09 ? (k === 5 ? 'err' : 'done') : bF >= thr - 0.03 ? 'run' : 'wait';
        const lk = { done: ['#EEF1FE', '#2445E8'], run: ['#FFF7F2', '#F26A1B'], err: ['#FDECEA', '#B42318'], wait: ['#FFFFFF', '#C9D1D8'] }[st];
        return { label: nm[0], sub: (st === 'done' || st === 'err') ? nm[1] : st === 'run' ? '…' : '', bg: lk[0], border: lk[1], color: st === 'wait' ? '#55626E' : '#0E1A24', subColor: st === 'err' ? '#8E1B10' : '#55626E', pulse: st === 'run' ? 'rx-pulse' : '', op: 1 };
      }))
      .concat([{ label: 'Tồn kho: 22', sub: 'xem lại được', bg: '#EEF1FE', border: '#2445E8', color: '#0E1A24', subColor: '#55626E', pulse: '', op: bF >= 1 ? 1 : 0 }]);

    // B. every interaction = a run
    const tB = T(96);
    const qLen = (tB >= 20 && tB < 52) ? Math.min(4, tB - 19) : 0;
    const filtered = qLen >= 4;
    const dueDone = tB >= 40;
    const curB = tB < 8 ? ['calc(50% - 120px)', '260px'] : tB < 31 ? ['150px', '98px'] : tB < 52 ? ['calc(100% - 56px)', '166px'] : ['calc(100% - 76px)', '228px'];
    const tipTextB = (tB >= 15 && tB < 31) ? 'Luồng: Tìm đơn' : (tB >= 36 && tB < 46) ? 'Luồng: Duyệt đơn' : (tB >= 62 && tB < 72) ? 'Luồng: Mở hoá đơn' : '';
    const sB = {
      q: qLen > 0 ? 'Quán'.slice(0, qLen) : 'Tìm đơn, khách…',
      qColor: qLen > 0 ? '#0E1A24' : '#6B7886',
      qBorder: (tB >= 15 && tB < 52) ? '#2445E8' : '#C9D1D8',
      caret: tB >= 15 && tB < 52,
      showOthers: !filtered,
      pillText: dueDone ? 'Đã duyệt' : 'Chờ duyệt',
      pillBg: dueDone ? '#EEF1FE' : '#FFF1E8',
      pillColor: dueDone ? '#1B35B8' : '#8A3306',
      btnText: dueDone ? 'Đã duyệt' : 'Duyệt',
      btnBg: dueDone ? '#EEF1FE' : (tB >= 36 ? '#2445E8' : '#0E1A24'),
      btnColor: dueDone ? '#1B35B8' : '#FFFFFF',
      invShow: tB >= 66,
      noEv: tB < 26,
      cx: curB[0], cy: curB[1],
      ringOp: ringOf(tB, [15, 38, 64]) ? 1 : 0, ringScale: ringOf(tB, [15, 38, 64]) ? 1 : 0.4,
      tipText: tipTextB, tipOp: tipTextB ? 1 : 0, tipSide: tB < 31 ? 'left: 14px;' : 'right: 12px;'
    };
    const evDefs = [
      { at: 26, title: 'Tìm đơn “Quán”', dots: 1, ms: '0,05 s', dur: 6 },
      { at: 40, title: 'Duyệt đơn #1040', dots: 3, ms: '0,31 s', dur: 10 },
      { at: 66, title: 'Mở hoá đơn #1041', dots: 2, ms: '0,12 s', dur: 6 }
    ];
    const evs = evDefs.filter((e) => tB >= e.at).reverse().map((e) => {
      const running = tB < e.at + e.dur;
      return { title: e.title, sub: e.dots + ' bước' + (running ? '' : ' · ' + e.ms), dots: Array(e.dots).fill('●').join(' '), dotsColor: running ? '#F26A1B' : '#2445E8', chipText: running ? 'Đang chạy' : 'Thành công', chipBg: running ? '#FFF1E8' : '#EEF1FE', chipColor: running ? '#8A3306' : '#1B35B8' };
    });

    // C. build by chatting
    const tC = T(88);
    const msgC = 'Đơn trên 2 triệu thì chủ quán phải duyệt trước khi trừ kho.';
    const cTyped = tC < 4 ? 0 : Math.min(msgC.length, (tC - 3) * 2);
    const cReply = tC >= 36, cNew = tC >= 40, cApplied = tC >= 62;
    const curC = tC < 50 ? ['calc(55% + 20px)', '45%'] : ['88px', 'calc(100% - 46px)'];
    const sC = {
      typed: msgC.slice(0, cTyped), caret: tC >= 4 && tC < 36, userOp: cTyped > 0 ? 1 : 0,
      replyOp: cReply ? 1 : 0,
      applyText: cApplied ? 'Đã áp dụng' : 'Áp dụng',
      applyBg: !cReply ? '#E2E7EB' : cApplied ? '#EEF1FE' : (tC >= 60 ? '#1B35B8' : '#2445E8'),
      applyColor: !cReply ? '#6B7886' : cApplied ? '#1B35B8' : '#FFFFFF',
      labelOp: cNew ? 1 : 0,
      cx: curC[0], cy: curC[1], ringOp: ringOf(tC, [60]) ? 1 : 0, ringScale: ringOf(tC, [60]) ? 1 : 0.4
    };
    const p6 = (x) => (x / 640 * 100).toFixed(3) + '%';
    const newBg = cApplied ? '#EEF1FE' : '#FFF7F2', newBd = cApplied ? '#2445E8' : '#F26A1B';
    const cNodes = [
      { name: 'Nhận đơn', x: 8, y: 120, nw: false }, { name: 'Đơn > 2 triệu?', x: 168, y: 120, nw: true },
      { name: 'Trừ kho', x: 328, y: 120, nw: false }, { name: 'Tạo hoá đơn', x: 488, y: 120, nw: false },
      { name: 'Chờ chủ duyệt', x: 328, y: 22, nw: true }
    ].map((n) => {
      const vis = !n.nw || cNew;
      return { name: n.name, left: p6(n.x), top: n.y + 'px', w: p6(120), bg: n.nw ? newBg : '#FFFFFF', border: n.nw ? newBd : '#C9D1D8', op: vis ? 1 : 0, scale: vis ? 1 : 0.85, sub: n.nw ? (cApplied ? 'đã áp dụng' : 'mới') : '', subColor: cApplied ? '#1B35B8' : '#8A3306' };
    });
    const ecol = (nw) => nw ? (cApplied ? '#2445E8' : '#F26A1B') : '#B6C0CA';
    const cEdges = [
      { k: 'h', x1: 128, x2: 328, y: 148, nw: false, vis: !cNew, ar: 'r' },
      { k: 'h', x1: 128, x2: 168, y: 148, nw: true, vis: cNew, ar: 'r' },
      { k: 'h', x1: 288, x2: 328, y: 148, nw: true, vis: cNew, ar: 'r' },
      { k: 'h', x1: 448, x2: 488, y: 148, nw: false, vis: true, ar: 'r' },
      { k: 'v', x: 228, y1: 50, y2: 120, nw: true, vis: cNew, ar: '' },
      { k: 'h', x1: 228, x2: 328, y: 50, nw: true, vis: cNew, ar: 'r' },
      { k: 'h', x1: 448, x2: 548, y: 50, nw: true, vis: cNew, ar: '' },
      { k: 'v', x: 548, y1: 50, y2: 120, nw: true, vis: cNew, ar: 'd' }
    ].map((e) => {
      const col = ecol(e.nw);
      const arrow = e.ar === 'r' ? 'position:absolute;right:-1px;top:50%;margin-top:-5px;width:0;height:0;border-left:8px solid ' + col + ';border-top:5px solid transparent;border-bottom:5px solid transparent;'
        : e.ar === 'd' ? 'position:absolute;bottom:-1px;left:50%;margin-left:-5px;width:0;height:0;border-top:8px solid ' + col + ';border-left:5px solid transparent;border-right:5px solid transparent;' : '';
      const geo = e.k === 'h' ? { left: p6(e.x1), top: (e.y - 1.5) + 'px', w: p6(e.x2 - e.x1), h: '3px' } : { left: 'calc(' + p6(e.x) + ' - 1.5px)', top: e.y1 + 'px', w: '3px', h: (e.y2 - e.y1) + 'px' };
      return { left: geo.left, top: geo.top, w: geo.w, h: geo.h, bg: col, op: e.vis ? 1 : 0, arrow };
    });

    // D. test before applying
    const tD = T(98);
    const dCount = tD < 4 ? 0 : Math.min(120, (tD - 3) * 3);
    const dApplied = tD >= 72;
    const curD = tD < 62 ? ['calc(60% + 40px)', '35%'] : ['99px', 'calc(100% - 46px)'];
    const sD = {
      count: dCount, barW: (dCount / 120 * 100).toFixed(1) + '%', statsOp: tD >= 46 ? 1 : 0,
      applyText: dApplied ? 'Đã áp dụng' : 'Áp dụng quy tắc',
      applyBg: tD < 58 ? '#E2E7EB' : dApplied ? '#EEF1FE' : (tD >= 70 ? '#1B35B8' : '#2445E8'),
      applyColor: tD < 58 ? '#6B7886' : dApplied ? '#1B35B8' : '#FFFFFF',
      cx: curD[0], cy: curD[1], ringOp: ringOf(tD, [70]) ? 1 : 0, ringScale: ringOf(tD, [70]) ? 1 : 0.4
    };
    const dRows = [
      { at: 50, id: '#0987', before: '2.400.000 ₫', after: '2.280.000 ₫', diff: '−5%' },
      { at: 54, id: '#1011', before: '3.150.000 ₫', after: '2.992.500 ₫', diff: '−5%' },
      { at: 58, id: '#1029', before: '2.050.000 ₫', after: '1.947.500 ₫', diff: '−5%' }
    ].filter((r) => tD >= r.at);

    // E. track events
    const tE = T(72);
    const eAll = [
      { at: 6, title: 'Xác nhận đơn #1042', sub: '5/5 bước · 0,86 s', ok: true },
      { at: 14, title: 'Xác nhận đơn #1043', sub: '5/5 bước · 0,79 s', ok: true },
      { at: 22, title: 'Xác nhận đơn #1044', sub: '4/5 bước · 0,52 s', ok: false }
    ];
    const eSel = tE >= 41;
    const eEvents = eAll.filter((x) => tE >= x.at).reverse().map((x) => ({
      title: x.title, sub: x.sub,
      chipText: x.ok ? 'Thành công' : 'Lỗi ở Nhắn khách', chipBg: x.ok ? '#EEF1FE' : '#FDECEA', chipColor: x.ok ? '#1B35B8' : '#8E1B10',
      bg: (!x.ok && eSel) ? '#F3F5FE' : (!x.ok ? '#FDF5F4' : '#FFFFFF')
    }));
    const curE = tE < 30 ? ['calc(25% + 40px)', '70%'] : ['260px', '101px'];
    const sE = { sel: eSel, noSel: !eSel, cx: curE[0], cy: curE[1], ringOp: ringOf(tE, [40]) ? 1 : 0, ringScale: ringOf(tE, [40]) ? 1 : 0.4 };
    const eChain = [['Lưu đơn', '0,12 s'], ['Kiểm tra kho', '0,08 s'], ['Trừ kho', '0,05 s'], ['Tạo hoá đơn', '0,21 s'], ['Nhắn khách', 'lỗi']].map((n, i) => {
      const err = i === 4;
      return { name: n[0], sub: n[1], bg: err ? '#FDECEA' : '#EEF1FE', border: err ? '#B42318' : '#2445E8', subColor: err ? '#8E1B10' : '#55626E', line: i < 4, lineColor: '#2445E8' };
    });

    // F. gallery
    const tG = T(48);
    const gdefs = [
      { title: 'Bán hàng & hoá đơn', line: 'Từ đơn đến hoá đơn, mỗi bước đều xem được.', bars: [92, 70, 80], nodes: ['Lưu đơn', 'Trừ kho', 'Hoá đơn'] },
      { title: 'Kho & nhập hàng', line: 'Nhập, xuất và cảnh báo khi sắp hết.', bars: [60, 88, 45], nodes: ['Nhận hàng', 'Cộng kho', 'Báo sắp hết'] },
      { title: 'Duyệt chi phí', line: 'Ai duyệt, khi nào, vì sao bị từ chối.', bars: [80, 55, 70], nodes: ['Gửi đề nghị', 'Chờ duyệt', 'Thanh toán'] },
      { title: 'Công nợ khách hàng', line: 'Ghi nợ, nhắc hạn, ghi thu.', bars: [75, 90, 50], nodes: ['Ghi nợ', 'Nhắc hạn', 'Ghi thu'] }
    ];
    const glk = { done: ['#EEF1FE', '#2445E8'], run: ['#FFF7F2', '#F26A1B'], wait: ['#FFFFFF', '#C9D1D8'] };
    const gallery = gdefs.map((c, ci) => {
      const a = (Math.floor(tG / 12) + ci) % 4;
      const o = { title: c.title, line: c.line, w1: c.bars[0] + '%', w2: c.bars[1] + '%', w3: c.bars[2] + '%' };
      for (let i = 0; i < 3; i++) {
        const st = a > i ? 'done' : a === i ? 'run' : 'wait';
        o['n' + (i + 1)] = c.nodes[i]; o['b' + (i + 1)] = glk[st][0]; o['c' + (i + 1)] = glk[st][1];
      }
      return o;
    });

    // ---------- before/after slider ----------
    const sl = Math.max(0, Math.min(100, s.sl ?? 50));
    const setSl = (v) => {
      if (this.tick) this.setState({ slT: v });
      else this.setState({ sl: v, slT: v });
    };
    const onSlide = (e) => {
      const el = (e && e.target) || (typeof document !== 'undefined' ? document.getElementById('rx-ba') : null);
      if (!el) return;
      const v = Math.max(0, Math.min(100, Number(el.value)));
      this.setState({ sl: v, slT: v });
    };
    const views = [['Ứng dụng', 100], ['Cả hai', 50], ['Luồng', 0]].map(([label, v]) => {
      const on = v === 100 ? sl >= 92 : v === 0 ? sl <= 8 : (sl > 8 && sl < 92);
      return { label, on, bg: on ? '#FFFFFF' : 'transparent', color: on ? '#0E1A24' : '#55626E', pick: () => setSl(v) };
    });

    return {
      // slider
      sl, pos: sl + '%', clipR: (100 - sl) + '%', clipL: sl + '%',
      onSlide, views,
      // composer + stages
      typedText,
      showCaret: isIdle,
      skel, btasks,
      isIdle, isBuilding, isReady,
      submit: () => this.setState(isReady ? { stage: 'typing', typed: 0, k: 0, b: 0, rk: 0, picked: null } : { stage: 'building', k: 0, b: 0 }),
      cur: { customer: sc.customer, productQty: sc.product + ' × ' + sc.qty, total: sc.total, brand: sc.brand, domain: sc.domain, product: sc.product },
      // scripted web UI
      popOpen, orderAdded, ff,
      newBg: cs.id === 'clickNew' ? '#0E1A24' : '#FFFFFF',
      newColor: cs.id === 'clickNew' ? '#FFFFFF' : '#0E1A24',
      createBg: cs.id === 'clickCreate' ? '#1B35B8' : '#2445E8',
      row1Bg: idx <= idxOf('toConfirm') ? '#F3F5FE' : '#FFFFFF',
      tipOp: (hovConfirm || (flowStarted && rkf < 6)) ? 1 : 0,
      cx: tg.x, cy: tg.y,
      curOp: isReady ? 1 : 0,
      ringOp: clicking ? 1 : 0,
      ringScale: clicking ? 1 : 0.4,
      stText: p >= 1 ? 'Đã xác nhận' : 'Mới',
      stBg: p >= 1 ? '#EEF1FE' : '#FFF1E8',
      stColor: p >= 1 ? '#1B35B8' : '#8A3306',
      stock: p >= 3 ? sc.stock + ' → ' + after : String(sc.stock),
      stockBg: p >= 3 ? '#FFF1E8' : '#F5F7F8',
      invBg: p >= 4 ? '#EEF1FE' : '#FFFFFF',
      invText: p >= 4 ? 'HD-1042 · ' + sc.total : '—',
      smsShow: p >= 5,
      toastText: 'Đã gửi tin xác nhận cho khách',
      btnLabel: run ? 'Đang xử lý…' : finished ? 'Đã xác nhận' : 'Xác nhận',
      btnBg: run ? '#55626E' : finished ? '#EEF1FE' : hovConfirm ? '#2445E8' : '#0E1A24',
      btnColor: finished ? '#1B35B8' : '#FFFFFF',
      // portal
      flowStarted,
      evText: run ? 'Đang chạy' : 'Thành công',
      evBg: run ? '#FFF1E8' : '#EEF1FE',
      evColor: run ? '#8A3306' : '#1B35B8',
      evSub: p + '/5 bước' + (finished ? ' · 0,86 s' : ''),
      nodes, edges, ports, d, runText, runBg, runColor,
      dBg: '#F5F7F8', dBorder: '#E2E7EB',
      // scenes
      sA, bcols, sB, evs, sC, cNodes, cEdges, sD, dRows, sE, eEvents, eChain, gallery
    };
  }

  render() {
    const V = this.renderVals()
    return (
      <div style={{fontFamily: "'Be Vietnam Pro', system-ui, sans-serif", color: "#0E1A24", background: "#F5F7F8", textWrap: "pretty"}}>

      {/* NAV */}
      <header className="rx-pad" style={{padding: "0 48px", borderBottom: "1px solid #D9DFE4", background: "#F5F7F8"}}>
      <div style={{maxWidth: "1240px", margin: "0 auto", minHeight: "72px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px"}}>
      <a href="#top" style={{display: "flex", alignItems: "center", gap: "10px"}} aria-label="RotexAI">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><rect x="1" y="1" width="24" height="24" rx="6" stroke="#0E1A24" strokeWidth="1.6"></rect><circle cx="8" cy="9" r="2.4" fill="#2445E8"></circle><circle cx="18" cy="13" r="2.4" fill="#2445E8"></circle><circle cx="9" cy="18.5" r="2.4" fill="#F26A1B"></circle><path d="M10 9.6l6 2.6M16.2 14.2l-5.4 3.2" stroke="#0E1A24" strokeWidth="1.3"></path></svg>
      <span className="rx-h2" style={{fontWeight: "700", fontSize: "21px", letterSpacing: "-0.02em"}}>RotexAI</span>
      </a>
      <nav aria-label="Chính" style={{display: "flex", flexWrap: "wrap", gap: "30px", fontSize: "15px", fontWeight: "500"}}>
      <a href="#khac-biet">Vì sao khác</a>
      <a href="#ung-dung">Ứng dụng web</a>
      <a href="#cong-xay-dung">Cổng xây dựng</a>
      </nav>
      <div style={{display: "flex", alignItems: "center", gap: "18px"}}>
      <a href="#" style={{fontSize: "14px", fontWeight: "600", color: "#55626E"}}>EN</a>
      <a href="https://portal.rotexai.com" style={{display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 20px", borderRadius: "999px", background: "#0E1A24", color: "#FFFFFF", fontWeight: "600", fontSize: "15px"}}>Bắt đầu</a>
      </div>
      </div>
      </header>

      {/* HERO */}
      <section id="top" className="rx-pad rx-dots" style={{padding: "72px 48px 80px", borderBottom: "1px solid #D9DFE4"}}>
      <div style={{maxWidth: "1240px", margin: "0 auto"}}>
      <h1 className="rx-h1" style={{margin: "0 auto", maxWidth: "900px", textAlign: "center", fontSize: "68px", lineHeight: "1", fontWeight: "750", letterSpacing: "-0.045em"}}>Dựng ERP bằng một câu. Xem từng bước nó chạy.</h1>
      <p style={{margin: "22px auto 0", maxWidth: "560px", textAlign: "center", fontSize: "18px", lineHeight: "1.55", color: "#3A4652"}}>Mô tả doanh nghiệp của bạn. RotexAI dựng ứng dụng, rồi cho bạn nhìn thấy logic bên trong.</p>

      {/* composer */}
      <div style={{maxWidth: "760px", margin: "36px auto 0", background: "#FFFFFF", border: "1px solid #C9D1D8", borderRadius: "24px", padding: "18px 18px 14px", boxShadow: "0 28px 60px -34px rgba(14,26,36,.35)"}}>
      <div style={{minHeight: "84px", padding: "6px 8px", fontSize: "19px", lineHeight: "1.5"}}>{V.typedText}{!!V.showCaret && (<><span className="rx-caret"></span></>)}</div>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginTop: "6px"}}>
      <div style={{display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#55626E"}}>
      <span style={{width: "36px", height: "36px", borderRadius: "50%", border: "1px solid #D9DFE4", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55626E" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></span>
      <span>Mô tả bằng lời thường ngày</span>
      </div>
      <button type="button" aria-label="Dựng ứng dụng" onClick={V.submit} style={{width: "48px", height: "48px", borderRadius: "50%", border: "0", background: "#2445E8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"></path></svg></button>
      </div>
      </div>
      {/* CONTROLS */}
      <div style={{marginTop: "56px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px 28px"}}>
      <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", fontSize: "14px"}}>
      <span style={{color: "#55626E"}}>Xem</span>
      <div role="group" aria-label="Chế độ xem" style={{display: "flex", padding: "3px", borderRadius: "999px", background: "#E8ECEF"}}>
      {V.views.map((v, _i) => (<Fragment key={_i}>
      <button type="button" onClick={v.pick} aria-pressed={v.on} style={{minHeight: "38px", padding: "0 16px", borderRadius: "999px", border: "0", background: v.bg, color: v.color, fontFamily: "inherit", fontSize: "13.5px", fontWeight: "600", cursor: "pointer"}}>{v.label}</button>
      </Fragment>))}
      </div>
      </div>
      <span style={{fontSize: "13px", color: "#55626E"}}>Mô phỏng · tự chạy lặp lại</span>
      </div>

      <div style={{marginTop: "18px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "6px 24px", padding: "0 4px", fontSize: "13px", fontWeight: "600", color: "#55626E"}}><span>Ứng dụng web · người dùng của bạn thấy</span><span>Cổng xây dựng · bạn theo dõi</span></div>

      {/* BEFORE / AFTER STAGE */}
      <div id="demo" className="rx-stage" style={{position: "relative", height: "580px", marginTop: "10px", border: "1px solid #D9DFE4", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF", boxShadow: "0 1px 0 #D9DFE4, 0 24px 50px -30px rgba(14,26,36,.35)"}}>

      {/* PORTAL layer (right of divider) */}
      <div className="rx-wf-layer" style={{position: "absolute", top: "0", right: "0", bottom: "0", left: "0", clipPath: `inset(0 0 0 ${V.clipL})`, containerType: "inline-size", display: "flex", flexDirection: "column", background: "#FFFFFF"}}>
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "1px solid #E2E7EB", background: "#FAFBFC", flex: "none"}}>
      <div style={{display: "flex", gap: "6px"}} aria-hidden="true"><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span></div>
      <div style={{flex: "1", minWidth: "0", maxWidth: "460px", minHeight: "32px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px", borderRadius: "999px", background: "#EEF1F3", fontSize: "13px", color: "#3A4652", overflow: "hidden", whiteSpace: "nowrap"}}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#55626E" strokeWidth="2.4" aria-hidden="true" style={{flex: "none"}}><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
      <span style={{overflow: "hidden", textOverflow: "ellipsis"}}>cong-xay-dung.example/luong/xac-nhan-don</span>
      </div>
      </div>

      {!!V.isIdle && (<>
      <div style={{flex: "1", margin: "20px", border: "2px dashed #D9DFE4", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", fontSize: "16px", color: "#55626E"}}>Mỗi thao tác trong ứng dụng sẽ hiện thành từng bước ở đây.</div>
      </>)}

      {!!V.isBuilding && (<>
      <div style={{flex: "1", padding: "28px", display: "flex", flexDirection: "column", gap: "14px", maxWidth: "560px", marginLeft: "auto"}}>
      <div style={{fontSize: "17px", fontWeight: "700"}}>Rox đang dựng cho bạn</div>
      <ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px"}}>
      {V.btasks.map((t, _i) => (<Fragment key={_i}>
      <li style={{display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "12px", border: `1px solid ${t.border}`, background: t.bg}}>
      <span className={t.dotClass} style={{width: "20px", height: "20px", flex: "none", borderRadius: "50%", background: t.dot, display: "flex", alignItems: "center", justifyContent: "center"}}>
      {!!t.done && (<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"></path></svg></>)}
      </span>
      <span style={{flex: "1", fontSize: "15px", fontWeight: "600", color: t.color}}>{t.label}</span>
      </li>
      </Fragment>))}
      </ul>
      </div>
      </>)}

      {!!V.isReady && (<>
      <div style={{flex: "1", minHeight: "0", display: "flex", flexDirection: "column"}}>
      <div style={{flex: "none", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "0 28px", borderBottom: "1px solid #E2E7EB"}}>
      <div style={{display: "flex", alignItems: "baseline", gap: "10px"}}><span className="rx-h2" style={{fontSize: "17px", fontWeight: "700"}}>Cổng xây dựng</span><span style={{fontSize: "13px", color: "#55626E"}}>{V.cur.brand}</span></div>
      <div style={{display: "flex", gap: "4px", fontSize: "14px", fontWeight: "600"}}><span style={{padding: "8px 14px", color: "#3A4652"}}>Dựng</span><span style={{padding: "8px 14px", color: "#3A4652"}}>Thử</span><span style={{padding: "8px 14px", borderRadius: "999px", background: "#2445E8", color: "#FFFFFF"}}>Theo dõi</span></div>
      </div>
      <div className="rx-two" style={{flex: "1", minHeight: "0", display: "flex", gap: "28px", padding: "18px 28px"}}>

      <div style={{flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px"}}>
      <div style={{height: "34px", display: "flex", alignItems: "center"}}><span className="rx-h2" style={{fontSize: "20px", fontWeight: "700", letterSpacing: "-0.02em"}}>Sự kiện gần đây</span></div>
      <div style={{border: "1px solid #E2E7EB", borderRadius: "14px", overflow: "hidden"}}>
      {!!V.flowStarted && (<>
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3", background: "#F3F5FE"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>Xác nhận đơn #1042</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>{V.evSub}</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: V.evBg, color: V.evColor, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>{V.evText}</span></div>
      </>)}
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>Xác nhận đơn #1041</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>5/5 bước · 0,79 s</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: "#EEF1FE", color: "#1B35B8", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>Thành công</span></div>
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>Duyệt đơn #1039</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>3/3 bước · 0,31 s</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: "#EEF1FE", color: "#1B35B8", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>Thành công</span></div>
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3", background: "#FDF5F4"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>Xác nhận đơn #1038</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>4/5 bước · 0,52 s</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: "#FDECEA", color: "#8E1B10", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>Lỗi ở Nhắn khách</span></div>
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>Nhập kho Cold brew</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>2/2 bước · 0,17 s</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: "#EEF1FE", color: "#1B35B8", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>Thành công</span></div>
      </div>
      </div>

      <div style={{flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px"}}>
      <div style={{height: "34px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px"}}><span className="rx-h2" style={{fontSize: "20px", fontWeight: "700", letterSpacing: "-0.02em"}}>Luồng: Xác nhận đơn</span><span style={{padding: "4px 12px", borderRadius: "999px", background: V.runBg, color: V.runColor, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>{V.runText}</span></div>
      <div className="rx-dots" style={{flex: "none", overflowX: "auto", border: "1px solid #E2E7EB", borderRadius: "14px", backgroundColor: "#FAFBFC"}}>
      <div style={{position: "relative", width: "100%", minWidth: "520px", height: "252px"}}>
      {V.edges.map((e, _i) => (<Fragment key={_i}>
      <div style={{position: "absolute", left: e.left, top: e.top, width: e.w, height: e.h, background: e.bg, ...css(e.extra)}}><span style={{...css(e.arrow)}}></span></div>
      </Fragment>))}
      {V.nodes.map((n, _i) => (<Fragment key={_i}>
      <button type="button" onClick={n.pick} aria-pressed={n.sel} className={n.pulse} style={{position: "absolute", left: n.left, top: n.top, width: n.w, height: "60px", boxSizing: "border-box", padding: "0 8px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2px", textAlign: "left", borderRadius: "12px", border: `2px ${n.bs} ${n.border}`, background: n.bg, color: n.color, fontFamily: "inherit", cursor: "pointer", boxShadow: n.shadow, zIndex: "1"}}>
      <span style={{fontSize: "12.5px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{n.name}</span>
      <span className="rx-tnum" style={{fontSize: "12px", color: n.subColor, whiteSpace: "nowrap"}}>{n.sub}</span>
      </button>
      </Fragment>))}
      {V.ports.map((pt, _i) => (<Fragment key={_i}>
      <div style={{position: "absolute", left: pt.left, top: pt.top, width: "10px", height: "10px", boxSizing: "border-box", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #55626E", zIndex: "3"}}></div>
      </Fragment>))}
      <div style={{position: "absolute", left: "calc(63.057% + 12px)", top: "74px", fontSize: "12px", fontWeight: "600", color: "#55626E"}}>hết hàng</div>
      <div style={{position: "absolute", left: "2%", top: "166px", display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "#3A4652"}}>
      <span style={{display: "flex", alignItems: "center", gap: "8px"}}><span style={{width: "18px", height: "3px", background: "#2445E8"}}></span>Đã chạy xong</span>
      <span style={{display: "flex", alignItems: "center", gap: "8px"}}><span style={{width: "18px", height: "3px", background: "#F26A1B"}}></span>Dữ liệu đang chạy tới</span>
      <span style={{display: "flex", alignItems: "center", gap: "8px"}}><span style={{width: "18px", height: "3px", background: "repeating-linear-gradient(90deg, #B6C0CA 0 4px, transparent 4px 8px)"}}></span>Nhánh không đi qua</span>
      </div>
      </div>
      </div>
      <div style={{flex: "1", minHeight: "0", borderRadius: "14px", background: V.dBg, border: `1px solid ${V.dBorder}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px"}}><span style={{fontSize: "15px", fontWeight: "700"}}>{V.d.name}</span><span style={{fontSize: "13px", fontWeight: "600", color: V.d.outColor}}>{V.d.status}</span></div>
      <div style={{flex: "1", minHeight: "0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
      <div style={{padding: "8px 12px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E7EB", overflow: "hidden"}}><div style={{fontSize: "12px", color: "#55626E"}}>Vào</div><div style={{marginTop: "2px", fontSize: "13.5px", lineHeight: "1.35"}}>{V.d.input}</div></div>
      <div style={{padding: "8px 12px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E7EB", overflow: "hidden"}}><div style={{fontSize: "12px", color: "#55626E"}}>Ra</div><div style={{marginTop: "2px", fontSize: "13.5px", lineHeight: "1.35", fontWeight: "600", color: V.d.outColor}}>{V.d.output}</div></div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </>)}
      </div>

      {/* WEB APP layer (left of divider) */}
      <div className="rx-ui-layer" style={{position: "absolute", top: "0", right: "0", bottom: "0", left: "0", clipPath: `inset(0 ${V.clipR} 0 0)`, containerType: "inline-size", display: "flex", flexDirection: "column", background: "#FFFFFF"}}>
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "1px solid #E2E7EB", background: "#FAFBFC", flex: "none"}}>
      <div style={{display: "flex", gap: "6px"}} aria-hidden="true"><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span></div>
      <div style={{flex: "1", minWidth: "0", maxWidth: "460px", minHeight: "32px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px", borderRadius: "999px", background: "#EEF1F3", fontSize: "13px", color: "#3A4652", overflow: "hidden", whiteSpace: "nowrap"}}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#55626E" strokeWidth="2.4" aria-hidden="true" style={{flex: "none"}}><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
      <span style={{overflow: "hidden", textOverflow: "ellipsis"}}>{V.cur.domain}</span>
      </div>
      </div>

      {!!V.isIdle && (<>
      <div style={{flex: "1", margin: "20px", border: "2px dashed #D9DFE4", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", fontSize: "16px", color: "#55626E"}}>Ứng dụng của bạn sẽ hiện ở đây.</div>
      </>)}

      {!!V.isBuilding && (<>
      <div style={{flex: "1", display: "flex", flexDirection: "column"}}>
      <div style={{height: "56px", borderBottom: "1px solid #E2E7EB", display: "flex", alignItems: "center", gap: "16px", padding: "0 28px"}}><span style={{height: "16px", width: "110px", borderRadius: "6px", background: "#E2E7EB"}}></span><span style={{height: "16px", width: "70px", borderRadius: "6px", background: "#EAEEF1"}}></span><span style={{height: "16px", width: "70px", borderRadius: "6px", background: "#EAEEF1"}}></span></div>
      <div style={{flex: "1", minWidth: "0", padding: "24px 28px", display: "flex", flexDirection: "column", gap: "14px"}}>
      {V.skel.map((k, _i) => (<Fragment key={_i}>
      <div style={{height: `${k.h}px`, borderRadius: "12px", background: k.bg}}></div>
      </Fragment>))}
      </div>
      </div>
      </>)}

      {!!V.isReady && (<>
      <div style={{flex: "1", minHeight: "0", position: "relative", display: "flex", flexDirection: "column"}}>
      <div style={{flex: "none", height: "56px", display: "flex", alignItems: "center", gap: "28px", padding: "0 28px", borderBottom: "1px solid #E2E7EB"}}>
      <span className="rx-h2" style={{fontSize: "17px", fontWeight: "700"}}>{V.cur.brand}</span>
      <div style={{display: "flex", gap: "4px", fontSize: "14px", fontWeight: "600"}}><span style={{padding: "8px 14px", borderRadius: "999px", background: "#0E1A24", color: "#FFFFFF"}}>Đơn hàng</span><span style={{padding: "8px 14px", color: "#3A4652"}}>Kho</span><span style={{padding: "8px 14px", color: "#3A4652"}}>Hoá đơn</span><span style={{padding: "8px 14px", color: "#3A4652"}}>Khách hàng</span></div>
      </div>
      <div className="rx-two" style={{flex: "1", minHeight: "0", display: "flex", gap: "28px", padding: "24px 28px"}}>

      <div style={{flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "18px"}}>
      <div style={{height: "40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px"}}>
      <span className="rx-h2" style={{fontSize: "24px", fontWeight: "700", letterSpacing: "-0.02em"}}>Đơn hàng</span>
      <span style={{boxSizing: "border-box", width: "112px", height: "40px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "9px", border: "1px solid #0E1A24", background: V.newBg, color: V.newColor, fontSize: "14px", fontWeight: "600"}}>+ Đơn mới</span>
      </div>
      <div style={{border: "1px solid #E2E7EB", borderRadius: "14px", overflow: "hidden"}}>
      {!!V.orderAdded && (<>
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3", background: V.row1Bg}}>
      <div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>#1042 · {V.cur.customer}</div><div style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>{V.cur.productQty}</div></div>
      <span style={{padding: "3px 11px", borderRadius: "999px", background: V.stBg, color: V.stColor, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>{V.stText}</span>
      <div style={{position: "relative"}}>
      <span style={{position: "absolute", right: "0", bottom: "calc(100% + 8px)", padding: "3px 10px", borderRadius: "999px", background: "#FFF1E8", border: "1px solid #F26A1B", fontSize: "12px", fontWeight: "600", color: "#8A3306", whiteSpace: "nowrap", opacity: V.tipOp, transition: "opacity .2s", zIndex: "12"}}>Luồng: Xác nhận đơn</span>
      <span style={{boxSizing: "border-box", minWidth: "104px", height: "40px", padding: "0 16px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "9px", background: V.btnBg, color: V.btnColor, fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap"}}>{V.btnLabel}</span>
      </div>
      </div>
      </>)}
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>#1041 · Anh Minh</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>1.240.000 ₫</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: "#EEF1FE", color: "#1B35B8", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>Đã xác nhận</span></div>
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>#1040 · Quán Hạt</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>2.400.000 ₫</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: "#FFF1E8", color: "#8A3306", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>Chờ duyệt</span></div>
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>#1039 · Chị Hà</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>560.000 ₫</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: "#EEF1FE", color: "#1B35B8", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>Đã xác nhận</span></div>
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>#1038 · Anh Dũng</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>870.000 ₫</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: "#EEF1FE", color: "#1B35B8", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>Đã xác nhận</span></div>
      </div>
      </div>

      <div style={{flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px"}}>
      <div style={{padding: "18px 20px", borderRadius: "14px", border: "1px solid #E2E7EB", background: V.stockBg}}><div style={{fontSize: "13px", color: "#55626E"}}>Tồn kho · {V.cur.product}</div><div className="rx-h2 rx-tnum" style={{marginTop: "6px", fontSize: "32px", fontWeight: "700"}}>{V.stock}</div></div>
      <div style={{padding: "18px 20px", borderRadius: "14px", border: "1px solid #E2E7EB", background: V.invBg}}><div style={{fontSize: "13px", color: "#55626E"}}>Hoá đơn mới nhất</div><div className="rx-h2 rx-tnum" style={{marginTop: "6px", fontSize: "32px", fontWeight: "700"}}>{V.invText}</div></div>
      <div style={{padding: "18px 20px", borderRadius: "14px", border: "1px solid #E2E7EB"}}><div style={{fontSize: "13px", color: "#55626E"}}>Đơn chờ duyệt</div><div className="rx-h2 rx-tnum" style={{marginTop: "6px", fontSize: "32px", fontWeight: "700"}}>1</div></div>
      </div>
      </div>

      {/* new order form (popover) */}
      {!!V.popOpen && (<>
      <div className="rx-pop" style={{position: "absolute", left: "28px", top: "128px", width: "360px", boxSizing: "border-box", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", background: "#FFFFFF", border: "1px solid #D9DFE4", borderRadius: "14px", boxShadow: "0 24px 50px -20px rgba(14,26,36,.45)", zIndex: "10"}}>
      <div style={{fontSize: "17px", fontWeight: "700", lineHeight: "24px"}}>Đơn mới</div>
      <div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span style={{fontSize: "13px", lineHeight: "18px", color: "#3A4652"}}>Khách hàng</span><div style={{boxSizing: "border-box", height: "42px", display: "flex", alignItems: "center", padding: "0 12px", borderRadius: "9px", border: `1.5px solid ${V.ff.khach.border}`, fontSize: "14.5px", color: V.ff.khach.color}}>{V.ff.khach.text}{!!V.ff.khach.caret && (<><span className="rx-caret" style={{height: "1.1em"}}></span></>)}</div></div>
      <div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span style={{fontSize: "13px", lineHeight: "18px", color: "#3A4652"}}>Hàng</span><div style={{boxSizing: "border-box", height: "42px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "0 12px", borderRadius: "9px", border: `1.5px solid ${V.ff.hang.border}`, fontSize: "14.5px", color: V.ff.hang.color}}><span style={{display: "flex", alignItems: "center"}}>{V.ff.hang.text}{!!V.ff.hang.caret && (<><span className="rx-caret" style={{height: "1.1em"}}></span></>)}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#55626E" strokeWidth="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg></div></div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px"}}>
      <div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span style={{fontSize: "13px", lineHeight: "18px", color: "#3A4652"}}>Số lượng</span><div style={{boxSizing: "border-box", height: "42px", display: "flex", alignItems: "center", padding: "0 12px", borderRadius: "9px", border: `1.5px solid ${V.ff.sl.border}`, fontSize: "14.5px", color: V.ff.sl.color}}>{V.ff.sl.text}{!!V.ff.sl.caret && (<><span className="rx-caret" style={{height: "1.1em"}}></span></>)}</div></div>
      <div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span style={{fontSize: "13px", lineHeight: "18px", color: "#3A4652"}}>Số điện thoại</span><div className="rx-tnum" style={{boxSizing: "border-box", height: "42px", display: "flex", alignItems: "center", padding: "0 12px", borderRadius: "9px", border: `1.5px solid ${V.ff.sdt.border}`, fontSize: "14.5px", color: V.ff.sdt.color}}>{V.ff.sdt.text}{!!V.ff.sdt.caret && (<><span className="rx-caret" style={{height: "1.1em"}}></span></>)}</div></div>
      </div>
      <div style={{height: "44px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px"}}><span style={{padding: "0 14px", fontSize: "14px", fontWeight: "600", color: "#55626E"}}>Huỷ</span><span style={{boxSizing: "border-box", width: "110px", height: "44px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "9px", background: V.createBg, color: "#FFFFFF", fontSize: "14.5px", fontWeight: "600"}}>Tạo đơn</span></div>
      </div>
      </>)}

      {!!V.smsShow && (<>
      <div role="status" style={{position: "absolute", left: "28px", bottom: "22px", maxWidth: "300px", padding: "12px 16px", borderRadius: "10px", background: "#0E1A24", color: "#FFFFFF", fontSize: "13.5px", fontWeight: "600", lineHeight: "1.4", boxShadow: "0 12px 30px -14px rgba(14,26,36,.5)", zIndex: "9"}}>{V.toastText}</div>
      </>)}

      {/* mouse cursor */}
      <div className="rx-cur" aria-hidden="true" style={{position: "absolute", left: V.cx, top: `${V.cy}px`, width: "0", height: "0", zIndex: "20", pointerEvents: "none", opacity: V.curOp, transition: "left .6s cubic-bezier(.4,0,.2,1), top .6s cubic-bezier(.4,0,.2,1)"}}>
      <span style={{position: "absolute", left: "-15px", top: "-15px", width: "30px", height: "30px", boxSizing: "border-box", borderRadius: "50%", border: "2px solid #2445E8", background: "rgba(36,69,232,.12)", opacity: V.ringOp, transform: `scale(${V.ringScale})`, transition: "transform .25s ease-out, opacity .25s"}}></span>
      <svg width="22" height="26" viewBox="0 0 22 26" style={{position: "absolute", left: "-2px", top: "-2px", filter: "drop-shadow(0 3px 4px rgba(14,26,36,.35))"}}><path d="M2 2 L2 20 L7 15.2 L10.6 23.6 L14.2 22.1 L10.6 13.8 L17.4 13.8 Z" fill="#0E1A24" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round"></path></svg>
      </div>
      </div>
      </>)}
      </div>

      {/* divider + handle */}
      <div style={{position: "absolute", left: V.pos, top: "0", bottom: "0", width: "3px", marginLeft: "-1.5px", background: "#0E1A24", zIndex: "4", pointerEvents: "none"}}></div>
      <input id="rx-ba" className="rx-ba" type="range" min="0" max="100" step="1" value={V.sl} onChange={V.onSlide} aria-label="Kéo để so sánh ứng dụng và luồng chạy phía sau" />
      <div className="rx-handle" style={{position: "absolute", left: V.pos, top: "50%", width: "56px", height: "56px", margin: "-28px 0 0 -28px", borderRadius: "50%", background: "#FFFFFF", border: "2px solid #0E1A24", boxShadow: "0 8px 24px -8px rgba(14,26,36,.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "5", pointerEvents: "none"}}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0E1A24" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"></path></svg>
      </div>
      </div>

      <div style={{marginTop: "14px", textAlign: "center", fontSize: "13px", color: "#55626E"}}>Kéo thanh ngăn ở giữa để so sánh ứng dụng với luồng chạy phía sau nó.</div>
      </div>
      </section>

      <section id="khac-biet" className="rx-pad" style={{padding: "112px 48px"}}>
      <div style={{maxWidth: "1240px", margin: "0 auto"}}>
      <h2 className="rx-h2" style={{margin: "0", fontSize: "52px", lineHeight: "1.02", fontWeight: "750", letterSpacing: "-0.04em", maxWidth: "820px"}}>Giao diện nào cũng đẹp. Logic có đúng không mới là chuyện khác.</h2>
      <div style={{marginTop: "48px", display: "flex", flexDirection: "column", gap: "20px"}}>

      <div style={{borderRadius: "20px", background: "#0E1A24", padding: "24px 28px 28px"}}>
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "6px 24px"}}><span style={{fontSize: "16px", fontWeight: "700", color: "#FFFFFF"}}>Các công cụ khác</span><span style={{fontSize: "14px", color: "#C9D1D8"}}>Bạn thấy giao diện. Phần xử lý nằm trong hộp kín.</span></div>
      <div style={{overflowX: "auto"}}><div style={{position: "relative", minWidth: "640px", marginTop: "12px", height: "130px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", alignItems: "center", justifyItems: "center"}}>
      <div style={{position: "absolute", left: "16.667%", right: "16.667%", top: "50%", height: "3px", marginTop: "-1.5px", background: "#3A4652"}}></div>
      <div style={{position: "absolute", left: "16.667%", width: V.sA.aFillW, top: "50%", height: "3px", marginTop: "-1.5px", background: "#F26A1B"}}></div>
      <div style={{position: "absolute", left: `calc(${V.sA.aDot}% - 6px)`, top: "50%", width: "12px", height: "12px", marginTop: "-6px", borderRadius: "50%", background: "#F26A1B", opacity: V.sA.aDotOp, zIndex: "0"}}></div>
      <span style={{position: "relative", zIndex: "1", padding: "14px 20px", borderRadius: "12px", background: "#FFFFFF", fontSize: "15px", fontWeight: "600"}}>Bấm nút</span>
      <div className={V.sA.aPulse} style={{position: "relative", zIndex: "1", width: "100px", height: "100px", borderRadius: "18px", background: "#1B2A37", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#8793A0" strokeWidth="1.8" aria-hidden="true"><path d="M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.6V14M12 17.5h.01"></path></svg></div>
      <div style={{position: "relative", zIndex: "1", opacity: V.sA.aResOp, transition: "opacity .3s", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px"}}><span style={{padding: "14px 20px", borderRadius: "12px", background: "#FFFFFF", fontSize: "15px", fontWeight: "600"}}>Tồn kho: 22</span><span style={{padding: "2px 10px", borderRadius: "999px", background: "#FFF1E8", border: "1px solid #F26A1B", fontSize: "12.5px", fontWeight: "600", color: "#8A3306"}}>đúng chưa?</span></div>
      </div></div>
      </div>

      <div className="rx-dots" style={{borderRadius: "20px", backgroundColor: "#FFFFFF", border: "1.5px solid #2445E8", padding: "24px 28px 28px"}}>
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "6px 24px"}}><span style={{fontSize: "16px", fontWeight: "700"}}>RotexAI</span><span style={{fontSize: "14px", color: "#3A4652"}}>Mỗi thao tác chạy qua các bước bạn đọc được. Lỗi hiện đúng chỗ.</span></div>
      <div style={{overflowX: "auto"}}><div style={{position: "relative", minWidth: "880px", marginTop: "12px", height: "130px", display: "grid", gridTemplateColumns: "repeat(7, 1fr)", alignItems: "center", justifyItems: "center"}}>
      <div style={{position: "absolute", left: "7.143%", right: "7.143%", top: "50%", height: "3px", marginTop: "-1.5px", background: "#D9DFE4"}}></div>
      <div style={{position: "absolute", left: "7.143%", width: V.sA.bFillW, top: "50%", height: "3px", marginTop: "-1.5px", background: "#2445E8"}}></div>
      <div style={{position: "absolute", left: `calc(${V.sA.bDot}% - 6px)`, top: "50%", width: "12px", height: "12px", marginTop: "-6px", borderRadius: "50%", background: "#F26A1B", opacity: V.sA.bDotOp, zIndex: "0"}}></div>
      {V.bcols.map((c, _i) => (<Fragment key={_i}>
      <div className={c.pulse} style={{position: "relative", zIndex: "1", boxSizing: "border-box", minWidth: "118px", padding: "10px 12px", borderRadius: "12px", border: `2px solid ${c.border}`, background: c.bg, color: c.color, opacity: c.op, textAlign: "center", transition: "opacity .3s"}}><div style={{fontSize: "14px", fontWeight: "700", whiteSpace: "nowrap"}}>{c.label}</div><div className="rx-tnum" style={{minHeight: "17px", fontSize: "12px", color: c.subColor, whiteSpace: "nowrap"}}>{c.sub}</div></div>
      </Fragment>))}
      </div></div>
      </div>
      </div>
      </div>
      </section>

      <section id="ung-dung" className="rx-pad" style={{padding: "104px 48px", background: "#FFFFFF", borderTop: "1px solid #D9DFE4", borderBottom: "1px solid #D9DFE4"}}>
      <div style={{maxWidth: "1240px", margin: "0 auto"}}>
      <div style={{display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px 48px"}}>
      <h2 className="rx-h2" style={{margin: "0", fontSize: "52px", lineHeight: "1.02", fontWeight: "750", letterSpacing: "-0.04em", flex: "1 1 520px", maxWidth: "700px"}}>Mỗi cú bấm trong ứng dụng là một lần chạy.</h2>
      <p style={{margin: "0", flex: "0 1 380px", fontSize: "17px", lineHeight: "1.55", color: "#3A4652"}}>Người dùng chỉ thấy phần mềm gọn gàng. Bạn thấy từng sự kiện phía sau.</p>
      </div>
      <div className="rx-two2" style={{marginTop: "48px", display: "flex", gap: "20px"}}>

      <div className="rx-win" style={{position: "relative", border: "1px solid #D9DFE4", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF", display: "flex", flexDirection: "column", boxShadow: "0 1px 0 #D9DFE4, 0 24px 50px -30px rgba(14,26,36,.3)", flex: "1", minWidth: "0", height: "440px"}}>
      <div style={{flex: "none", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "1px solid #E2E7EB", background: "#FAFBFC"}}><div style={{display: "flex", gap: "6px"}} aria-hidden="true"><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span></div><div style={{flex: "1", minWidth: "0", maxWidth: "460px", minHeight: "32px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px", borderRadius: "999px", background: "#EEF1F3", fontSize: "13px", color: "#3A4652", overflow: "hidden", whiteSpace: "nowrap"}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#55626E" strokeWidth="2.4" aria-hidden="true" style={{flex: "none"}}><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg><span style={{overflow: "hidden", textOverflow: "ellipsis"}}>caphemoc.example.vn/don-hang</span></div></div>
      <div style={{padding: "20px", display: "flex", flexDirection: "column", gap: "16px"}}>
      <div style={{boxSizing: "border-box", width: "260px", maxWidth: "100%", height: "42px", display: "flex", alignItems: "center", padding: "0 14px", borderRadius: "9px", border: `1.5px solid ${V.sB.qBorder}`, fontSize: "14.5px", color: V.sB.qColor}}>{V.sB.q}{!!V.sB.caret && (<><span className="rx-caret" style={{height: "1.1em"}}></span></>)}</div>
      <div style={{border: "1px solid #E2E7EB", borderRadius: "14px", overflow: "hidden"}}>
      {!!V.sB.showOthers && (<><div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>#1042 · Chị Lan</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>Cà phê rang mộc 500g × 2</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: "#EEF1FE", color: "#1B35B8", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>Đã xác nhận</span></div></>)}
      {!!V.sB.showOthers && (<><div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>#1041 · Anh Minh</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>1.240.000 ₫</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: "#EEF1FE", color: "#1B35B8", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>Đã xác nhận</span><span style={{boxSizing: "border-box", height: "38px", padding: "0 16px", display: "inline-flex", alignItems: "center", borderRadius: "9px", border: "1px solid #C9D1D8", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap"}}>Xem hoá đơn</span></div></>)}
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>#1040 · Quán Hạt</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>2.400.000 ₫</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: V.sB.pillBg, color: V.sB.pillColor, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>{V.sB.pillText}</span><span style={{boxSizing: "border-box", height: "38px", minWidth: "76px", padding: "0 16px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "9px", background: V.sB.btnBg, color: V.sB.btnColor, fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap"}}>{V.sB.btnText}</span></div>
      </div>
      </div>
      {!!V.sB.invShow && (<>
      <div style={{position: "absolute", left: "20px", right: "20px", bottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "14px 18px", borderRadius: "12px", background: "#0E1A24", color: "#FFFFFF", boxShadow: "0 12px 30px -14px rgba(14,26,36,.5)"}}><span style={{fontSize: "14px", fontWeight: "600"}}>Hoá đơn HD-1041</span><span className="rx-tnum" style={{fontSize: "16px", fontWeight: "700"}}>1.240.000 ₫</span></div>
      </>)}
      <div className="rx-cur2" aria-hidden="true" style={{position: "absolute", left: V.sB.cx, top: V.sB.cy, width: "0", height: "0", zIndex: "20", pointerEvents: "none", transition: "left .6s cubic-bezier(.4,0,.2,1), top .6s cubic-bezier(.4,0,.2,1)"}}>
      <span style={{position: "absolute", left: "-15px", top: "-15px", width: "30px", height: "30px", boxSizing: "border-box", borderRadius: "50%", border: "2px solid #2445E8", background: "rgba(36,69,232,.12)", opacity: V.sB.ringOp, transform: `scale(${V.sB.ringScale})`, transition: "transform .25s ease-out, opacity .25s"}}></span>
      <svg width="22" height="26" viewBox="0 0 22 26" style={{position: "absolute", left: "-2px", top: "-2px", filter: "drop-shadow(0 3px 4px rgba(14,26,36,.35))"}}><path d="M2 2 L2 20 L7 15.2 L10.6 23.6 L14.2 22.1 L10.6 13.8 L17.4 13.8 Z" fill="#0E1A24" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round"></path></svg>
      <span style={{position: "absolute", top: "-34px", ...css(V.sB.tipSide), padding: "3px 10px", borderRadius: "999px", background: "#FFF1E8", border: "1px solid #F26A1B", fontSize: "12px", fontWeight: "600", color: "#8A3306", whiteSpace: "nowrap", opacity: V.sB.tipOp, transition: "opacity .2s"}}>{V.sB.tipText}</span></div>
      </div>

      <div className="rx-win" style={{position: "relative", border: "1px solid #D9DFE4", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF", display: "flex", flexDirection: "column", boxShadow: "0 1px 0 #D9DFE4, 0 24px 50px -30px rgba(14,26,36,.3)", flex: "1", minWidth: "0", height: "440px"}}>
      <div style={{flex: "none", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "1px solid #E2E7EB", background: "#FAFBFC"}}><div style={{display: "flex", gap: "6px"}} aria-hidden="true"><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span></div><div style={{flex: "1", minWidth: "0", maxWidth: "460px", minHeight: "32px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px", borderRadius: "999px", background: "#EEF1F3", fontSize: "13px", color: "#3A4652", overflow: "hidden", whiteSpace: "nowrap"}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#55626E" strokeWidth="2.4" aria-hidden="true" style={{flex: "none"}}><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg><span style={{overflow: "hidden", textOverflow: "ellipsis"}}>cong-xay-dung.example/su-kien</span></div></div>
      <div style={{padding: "20px", display: "flex", flexDirection: "column", gap: "16px"}}>
      <div style={{height: "42px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px"}}><span className="rx-h2" style={{fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em"}}>Sự kiện</span><span style={{display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRadius: "999px", background: "#F5F7F8", fontSize: "13px", fontWeight: "600", color: "#3A4652"}}><span className="rx-pulse" style={{width: "8px", height: "8px", borderRadius: "50%", background: "#F26A1B"}}></span>Trực tiếp</span></div>
      <div style={{border: "1px solid #E2E7EB", borderRadius: "14px", overflow: "hidden", minHeight: "120px"}}>
      {V.evs.map((ev, _i) => (<Fragment key={_i}><div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>{ev.title}</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>{ev.sub}</div></div><span style={{fontSize: "13px", letterSpacing: "2px", color: ev.dotsColor}}>{ev.dots}</span><span style={{padding: "3px 11px", borderRadius: "999px", background: ev.chipBg, color: ev.chipColor, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>{ev.chipText}</span></div></Fragment>))}
      {!!V.sB.noEv && (<><div style={{padding: "36px 20px", textAlign: "center", fontSize: "15px", color: "#55626E"}}>Chưa có sự kiện nào.</div></>)}
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>

      <section id="cong-xay-dung" className="rx-pad" style={{padding: "112px 48px"}}>
      <div style={{maxWidth: "1240px", margin: "0 auto"}}>
      <h2 className="rx-h2" style={{margin: "0", fontSize: "52px", lineHeight: "1.02", fontWeight: "750", letterSpacing: "-0.04em", maxWidth: "760px"}}>Cổng xây dựng: dựng, thử và theo dõi từng bước.</h2>

      {/* Dựng */}
      <div style={{marginTop: "64px"}}>
      <div style={{display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "8px 32px"}}><h3 className="rx-h2" style={{margin: "0", fontSize: "30px", fontWeight: "700", letterSpacing: "-0.03em"}}>Dựng bằng lời</h3><p style={{margin: "0", maxWidth: "520px", fontSize: "16px", lineHeight: "1.5", color: "#3A4652"}}>Nói yêu cầu. Bước mới hiện ra trên sơ đồ để bạn xem trước.</p></div>
      <div className="rx-win" style={{position: "relative", border: "1px solid #D9DFE4", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF", display: "flex", flexDirection: "column", boxShadow: "0 1px 0 #D9DFE4, 0 24px 50px -30px rgba(14,26,36,.3)", marginTop: "20px", height: "430px"}}>
      <div style={{flex: "none", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "1px solid #E2E7EB", background: "#FAFBFC"}}><div style={{display: "flex", gap: "6px"}} aria-hidden="true"><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span></div><div style={{flex: "1", minWidth: "0", maxWidth: "460px", minHeight: "32px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px", borderRadius: "999px", background: "#EEF1F3", fontSize: "13px", color: "#3A4652", overflow: "hidden", whiteSpace: "nowrap"}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#55626E" strokeWidth="2.4" aria-hidden="true" style={{flex: "none"}}><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg><span style={{overflow: "hidden", textOverflow: "ellipsis"}}>cong-xay-dung.example/luong/xac-nhan-don</span></div></div>
      <div style={{flex: "none", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "0 24px", borderBottom: "1px solid #E2E7EB"}}><div style={{display: "flex", alignItems: "baseline", gap: "10px"}}><span className="rx-h2" style={{fontSize: "17px", fontWeight: "700"}}>Cổng xây dựng</span><span style={{fontSize: "13px", color: "#55626E"}}>Cà Phê Mộc</span></div><div style={{display: "flex", gap: "4px", fontSize: "14px", fontWeight: "600"}}><span style={{padding: "8px 14px", borderRadius: "999px", background: "#2445E8", color: "#FFFFFF"}}>Dựng</span><span style={{padding: "8px 14px", color: "#3A4652"}}>Thử</span><span style={{padding: "8px 14px", color: "#3A4652"}}>Theo dõi</span></div></div>
      <div className="rx-two2" style={{flex: "1", minHeight: "0", position: "relative", display: "flex", gap: "24px", padding: "24px"}}>
      <div style={{flex: "0 0 36%", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px"}}>
      <div style={{alignSelf: "flex-end", maxWidth: "94%", padding: "12px 14px", borderRadius: "16px 16px 4px 16px", background: "#0E1A24", color: "#FFFFFF", fontSize: "14px", lineHeight: "1.5", opacity: V.sC.userOp}}>{V.sC.typed}{!!V.sC.caret && (<><span className="rx-caret" style={{height: "1.1em", background: "#FFFFFF"}}></span></>)}</div>
      <div style={{alignSelf: "flex-start", maxWidth: "94%", padding: "12px 14px", borderRadius: "16px 16px 16px 4px", background: "#F5F7F8", fontSize: "14px", lineHeight: "1.5", opacity: V.sC.replyOp, transition: "opacity .3s"}}>Đã thêm bước “Chờ chủ duyệt”. Xem trước bên phải rồi áp dụng.</div>
      <div style={{marginTop: "auto", display: "flex", alignItems: "center", gap: "10px"}}><span style={{boxSizing: "border-box", width: "128px", height: "44px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "999px", background: V.sC.applyBg, color: V.sC.applyColor, fontSize: "14.5px", fontWeight: "600"}}>{V.sC.applyText}</span><span style={{padding: "0 14px", fontSize: "14px", fontWeight: "600", color: "#55626E"}}>Huỷ</span></div>
      </div>
      <div className="rx-dots" style={{flex: "1", minWidth: "0", overflowX: "auto", display: "flex", alignItems: "center", border: "1px solid #E2E7EB", borderRadius: "14px", backgroundColor: "#FAFBFC"}}>
      <div style={{position: "relative", width: "100%", minWidth: "560px", height: "230px"}}>
      {V.cEdges.map((e, _i) => (<Fragment key={_i}><div style={{position: "absolute", left: e.left, top: e.top, width: e.w, height: e.h, background: e.bg, opacity: e.op, transition: "opacity .3s, background .3s"}}><span style={{...css(e.arrow)}}></span></div></Fragment>))}
      {V.cNodes.map((n, _i) => (<Fragment key={_i}><div style={{position: "absolute", left: n.left, top: n.top, width: n.w, height: "56px", boxSizing: "border-box", padding: "0 8px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", borderRadius: "12px", border: `2px solid ${n.border}`, background: n.bg, opacity: n.op, transform: `scale(${n.scale})`, transition: "opacity .3s, transform .3s, background .3s, border-color .3s", zIndex: "1"}}><span style={{fontSize: "12.5px", fontWeight: "700", whiteSpace: "nowrap"}}>{n.name}</span><span style={{fontSize: "11.5px", fontWeight: "600", color: n.subColor}}>{n.sub}</span></div></Fragment>))}
      <span style={{position: "absolute", left: "36.5%", top: "26px", fontSize: "12px", fontWeight: "600", color: "#55626E", opacity: V.sC.labelOp}}>Có</span>
      <span style={{position: "absolute", left: "46%", top: "124px", fontSize: "12px", fontWeight: "600", color: "#55626E", opacity: V.sC.labelOp}}>Không</span>
      </div>
      </div>
      <div className="rx-cur2" aria-hidden="true" style={{position: "absolute", left: V.sC.cx, top: V.sC.cy, width: "0", height: "0", zIndex: "20", pointerEvents: "none", transition: "left .6s cubic-bezier(.4,0,.2,1), top .6s cubic-bezier(.4,0,.2,1)"}}>
      <span style={{position: "absolute", left: "-15px", top: "-15px", width: "30px", height: "30px", boxSizing: "border-box", borderRadius: "50%", border: "2px solid #2445E8", background: "rgba(36,69,232,.12)", opacity: V.sC.ringOp, transform: `scale(${V.sC.ringScale})`, transition: "transform .25s ease-out, opacity .25s"}}></span>
      <svg width="22" height="26" viewBox="0 0 22 26" style={{position: "absolute", left: "-2px", top: "-2px", filter: "drop-shadow(0 3px 4px rgba(14,26,36,.35))"}}><path d="M2 2 L2 20 L7 15.2 L10.6 23.6 L14.2 22.1 L10.6 13.8 L17.4 13.8 Z" fill="#0E1A24" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round"></path></svg>
      </div>
      </div>
      </div>
      </div>

      {/* Thử */}
      <div style={{marginTop: "80px"}}>
      <div style={{display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "8px 32px"}}><h3 className="rx-h2" style={{margin: "0", fontSize: "30px", fontWeight: "700", letterSpacing: "-0.03em"}}>Thử trước khi áp dụng</h3><p style={{margin: "0", maxWidth: "520px", fontSize: "16px", lineHeight: "1.5", color: "#3A4652"}}>Chạy lại đơn cũ với quy tắc mới. Biết đơn nào đổi kết quả.</p></div>
      <div className="rx-win" style={{position: "relative", border: "1px solid #D9DFE4", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF", display: "flex", flexDirection: "column", boxShadow: "0 1px 0 #D9DFE4, 0 24px 50px -30px rgba(14,26,36,.3)", marginTop: "20px", height: "430px"}}>
      <div style={{flex: "none", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "1px solid #E2E7EB", background: "#FAFBFC"}}><div style={{display: "flex", gap: "6px"}} aria-hidden="true"><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span></div><div style={{flex: "1", minWidth: "0", maxWidth: "460px", minHeight: "32px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px", borderRadius: "999px", background: "#EEF1F3", fontSize: "13px", color: "#3A4652", overflow: "hidden", whiteSpace: "nowrap"}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#55626E" strokeWidth="2.4" aria-hidden="true" style={{flex: "none"}}><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg><span style={{overflow: "hidden", textOverflow: "ellipsis"}}>cong-xay-dung.example/thu</span></div></div>
      <div style={{flex: "none", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "0 24px", borderBottom: "1px solid #E2E7EB"}}><div style={{display: "flex", alignItems: "baseline", gap: "10px"}}><span className="rx-h2" style={{fontSize: "17px", fontWeight: "700"}}>Cổng xây dựng</span><span style={{fontSize: "13px", color: "#55626E"}}>Cà Phê Mộc</span></div><div style={{display: "flex", gap: "4px", fontSize: "14px", fontWeight: "600"}}><span style={{padding: "8px 14px", color: "#3A4652"}}>Dựng</span><span style={{padding: "8px 14px", borderRadius: "999px", background: "#2445E8", color: "#FFFFFF"}}>Thử</span><span style={{padding: "8px 14px", color: "#3A4652"}}>Theo dõi</span></div></div>
      <div className="rx-two2" style={{flex: "1", minHeight: "0", position: "relative", display: "flex", gap: "24px", padding: "24px"}}>
      <div style={{flex: "0 0 38%", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px", padding: "18px", border: "1px solid #E2E7EB", borderRadius: "14px"}}>
      <div style={{fontSize: "16px", fontWeight: "700"}}>Chạy thử 120 đơn tháng trước</div>
      <div style={{display: "flex", flexDirection: "column", gap: "8px"}}><div style={{height: "12px", borderRadius: "6px", background: "#EEF1F3"}}><div style={{width: V.sD.barW, height: "100%", borderRadius: "6px", background: "#2445E8"}}></div></div><div className="rx-tnum" style={{fontSize: "13px", color: "#55626E"}}>{V.sD.count} / 120 đơn</div></div>
      <div style={{display: "flex", gap: "12px", opacity: V.sD.statsOp, transition: "opacity .3s"}}><div style={{flex: "1", padding: "12px 14px", borderRadius: "12px", background: "#F5F7F8"}}><div className="rx-h2 rx-tnum" style={{fontSize: "30px", fontWeight: "700"}}>117</div><div style={{fontSize: "13px", color: "#55626E"}}>giữ nguyên</div></div><div style={{flex: "1", padding: "12px 14px", borderRadius: "12px", background: "#FFF1E8", border: "1px solid #F26A1B"}}><div className="rx-h2 rx-tnum" style={{fontSize: "30px", fontWeight: "700", color: "#8A3306"}}>3</div><div style={{fontSize: "13px", color: "#8A3306"}}>đổi kết quả</div></div></div>
      <div style={{marginTop: "auto", display: "flex", alignItems: "center", gap: "10px"}}><span style={{boxSizing: "border-box", width: "150px", height: "44px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "999px", background: V.sD.applyBg, color: V.sD.applyColor, fontSize: "14.5px", fontWeight: "600"}}>{V.sD.applyText}</span><span style={{padding: "0 14px", fontSize: "14px", fontWeight: "600", color: "#55626E"}}>Huỷ</span></div>
      </div>
      <div style={{flex: "1", minWidth: "0", border: "1px solid #E2E7EB", borderRadius: "14px", overflow: "hidden", alignSelf: "flex-start"}}>
      <div style={{display: "grid", gridTemplateColumns: "0.8fr 1.3fr 1.3fr 0.7fr", gap: "12px", padding: "12px 18px", background: "#F8FAFB", borderBottom: "1px solid #E2E7EB", fontSize: "12.5px", fontWeight: "600", color: "#55626E"}}><span>Đơn</span><span>Trước</span><span>Sau</span><span>Khác</span></div>
      {V.dRows.map((r, _i) => (<Fragment key={_i}><div style={{display: "grid", gridTemplateColumns: "0.8fr 1.3fr 1.3fr 0.7fr", gap: "12px", padding: "16px 18px", borderBottom: "1px solid #EEF1F3", fontSize: "15px"}}><span className="rx-tnum" style={{fontWeight: "700"}}>{r.id}</span><span className="rx-tnum" style={{color: "#55626E"}}>{r.before}</span><span className="rx-tnum" style={{fontWeight: "700"}}>{r.after}</span><span className="rx-tnum" style={{fontWeight: "600", color: "#8A3306"}}>{r.diff}</span></div></Fragment>))}
      </div>
      <div className="rx-cur2" aria-hidden="true" style={{position: "absolute", left: V.sD.cx, top: V.sD.cy, width: "0", height: "0", zIndex: "20", pointerEvents: "none", transition: "left .6s cubic-bezier(.4,0,.2,1), top .6s cubic-bezier(.4,0,.2,1)"}}>
      <span style={{position: "absolute", left: "-15px", top: "-15px", width: "30px", height: "30px", boxSizing: "border-box", borderRadius: "50%", border: "2px solid #2445E8", background: "rgba(36,69,232,.12)", opacity: V.sD.ringOp, transform: `scale(${V.sD.ringScale})`, transition: "transform .25s ease-out, opacity .25s"}}></span>
      <svg width="22" height="26" viewBox="0 0 22 26" style={{position: "absolute", left: "-2px", top: "-2px", filter: "drop-shadow(0 3px 4px rgba(14,26,36,.35))"}}><path d="M2 2 L2 20 L7 15.2 L10.6 23.6 L14.2 22.1 L10.6 13.8 L17.4 13.8 Z" fill="#0E1A24" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round"></path></svg>
      </div>
      </div>
      </div>
      </div>

      {/* Theo dõi */}
      <div style={{marginTop: "80px"}}>
      <div style={{display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "8px 32px"}}><h3 className="rx-h2" style={{margin: "0", fontSize: "30px", fontWeight: "700", letterSpacing: "-0.03em"}}>Theo dõi từng sự kiện</h3><p style={{margin: "0", maxWidth: "520px", fontSize: "16px", lineHeight: "1.5", color: "#3A4652"}}>Lỗi hiện đúng bước. Mở ra là thấy nó nhận gì, trả gì.</p></div>
      <div className="rx-win" style={{position: "relative", border: "1px solid #D9DFE4", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF", display: "flex", flexDirection: "column", boxShadow: "0 1px 0 #D9DFE4, 0 24px 50px -30px rgba(14,26,36,.3)", marginTop: "20px", height: "430px"}}>
      <div style={{flex: "none", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "1px solid #E2E7EB", background: "#FAFBFC"}}><div style={{display: "flex", gap: "6px"}} aria-hidden="true"><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span><span style={{width: "10px", height: "10px", borderRadius: "50%", background: "#D9DFE4"}}></span></div><div style={{flex: "1", minWidth: "0", maxWidth: "460px", minHeight: "32px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px", borderRadius: "999px", background: "#EEF1F3", fontSize: "13px", color: "#3A4652", overflow: "hidden", whiteSpace: "nowrap"}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#55626E" strokeWidth="2.4" aria-hidden="true" style={{flex: "none"}}><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg><span style={{overflow: "hidden", textOverflow: "ellipsis"}}>cong-xay-dung.example/su-kien</span></div></div>
      <div style={{flex: "none", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "0 24px", borderBottom: "1px solid #E2E7EB"}}><div style={{display: "flex", alignItems: "baseline", gap: "10px"}}><span className="rx-h2" style={{fontSize: "17px", fontWeight: "700"}}>Cổng xây dựng</span><span style={{fontSize: "13px", color: "#55626E"}}>Cà Phê Mộc</span></div><div style={{display: "flex", gap: "4px", fontSize: "14px", fontWeight: "600"}}><span style={{padding: "8px 14px", color: "#3A4652"}}>Dựng</span><span style={{padding: "8px 14px", color: "#3A4652"}}>Thử</span><span style={{padding: "8px 14px", borderRadius: "999px", background: "#2445E8", color: "#FFFFFF"}}>Theo dõi</span></div></div>
      <div className="rx-two2" style={{flex: "1", minHeight: "0", position: "relative", display: "flex", gap: "24px", padding: "24px"}}>
      <div style={{flex: "0 0 44%", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px"}}>
      <div style={{height: "34px", display: "flex", alignItems: "center"}}><span className="rx-h2" style={{fontSize: "20px", fontWeight: "700", letterSpacing: "-0.02em"}}>Sự kiện gần đây</span></div>
      <div style={{border: "1px solid #E2E7EB", borderRadius: "14px", overflow: "hidden"}}>
      {V.eEvents.map((x, _i) => (<Fragment key={_i}><div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderBottom: "1px solid #EEF1F3", background: x.bg, transition: "background .3s"}}><div style={{flex: "1", minWidth: "0"}}><div style={{fontSize: "15px", fontWeight: "700"}}>{x.title}</div><div className="rx-tnum" style={{marginTop: "2px", fontSize: "13px", color: "#55626E"}}>{x.sub}</div></div><span style={{padding: "3px 11px", borderRadius: "999px", background: x.chipBg, color: x.chipColor, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"}}>{x.chipText}</span></div></Fragment>))}
      </div>
      </div>
      <div style={{flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px", padding: "18px", border: "1px solid #E2E7EB", borderRadius: "14px", background: "#FAFBFC"}}>
      {!!V.sE.noSel && (<><div style={{flex: "1", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: "15px", color: "#55626E"}}>Chọn một sự kiện để xem từng bước.</div></>)}
      {!!V.sE.sel && (<>
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px 12px"}}><span className="rx-h2" style={{fontSize: "20px", fontWeight: "700"}}>Xác nhận đơn #1044</span><span style={{padding: "4px 12px", borderRadius: "999px", background: "#FDECEA", color: "#8E1B10", fontSize: "13px", fontWeight: "600"}}>Lỗi ở bước Nhắn khách</span></div>
      <div style={{display: "flex", alignItems: "center"}}>{V.eChain.map((k, _i) => (<Fragment key={_i}><div style={{flex: "1", minWidth: "0", display: "flex", alignItems: "center"}}><div style={{flex: "1", minWidth: "0", boxSizing: "border-box", padding: "8px 6px", borderRadius: "10px", border: `2px solid ${k.border}`, background: k.bg, textAlign: "center"}}><div style={{fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{k.name}</div><div className="rx-tnum" style={{fontSize: "11.5px", color: k.subColor}}>{k.sub}</div></div>{!!k.line && (<><span style={{flex: "none", width: "14px", height: "3px", background: k.lineColor}}></span></>)}</div></Fragment>))}</div>
      <div style={{padding: "14px 16px", borderRadius: "12px", background: "#FDF5F4", border: "1px solid #B42318", display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px", fontSize: "14px", lineHeight: "1.4"}}><span style={{color: "#55626E"}}>Vào</span><span className="rx-tnum">SĐT 0912 345 67</span><span style={{color: "#55626E"}}>Ra</span><span style={{fontWeight: "700", color: "#8E1B10"}}>Số điện thoại thiếu 1 chữ số</span><span style={{color: "#55626E"}}>Dữ liệu</span><span>Các bước trước vẫn được giữ nguyên</span></div>
      </>)}
      </div>
      <div className="rx-cur2" aria-hidden="true" style={{position: "absolute", left: V.sE.cx, top: V.sE.cy, width: "0", height: "0", zIndex: "20", pointerEvents: "none", transition: "left .6s cubic-bezier(.4,0,.2,1), top .6s cubic-bezier(.4,0,.2,1)"}}>
      <span style={{position: "absolute", left: "-15px", top: "-15px", width: "30px", height: "30px", boxSizing: "border-box", borderRadius: "50%", border: "2px solid #2445E8", background: "rgba(36,69,232,.12)", opacity: V.sE.ringOp, transform: `scale(${V.sE.ringScale})`, transition: "transform .25s ease-out, opacity .25s"}}></span>
      <svg width="22" height="26" viewBox="0 0 22 26" style={{position: "absolute", left: "-2px", top: "-2px", filter: "drop-shadow(0 3px 4px rgba(14,26,36,.35))"}}><path d="M2 2 L2 20 L7 15.2 L10.6 23.6 L14.2 22.1 L10.6 13.8 L17.4 13.8 Z" fill="#0E1A24" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round"></path></svg>
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>

      <section id="vi-du" className="rx-pad" style={{padding: "104px 48px", background: "#FFFFFF", borderTop: "1px solid #D9DFE4", borderBottom: "1px solid #D9DFE4"}}>
      <div style={{maxWidth: "1240px", margin: "0 auto"}}>
      <div style={{display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px 48px"}}>
      <h2 className="rx-h2" style={{margin: "0", fontSize: "52px", lineHeight: "1.02", fontWeight: "750", letterSpacing: "-0.04em", flex: "1 1 520px", maxWidth: "700px"}}>Dựng được những gì?</h2>
      <p style={{margin: "0", flex: "0 1 380px", fontSize: "17px", lineHeight: "1.55", color: "#3A4652"}}>Ví dụ cho doanh nghiệp nhỏ. Mỗi ứng dụng đi kèm luồng bạn đọc được.</p>
      </div>
      <div style={{marginTop: "48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "20px"}}>
      {V.gallery.map((c, _i) => (<Fragment key={_i}>
      <article style={{border: "1px solid #D9DFE4", borderRadius: "18px", background: "#FFFFFF", overflow: "hidden", display: "flex", flexDirection: "column"}}>
      <div style={{height: "132px", boxSizing: "border-box", padding: "20px", background: "#F5F7F8", display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px"}}>
      <div style={{display: "flex", alignItems: "center", gap: "10px"}}><span style={{height: "9px", width: c.w1, borderRadius: "5px", background: "#C9D1D8"}}></span><span style={{width: "30px", height: "14px", borderRadius: "7px", background: "#2445E8"}}></span></div>
      <div style={{display: "flex", alignItems: "center", gap: "10px"}}><span style={{height: "9px", width: c.w2, borderRadius: "5px", background: "#C9D1D8"}}></span><span style={{width: "30px", height: "14px", borderRadius: "7px", background: "#F26A1B"}}></span></div>
      <div style={{display: "flex", alignItems: "center", gap: "10px"}}><span style={{height: "9px", width: c.w3, borderRadius: "5px", background: "#C9D1D8"}}></span><span style={{width: "30px", height: "14px", borderRadius: "7px", background: "#2445E8"}}></span></div>
      </div>
      <div style={{padding: "18px", display: "flex", flexDirection: "column", gap: "14px"}}>
      <div style={{display: "flex", alignItems: "center", gap: "4px"}}>
      <span style={{flex: "1", minWidth: "0", boxSizing: "border-box", padding: "6px 4px", borderRadius: "9px", border: `2px solid ${c.c1}`, background: c.b1, textAlign: "center", fontSize: "11.5px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "background .3s, border-color .3s"}}>{c.n1}</span><span style={{width: "8px", height: "2px", background: "#B6C0CA"}}></span>
      <span style={{flex: "1", minWidth: "0", boxSizing: "border-box", padding: "6px 4px", borderRadius: "9px", border: `2px solid ${c.c2}`, background: c.b2, textAlign: "center", fontSize: "11.5px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "background .3s, border-color .3s"}}>{c.n2}</span><span style={{width: "8px", height: "2px", background: "#B6C0CA"}}></span>
      <span style={{flex: "1", minWidth: "0", boxSizing: "border-box", padding: "6px 4px", borderRadius: "9px", border: `2px solid ${c.c3}`, background: c.b3, textAlign: "center", fontSize: "11.5px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "background .3s, border-color .3s"}}>{c.n3}</span>
      </div>
      <div><h3 className="rx-h2" style={{margin: "0", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.02em"}}>{c.title}</h3><p style={{margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#3A4652"}}>{c.line}</p></div>
      </div>
      </article>
      </Fragment>))}
      </div>
      </div>
      </section>

      {/* FINAL CTA */}
      <section id="bat-dau" className="rx-pad" style={{padding: "0 48px 104px"}}>
      <div style={{maxWidth: "1240px", margin: "0 auto", borderRadius: "28px", background: "#2445E8", color: "#FFFFFF", padding: "72px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center"}}>
      <h2 className="rx-h2" style={{margin: "0", maxWidth: "760px", fontSize: "56px", lineHeight: "1", fontWeight: "750", letterSpacing: "-0.045em"}}>Doanh nghiệp của bạn cần ERP kiểu gì?</h2>
      <div style={{width: "100%", maxWidth: "680px", display: "flex", flexWrap: "wrap", gap: "10px", padding: "10px", borderRadius: "999px", background: "#FFFFFF"}}>
      <input type="text" aria-label="Mô tả doanh nghiệp của bạn" placeholder="Ví dụ: quản lý bán hàng và kho cho cửa hàng của tôi…" style={{flex: "1 1 260px", minWidth: "0", minHeight: "48px", padding: "0 18px", border: "0", borderRadius: "999px", background: "transparent", color: "#0E1A24", fontFamily: "inherit", fontSize: "16px", outlineOffset: "2px"}} />
      <a href="https://portal.rotexai.com" style={{display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "48px", padding: "0 26px", borderRadius: "999px", background: "#0E1A24", color: "#FFFFFF", fontWeight: "700", fontSize: "16px"}}>Bắt đầu</a>
      </div>
      </div>
      </section>

      <footer className="rx-pad" style={{padding: "40px 48px", borderTop: "1px solid #D9DFE4"}}>
      <div style={{maxWidth: "1240px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px", fontSize: "14px", color: "#55626E"}}>
      <span style={{maxWidth: "560px", lineHeight: "1.55"}}>RotexAI làm sản phẩm thật sự giúp ích cho con người, góp sức cho sự phát triển của Việt Nam.</span>
      <span>© 2026 RotexAI</span>
      </div>
      </footer>

      </div>
    )
  }
}

export default App
