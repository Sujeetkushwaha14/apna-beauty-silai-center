/** Apna Beauty & Silai Center - student portal backend
 * Google Sheet = private student database
 * Google Drive = certificates + private profile photos
 * Keep ADMIN_PASSWORD_HASH and CERT_FOLDER_ID in Apps Script Script Properties.
 */

const CONFIG = {
  SHEET_ID: '1IddjeNwq2V70Gt9YkSpgJtOtpuk5lAN9Z26HvTWX4Wc',
  SHEET_NAME: 'Students'
};

const HEADERS = [
  'Student ID','Aadhaar Name','Mobile','Password Hash','Fee Status',
  'Certificate File','Created At','Total Fee','Fee Paid','Fee Due','Profile Photo File ID'
];

function doGet() { return json_({ ok:true, service:'Apna Beauty & Silai Center student portal' }); }
function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    return json_(route_(body));
  } catch(err) {
    return json_({ ok:false, error:safeError_(err) });
  }
}

function route_(b) {
  switch(String(b.action||'')) {
    case 'setup': return setup_();
    case 'register': return register_(b);
    case 'login': return login_(b);
    case 'profile': return profile_(b);
    case 'adminLogin': return adminLogin_(b);
    case 'adminStudents': return adminStudents_(b);
    case 'updateFee': return updateFee_(b);
    case 'uploadCertificate': return uploadCertificate_(b);
    case 'updateProfilePhoto': return updateProfilePhoto_(b);
    default: return {ok:false,error:'Unknown action'};
  }
}

function setup_() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if(!sh) sh = ss.insertSheet(CONFIG.SHEET_NAME);

  if(sh.getLastRow() === 0) {
    sh.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  } else {
    // Keep existing student data and add the new fee/photo columns.
    sh.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  }
  return {ok:true,message:'Sheet ready',headers:HEADERS};
}

function register_(b) {
  const name=String(b.aadhaarName||'').trim();
  const mobile=normalizeMobile_(b.mobile);
  const password=String(b.password||'');
  if(name.length<2) return {ok:false,error:'Valid Aadhaar name required'};
  if(!/^\d{10}$/.test(mobile)) return {ok:false,error:'Enter a valid 10-digit mobile number'};
  if(password.length<8) return {ok:false,error:'Password must be at least 8 characters'};

  const sh=sheet_(), rows=dataRows_(sh);
  if(rows.some(r=>String(r[2])===mobile)) return {ok:false,error:'Mobile already registered'};

  const id=Utilities.getUuid();
  sh.appendRow([id,name,mobile,hash_(password),'PENDING','',new Date(),0,0,0,'']);
  return {ok:true,studentId:id,name:name,mobile:mobile,feeStatus:'PENDING',totalFee:0,feePaid:0,feeDue:0,certificateFile:'',profilePhoto:''};
}

function login_(b) {
  const mobile=normalizeMobile_(b.mobile), password=String(b.password||'');
  const r=findStudent_(mobile);
  if(!r || !constantTime_(String(r[3]),hash_(password))) return {ok:false,error:'Mobile or password is incorrect'};
  const token=makeSession_('student',String(r[0]));
  return {ok:true,token:token,profile:studentProfileObject_(r)};
}

function profile_(b) {
  const sid=session_(b.token,'student');
  if(!sid) return {ok:false,error:'Session expired. Please login again.'};
  const r=findStudentById_(sid);
  if(!r) return {ok:false,error:'Student not found'};
  return {ok:true,profile:studentProfileObject_(r)};
}

function adminLogin_(b) {
  const props=PropertiesService.getScriptProperties();
  const username=String(b.username||'').trim();
  const password=String(b.password||'');
  const adminUser=props.getProperty('ADMIN_USERNAME')||'admin';
  const adminHash=props.getProperty('ADMIN_PASSWORD_HASH');
  if(username!==adminUser || !adminHash || !constantTime_(adminHash,hash_(password))) return {ok:false,error:'Invalid admin login'};
  return {ok:true,token:makeSession_('admin','admin')};
}

function adminStudents_(b) {
  if(!session_(b.token,'admin')) return {ok:false,error:'Admin session expired'};
  return {ok:true,students:dataRows_(sheet_()).map(studentObject_)};
}

function updateFee_(b) {
  if(!session_(b.token,'admin')) return {ok:false,error:'Admin session expired'};

  const id=String(b.studentId||'').trim();
  const total=Math.max(0,Number(b.totalFee)||0);
  const paid=Math.min(total,Math.max(0,Number(b.feePaid)||0));
  const due=Math.max(0,total-paid);
  const status=(total>0 && due<=0) ? 'PAID' : 'PENDING';

  const sh=sheet_(), row=findRowById_(sh,id);
  if(!row) return {ok:false,error:'Student not found'};

  ensureHeaders_(sh);
  sh.getRange(row,5,1,6).setValues([[status,sh.getRange(row,6).getValue(),sh.getRange(row,7).getValue(),total,paid,due]]);
  return {ok:true,feeStatus:status,totalFee:total,feePaid:paid,feeDue:due};
}

function uploadCertificate_(b) {
  if(!session_(b.token,'admin')) return {ok:false,error:'Admin session expired'};

  const id=String(b.studentId||'').trim();
  const name=String(b.fileName||'certificate.pdf').replace(/[^a-zA-Z0-9._-]/g,'_');
  const mime=String(b.mimeType||'application/pdf').trim()||'application/pdf';
  const data=String(b.base64||'').trim();
  if(!id||!data) return {ok:false,error:'Certificate file missing'};
  if(data.length>12000000) return {ok:false,error:'Certificate is too large'};

  const sh=sheet_(), row=findRowById_(sh,id);
  if(!row) return {ok:false,error:'Student not found'};

  const folderId=String(PropertiesService.getScriptProperties().getProperty('CERT_FOLDER_ID')||'').trim();
  if(!folderId) return {ok:false,error:'CERT_FOLDER_ID is not configured in Apps Script'};

  try {
    const folder=DriveApp.getFolderById(folderId);
    const safeName=id+'-'+Date.now()+'-'+name;
    const blob=Utilities.newBlob(Utilities.base64Decode(data),mime,safeName);
    const file=folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
    const fileId=file.getId();
    const downloadUrl='https://drive.google.com/uc?export=download&id='+encodeURIComponent(fileId);
    sh.getRange(row,6).setValue(downloadUrl);
    return {ok:true,fileId:fileId,path:downloadUrl,url:downloadUrl,name:safeName};
  } catch(err) {
    return {ok:false,error:'Google Drive upload failed: '+safeError_(err)};
  }
}

function updateProfilePhoto_(b) {
  const sid=session_(b.token,'student');
  if(!sid) return {ok:false,error:'Session expired. Please login again.'};

  const id=sid;
  const data=String(b.base64||'').trim();
  const mime=String(b.mimeType||'image/jpeg').trim()||'image/jpeg';
  if(!data) return {ok:false,error:'Profile photo missing'};
  if(data.length>900000) return {ok:false,error:'Photo is too large. Please choose a smaller photo.'};
  if(!/^image\/(jpeg|png|webp)$/i.test(mime)) return {ok:false,error:'Only JPG, PNG or WEBP photo is allowed'};

  const sh=sheet_(), row=findRowById_(sh,id);
  if(!row) return {ok:false,error:'Student not found'};
  const folderId=String(PropertiesService.getScriptProperties().getProperty('CERT_FOLDER_ID')||'').trim();
  if(!folderId) return {ok:false,error:'CERT_FOLDER_ID is not configured in Apps Script'};

  try {
    const folder=DriveApp.getFolderById(folderId);
    const ext=mime.split('/')[1].replace('jpeg','jpg');
    const fileName=id+'-profile-'+Date.now()+'.'+ext;
    const blob=Utilities.newBlob(Utilities.base64Decode(data),mime,fileName);
    const file=folder.createFile(blob);
    const oldId=String(sh.getRange(row,11).getValue()||'').trim();
    sh.getRange(row,11).setValue(file.getId());
    if(oldId && oldId!==file.getId()) {
      try { DriveApp.getFileById(oldId).setTrashed(true); } catch(_) {}
    }
    return {ok:true,message:'Profile photo updated',profilePhoto:photoData_(file.getId())};
  } catch(err) {
    return {ok:false,error:'Profile photo upload failed: '+safeError_(err)};
  }
}

function studentProfileObject_(r) {
  const p=studentObject_(r);
  p.profilePhoto=photoData_(String(r[10]||'').trim());
  return p;
}

function photoData_(fileId) {
  if(!fileId) return '';
  try {
    const file=DriveApp.getFileById(fileId);
    const blob=file.getBlob();
    const bytes=blob.getBytes();
    if(bytes.length>700000) return '';
    return 'data:'+blob.getContentType()+';base64,'+Utilities.base64Encode(bytes);
  } catch(_) { return ''; }
}

function studentObject_(r) {
  const total=Math.max(0,Number(r[7])||0);
  const paid=Math.min(total,Math.max(0,Number(r[8])||0));
  const due=Math.max(0,total-paid);
  const status=(total>0 && due<=0)?'PAID':'PENDING';
  return {
    studentId:String(r[0]),
    name:String(r[1]),
    mobile:String(r[2]),
    feeStatus:status,
    totalFee:total,
    feePaid:paid,
    feeDue:due,
    certificateFile:String(r[5]||''),
    profilePhotoFileId:String(r[10]||'')
  };
}

function sheet_() {
  const ss=SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sh=ss.getSheetByName(CONFIG.SHEET_NAME);
  if(!sh){ setup_(); sh=ss.getSheetByName(CONFIG.SHEET_NAME); }
  ensureHeaders_(sh);
  return sh;
}

function ensureHeaders_(sh) {
  if(sh.getLastColumn()<HEADERS.length || String(sh.getRange(1,11).getValue()||'')!=='Profile Photo File ID') {
    sh.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  }
}

function dataRows_(sh) {
  const n=sh.getLastRow();
  if(n<2) return [];
  ensureHeaders_(sh);
  return sh.getRange(2,1,n-1,HEADERS.length).getValues();
}
function findStudent_(mobile){return dataRows_(sheet_()).find(r=>String(r[2])===mobile)||null;}
function findStudentById_(id){return dataRows_(sheet_()).find(r=>String(r[0])===id)||null;}
function findRowById_(sh,id){const rows=dataRows_(sh),i=rows.findIndex(r=>String(r[0])===id);return i<0?0:i+2;}
function normalizeMobile_(v){return String(v||'').replace(/\D/g,'').slice(-10);}
function hash_(s){const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s,Utilities.Charset.UTF_8);return bytes.map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');}
function constantTime_(a,b){if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0;}
function makeSession_(role,id){const token=Utilities.getUuid()+'-'+Utilities.getUuid();CacheService.getScriptCache().put('sess:'+token,role+':'+id,21600);return token;}
function session_(token,role){const v=String(CacheService.getScriptCache().get('sess:'+String(token||''))||'');return v.indexOf(role+':')===0?v.slice(role.length+1):'';}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function safeError_(e){return String(e&&e.message||e).slice(0,300);}
