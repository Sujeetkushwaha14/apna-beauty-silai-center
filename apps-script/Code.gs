/** Apna Beauty & Silai Center - free student portal backend
 * Deploy this file as a Google Apps Script Web App.
 * Keep ADMIN_PASSWORD and GITHUB_TOKEN in Script Properties, never in this file.
 * Sheet must remain private.
 */

const CONFIG = {
  SHEET_ID: '1IddjeNwq2V70Gt9YkSpgJtOtpuk5lAN9Z26HvTWX4Wc',
  SHEET_NAME: 'Students',
  GITHUB_OWNER: 'Sujeetkushwaha14',
  GITHUB_REPO: 'apna-beauty-silai-center',
  GITHUB_BRANCH: 'main',
  CERT_DIR: 'certificates'
};

function doGet() {
  return json_({ ok: true, service: 'Apna Beauty & Silai Center student portal' });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    return json_(route_(body));
  } catch (err) {
    return json_({ ok: false, error: safeError_(err) });
  }
}

function route_(b) {
  switch (String(b.action || '')) {
    case 'setup': return setup_();
    case 'register': return register_(b);
    case 'login': return login_(b);
    case 'profile': return profile_(b);
    case 'adminLogin': return adminLogin_(b);
    case 'adminStudents': return adminStudents_(b);
    case 'updateFee': return updateFee_(b);
    case 'uploadCertificate': return uploadCertificate_(b);
    default: return { ok: false, error: 'Unknown action' };
  }
}

function setup_() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) sh = ss.insertSheet(CONFIG.SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Student ID','Aadhaar Name','Mobile','Password Hash','Fee Status','Certificate File','Created At']);
  }
  return { ok: true, message: 'Sheet ready', headers: sh.getRange(1,1,1,7).getValues()[0] };
}

function register_(b) {
  const name = String(b.aadhaarName || '').trim();
  const mobile = normalizeMobile_(b.mobile);
  const password = String(b.password || '');
  if (name.length < 2) return { ok:false, error:'Valid Aadhaar name required' };
  if (!/^\d{10}$/.test(mobile)) return { ok:false, error:'Enter a valid 10-digit mobile number' };
  if (password.length < 8) return { ok:false, error:'Password must be at least 8 characters' };

  const sh = sheet_();
  const rows = dataRows_(sh);
  if (rows.some(r => String(r[2]) === mobile)) return { ok:false, error:'Mobile already registered' };
  const id = Utilities.getUuid();
  sh.appendRow([id, name, mobile, hash_(password), 'PENDING', '', new Date()]);
  return { ok:true, studentId:id, name:name, mobile:mobile, feeStatus:'PENDING', certificateFile:'' };
}

function login_(b) {
  const mobile = normalizeMobile_(b.mobile);
  const password = String(b.password || '');
  const r = findStudent_(mobile);
  if (!r || !constantTime_(String(r[3]), hash_(password))) return { ok:false, error:'Mobile or password is incorrect' };
  const token = makeSession_('student', String(r[0]));
  return { ok:true, token:token, profile:studentObject_(r) };
}

function profile_(b) {
  const sid = session_(b.token, 'student');
  if (!sid) return { ok:false, error:'Session expired. Please login again.' };
  const r = findStudentById_(sid);
  if (!r) return { ok:false, error:'Student not found' };
  return { ok:true, profile:studentObject_(r) };
}

function adminLogin_(b) {
  const props = PropertiesService.getScriptProperties();
  const username = String(b.username || '').trim();
  const password = String(b.password || '');
  const adminUser = props.getProperty('ADMIN_USERNAME') || 'admin';
  const adminHash = props.getProperty('ADMIN_PASSWORD_HASH');
  if (username !== adminUser || !adminHash || !constantTime_(adminHash, hash_(password))) return { ok:false, error:'Invalid admin login' };
  return { ok:true, token:makeSession_('admin','admin') };
}

function adminStudents_(b) {
  if (!session_(b.token, 'admin')) return { ok:false, error:'Admin session expired' };
  const sh = sheet_();
  return { ok:true, students:dataRows_(sh).map(studentObject_) };
}

function updateFee_(b) {
  if (!session_(b.token, 'admin')) return { ok:false, error:'Admin session expired' };
  const id = String(b.studentId || '');
  const status = String(b.feeStatus || '').toUpperCase();
  if (!['PAID','PENDING'].includes(status)) return { ok:false, error:'Invalid fee status' };
  const sh = sheet_();
  const row = findRowById_(sh,id);
  if (!row) return { ok:false, error:'Student not found' };
  sh.getRange(row,5).setValue(status);
  return { ok:true };
}

function uploadCertificate_(b) {
  if (!session_(b.token, 'admin')) return { ok:false, error:'Admin session expired' };
  const id = String(b.studentId || '');
  const name = String(b.fileName || 'certificate.pdf').replace(/[^a-zA-Z0-9._-]/g,'_');
  const data = String(b.base64 || '');
  if (!id || !data) return { ok:false, error:'Certificate file missing' };
  if (data.length > 12000000) return { ok:false, error:'Certificate is too large' };

  const props = PropertiesService.getScriptProperties();
  const ghToken = props.getProperty('GITHUB_TOKEN');
  if (!ghToken) return { ok:false, error:'GitHub token is not configured in Apps Script' };

  const path = CONFIG.CERT_DIR + '/' + id + '-' + Date.now() + '-' + name;
  const url = 'https://api.github.com/repos/' + CONFIG.GITHUB_OWNER + '/' + CONFIG.GITHUB_REPO + '/contents/' + encodeURIComponent(path);
  const payload = { message:'Add student certificate ' + id, content:data, branch:CONFIG.GITHUB_BRANCH };
  const res = UrlFetchApp.fetch(url, {
    method:'post', contentType:'application/json', muteHttpExceptions:true,
    headers:{ Authorization:'Bearer ' + ghToken, Accept:'application/vnd.github+json', 'X-GitHub-Api-Version':'2022-11-28' },
    payload:JSON.stringify(payload)
  });
  const code = res.getResponseCode();
  if (code < 200 || code >= 300) return { ok:false, error:'GitHub upload failed (' + code + ')' };

  const sh = sheet_();
  const row = findRowById_(sh,id);
  if (!row) return { ok:false, error:'Student not found after upload' };
  sh.getRange(row,6).setValue(path);
  return { ok:true, path:path, url:'https://' + CONFIG.GITHUB_OWNER + '.github.io/' + CONFIG.GITHUB_REPO + '/' + path };
}

function sheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) { setup_(); sh = ss.getSheetByName(CONFIG.SHEET_NAME); }
  return sh;
}
function dataRows_(sh) { const n=sh.getLastRow(); return n<2 ? [] : sh.getRange(2,1,n-1,7).getValues(); }
function findStudent_(mobile) { return dataRows_(sheet_()).find(r => String(r[2])===mobile) || null; }
function findStudentById_(id) { return dataRows_(sheet_()).find(r => String(r[0])===id) || null; }
function findRowById_(sh,id) { const rows=dataRows_(sh); const i=rows.findIndex(r=>String(r[0])===id); return i<0 ? 0 : i+2; }
function studentObject_(r) { return { studentId:String(r[0]), name:String(r[1]), mobile:String(r[2]), feeStatus:String(r[4]||'PENDING').toUpperCase(), certificateFile:String(r[5]||'') }; }
function normalizeMobile_(v) { return String(v||'').replace(/\D/g,'').slice(-10); }
function hash_(s) { const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8); return bytes.map(b => ('0'+((b+256)%256).toString(16)).slice(-2)).join(''); }
function constantTime_(a,b) { if(a.length!==b.length)return false; let x=0; for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i); return x===0; }
function makeSession_(role,id) { const token=Utilities.getUuid()+'-'+Utilities.getUuid(); CacheService.getScriptCache().put('sess:'+token, role+':'+id, 21600); return token; }
function session_(token,role) { const v=String(CacheService.getScriptCache().get('sess:'+String(token||''))||''); return v.indexOf(role+':')===0 ? v.slice(role.length+1) : ''; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function safeError_(e) { return String(e && e.message || e).slice(0,300); }
