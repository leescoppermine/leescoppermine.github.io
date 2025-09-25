// 샘플 데이터: 날짜, 출근/퇴근 시각, 장소, 메모
const records = [
  {date:'2025-09-15', in:'09:12', out:'18:07', place:'본사', note:'회의 2건'},
  {date:'2025-09-16', in:'09:03', out:'19:11', place:'본사', note:'개발 집중'},
  {date:'2025-09-17', in:'09:08', out:'18:44', place:'본사', note:'코드리뷰'},
  {date:'2025-09-18', in:'08:55', out:'18:02', place:'본사', note:'빡센 날'},
  {date:'2025-09-19', in:'09:21', out:'17:50', place:'재택', note:'원격 회의'},
  {date:'2025-09-22', in:'09:05', out:'18:30', place:'본사', note:'복직 첫 주'},
  {date:'2025-09-23', in:'09:10', out:'18:40', place:'본사', note:'문서 작업'},
  {date:'2025-09-24', in:'09:00', out:'18:20', place:'본사', note:'테스트'},
  {date:'2025-09-25', in:'09:18', out:'18:10', place:'본사', note:'보고서'},
];

function parseTime(str) {
  const [h,m] = str.split(':').map(Number);
  return h*60+m;
}
function fmtHM(mins){
  const h=Math.floor(mins/60), m=mins%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
function weekRange(pivot){
  // pivot: Date -> (mon..sun) 범위
  const d = new Date(pivot.getFullYear(), pivot.getMonth(), pivot.getDate());
  const day = (d.getDay()+6)%7; // Mon=0
  const mon = new Date(d); mon.setDate(d.getDate()-day);
  const sun = new Date(mon); sun.setDate(mon.getDate()+6);
  return [mon, sun];
}
function inRange(dateStr, from, to){
  const d = new Date(dateStr+"T00:00:00");
  return d>=from && d<=to;
}
function totalMinutes(rec){ return parseTime(rec.out)-parseTime(rec.in); }

const pivotEl = document.getElementById('pivotDate');
const listEl = document.getElementById('list');
const summaryEl = document.getElementById('summary');
const searchEl = document.getElementById('search');

function render(){
  const pivot = pivotEl.value ? new Date(pivotEl.value+"T00:00:00") : new Date();
  const [from, to] = weekRange(pivot);
  const q = searchEl.value.trim().toLowerCase();

  const view = records
    .filter(r => inRange(r.date, from, to))
    .filter(r => !q || (r.place+r.note).toLowerCase().includes(q))
    .sort((a,b)=>a.date.localeCompare(b.date));

  let total = 0;
  listEl.innerHTML = view.map((r, idx)=>{
    const mins = totalMinutes(r);
    total += Math.max(0, mins);
    const hours = fmtHM(Math.max(0, mins));
    return `
    <li class="item">
      <div class="row" data-idx="${idx}" role="button" aria-expanded="false">
        <div>
          <div class="date">${r.date}</div>
          <div class="sub">${r.place} • ${r.note||''}</div>
        </div>
        <div class="badges">
          <span class="badge">출근 ${r.in}</span>
          <span class="badge">퇴근 ${r.out}</span>
          <span class="badge">근무 ${hours}</span>
        </div>
      </div>
      <div class="detail" id="detail-${idx}">
        <div class="meta">
          <div>출근: <strong>${r.in}</strong></div>
          <div>퇴근: <strong>${r.out}</strong></div>
          <div>장소: <strong>${r.place}</strong></div>
          <div>메모: <strong>${r.note||'-'}</strong></div>
        </div>
        <button class="smallBtn" data-edit="${idx}">시간 조정</button>
      </div>
    </li>`;
  }).join('');

  summaryEl.textContent = view.length
    ? `${from.toISOString().slice(0,10)} ~ ${to.toISOString().slice(0,10)} • ${view.length}일 • 총 근무 ${fmtHM(total)}`
    : `${from.toISOString().slice(0,10)} ~ ${to.toISOString().slice(0,10)} • 데이터 없음`;

  // 토글 & 간단 편집
  listEl.querySelectorAll('.row').forEach(row=>{
    row.addEventListener('click', e=>{
      const idx = row.dataset.idx;
      const detail = document.getElementById('detail-'+idx);
      const open = detail.classList.toggle('open');
      row.setAttribute('aria-expanded', open?'true':'false');
    }, {once:false});
  });
  listEl.querySelectorAll('[data-edit]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const idx = Number(btn.dataset.edit);
      const r = records.filter(rr=>inRange(rr.date, ...weekRange(pivot)))[idx];
      const ni = prompt('출근 시간(HH:MM)', r.in);
      if(!ni) return;
      const no = prompt('퇴근 시간(HH:MM)', r.out);
      if(!no) return;
      r.in = ni; r.out = no;
      render();
    });
  });
}

document.getElementById('prevWeek').addEventListener('click', ()=>{
  const d = pivotEl.value ? new Date(pivotEl.value) : new Date();
  d.setDate(d.getDate()-7);
  pivotEl.value = d.toISOString().slice(0,10);
  render();
});
document.getElementById('nextWeek').addEventListener('click', ()=>{
  const d = pivotEl.value ? new Date(pivotEl.value) : new Date();
  d.setDate(d.getDate()+7);
  pivotEl.value = d.toISOString().slice(0,10);
  render();
});
document.getElementById('clearSearch').addEventListener('click', ()=>{
  searchEl.value=''; render();
});
searchEl.addEventListener('input', ()=>render());

// 초기 날짜 세팅: 오늘
(function(){
  const today = new Date();
  pivotEl.value = today.toISOString().slice(0,10);
  render();
})();

// PWA 설치(오프라인 캐시)
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>navigator.serviceWorker.register('./sw.js'));
}
