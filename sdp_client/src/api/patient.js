import user from "./user";

export const getUser = async (userId) => {
  try {
    console.log(userId);
    const { data } = await user(`/auth/getuser/${userId}`);
    console.log(userId);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};
