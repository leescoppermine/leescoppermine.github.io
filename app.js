const view = document.getElementById('view');
const tabs = document.querySelectorAll('.tabbar button');
tabs.forEach(b=>b.addEventListener('click', ()=>{
  tabs.forEach(x=>x.classList.remove('active')); b.classList.add('active');
  route(b.dataset.tab);
}));
function route(tab){
  if(tab==='home') return renderHome();
  if(tab==='requests') return renderRequests();
  if(tab==='schedule') return renderSchedule();
  if(tab==='records') return renderRecords();
  if(tab==='vacation') return renderVacation();
  renderHome();
}
const todayInfo = {date:'9/25 (목)', time:'08:30 - 17:30', team:'PCR장비개발랩', state:'계획'};
const weekA = [
  {d:'27(토)', t:'육아휴직', icon:'✈️', dim:true},
  {d:'28(일)', t:'육아휴직', icon:'✈️', dim:true},
  {d:'29(월)', t:'08:30\n17:30'},
  {d:'30(화)', t:'08:30\n17:30'},
  {d:'1(수)', t:'08:30\n17:30'},
  {d:'2(목)', t:'08:30\n17:30'},
  {d:'3(금)', t:'일정\n없음', dim:true}
];
const scheduleExample = [{date:'2025년 10월 1일, 수', start:'08:30', end:'17:30', person:'이기훈', place:'PCR장비개발랩 / Level 4 (팀원)'}];
const recordExample = [{date:'8월 13일 2025', start:'07:53', end:'17:32', real:'8시간 9분', break:'1시간 30분'}];
function pill({d,t,icon,dim}){
  return `<div class="daypill${dim?' dim':''}"><div class="label">${d}</div><div class="time">${icon?icon+' ':''}${t.replace('\\n','<br>')}</div></div>`;
}
function renderHome(){
  view.innerHTML = `
  <div class="card"><h3>내 리포트</h3><div class="section kv"><div class="k">이번주</div><div class="v">0분 / 32시간</div></div></div>
  <div class="card"><h3>출근/퇴근 누락 기록</h3><div class="section dim">누락 기록이 없습니다</div></div>
  <div class="card"><h3>오늘 근무</h3><div class="section">
    <div class="kv"><div class="k">날짜</div><div class="v">${todayInfo.date}</div></div>
    <div class="kv"><div class="k">시간</div><div class="v">${todayInfo.time}</div></div>
    <div class="kv"><div class="k">부서</div><div class="v">${todayInfo.team} <span class="badge">${todayInfo.state}</span></div></div>
    <div class="row" style="margin-top:8px"><button class="btn-ghost">요청</button><button class="btn-primary">출근하기</button></div>
  </div></div>
  <div class="card">
    <div class="section row"><div style="font-weight:700">이번주 근무</div><div class="dim">09.27 - 10.03 ▼</div></div>
    <div class="section week">${weekA.map(pill).join('')}</div>
    <div class="section"><div class="progress"><div style="width:0%"></div></div><div class="dim" style="margin-top:6px">0분 / 32시간</div></div>
  </div>`;
}
function renderRequests(){
  view.innerHTML = `<div class="card">
    <div class="section row"><div class="row" style="gap:6px"><span style="font-weight:700">내 요청</span><span class="badge">0</span><span class="badge" style="background:#e6f6ea;border-color:#cdebd6;color:#118f43">완료 1</span></div><div class="dim">09.11 - 09.25 ▼</div></div>
    <div class="section dim" style="height:200px;display:flex;align-items:center;justify-content:center">내가 보낸 요청이 없습니다</div></div>`;
}
function renderSchedule(){
  const s = scheduleExample[0];
  view.innerHTML = `<div class="card">
  <div class="section row"><div class="row" style="gap:8px;align-items:center"><span class="badge">10.01</span><span style="font-weight:700">근무일정</span></div><div class="dim">8시간</div></div>
  <div class="section"><div class="kv"><div class="k">${s.start}</div><div class="v">${s.person}</div></div><div class="kv"><div class="k">${s.end}</div><div class="v">${s.place}</div></div></div></div>`;
}
function renderRecords(){
  const r = recordExample[0];
  view.innerHTML = `<div class="card">
  <div class="section row"><div class="row" style="gap:8px;align-items:center"><span class="badge">08.13</span><span style="font-weight:700">출퇴근기록</span></div><div class="dim">${r.real}</div></div>
  <div class="section"><table class="table"><thead><tr><th>날짜</th><th>출근</th><th>퇴근</th><th>실제 근로</th><th>휴게</th></tr></thead>
  <tbody><tr><td>${r.date}</td><td>${r.start}</td><td>${r.end}</td><td>${r.real}</td><td>${r.break}</td></tr></tbody></table>
  <div class="dim" style="margin-top:12px">출퇴근기록이 없습니다</div></div></div>`;
}
function renderVacation(){
  view.innerHTML = `<div class="card"><div class="section row"><div style="font-weight:700">내 휴가</div><div class="dim">2025.09.25(목)</div></div>
  <div class="section"><table class="table"><thead><tr><th>항목</th><th>총</th><th>사용</th><th>잔여</th></tr></thead>
  <tbody><tr><td>I. 연차</td><td>16</td><td>16</td><td>0</td></tr><tr><td>III. 돌봄&힐링Day</td><td>0</td><td>0</td><td>0</td></tr><tr><td>VII. 기타휴가</td><td>0</td><td>0</td><td>0</td></tr><tr><td>VIII. 육아휴직</td><td>0</td><td>0</td><td>0</td></tr></tbody></table></div></div>`;
}
route('home');