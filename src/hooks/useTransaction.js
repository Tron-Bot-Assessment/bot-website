import { APIUtils } from "../utils/apiUtils"

export const useTransaction = () => {
  const { runAPI } = APIUtils();

  async function getTransactions(fingerprint) {
    try {
      let url = 'https://api.trongrid.io/v1/accounts/TSaJqQ1AZ2bEYyqBwBmJqCBSPv8KPRTAdv/transactions/trc20?contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&limit=50&only_confirmed=true'
      if (fingerprint) {
        url += `&fingerprint=${fingerprint}`;
      }
      const result = await runAPI({ method: 'get', url: url});
      return { data: result.data, fingerprint: result.meta.fingerprint || null };
    } catch (err) {
      console.log(err);
    }
    return { data: [], fingerprint: null };
  }

  return { getTransactions };
};
