const agenda = require('../scheduler/agenda');

(async function () {
  await agenda.start();
  console.log('Worker started and agenda listening');
})();
