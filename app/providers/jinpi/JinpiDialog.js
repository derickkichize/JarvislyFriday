const colors = require('../../../libs/Dialogs/Colors');
module.exports = () => {
  console.clear();
  console.log(
      `+${colors.fg.green}------------------------------------------------- ${colors.reset}`);
  console.log(
      `+${colors.fg.magenta}\t\tJinpi ${colors.fg.green} v1.0${colors.reset}`);
  console.log(
      `+${colors.fg.green}------------------------------------------------- ${colors.reset}`);
};