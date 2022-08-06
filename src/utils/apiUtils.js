import axios from "axios";

export const APIUtils = () => {
  const axiosInstance = axios.create({
    timeout: 60000,
    headers: { "Content-Type": "application/json" },
  });

  async function runAPI(props) {
    try {
      const res = await axiosInstance.request({
        method: props.method,
        url: props.url,
        data: props.data,
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      console.log(err);
    }
    return {};
  }

  return { runAPI };
};
