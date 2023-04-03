const R = require("ramda");

export const sortDateAscend = (data) => {
  const diff = function (a, b) {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  };
  return R.sort(diff, data);
};

export const sortDateDesc = (data) => {
  const diff = function (a, b) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };
  return R.sort(diff, data);
};

export const convetTime = (time) => {
  let newTime = time.split(":").map((unit) => {
    return parseInt(unit);
  });
  newTime[0] += 5;
  if (newTime[0] > 24) newTime[0] = newTime[0] - 24;
  newTime[1] += 30;
  if (newTime[1] > 60) {
    newTime[0] += 1;
    newTime[1] -= 60;
  }
  newTime = newTime.join(":");
  console.log(newTime);
  return newTime;
};
