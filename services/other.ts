export const getNewId = async () => {
  const res = await fetch(`${process.env.APP_URL}/api/randomid`, {
    method: "get",
  });

  return res.json();
};

export const getDate = async () => {
  const res = await fetch(`${process.env.APP_URL}/api/date`, {
    method: "get",
  });

  return res.json();
};
