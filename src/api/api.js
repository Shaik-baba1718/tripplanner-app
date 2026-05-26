

export const loginUserApi = async (username, password) => {
  const res = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return res.json();
};
 /*
export const getFoodsApi = async () => {
  const res = await fetch("https://dummyjson.com/recipes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
    we dont required token for dummy data.because token is not supported on dummy data*/