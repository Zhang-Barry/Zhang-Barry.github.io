function doPost(e) {
  const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '{}';

  let payload = {};
  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    payload = {};
  }

  const answers = payload.answers || {};
  const ss = SpreadsheetApp.openById('1UfWG2XZ-6YqYYOrMh1XAdxdKq0_fzSRv2x5LnWFZNiw');
  const sheet = ss.getSheetByName('Responses');

  if (!sheet) {
    ss.insertSheet('Responses');
  }

  const row = [
    payload.submittedAt || new Date().toISOString(),
    answers.date || '',
    answers.like || '',
    answers.activity || '',
    answers.food || '',
    answers.day || ''
  ];

  ss.getSheetByName('Responses').appendRow(row);

  return ContentService.createTextOutput('OK');
}

function doGet() {
  return ContentService.createTextOutput('Use POST from the date app.');
}
