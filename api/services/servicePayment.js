import axios from "axios";

class MoneroPayment {
  constructor(secretKey) {
    this.apiUrl = "https://api.moneroo.io/v1/payments/initialize";
    this.secretKey = secretKey;
  }

  async initializePayment({
    amount,
    currency,
    description,
    customer,
    return_url,
    metadata,
    methods,
  }) {
    try {
      const data = {
        amount,
        currency,
        description,
        customer,
        return_url,
        metadata,
        methods,
      };

      const options = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.secretKey}`,
        },
      };

      const response = await axios.post(this.apiUrl, data, options);

      if (response.status !== 201) {
        throw new Error(
          `Request failed with status ${response.status}: ${response.statusText}`
        );
      }

      return {
        success: true,
        checkoutUrl: response.data.checkout_url,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Payment initialization failed:", error.message);
      console.log(error)
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  };

   // 🔹 Vérifier un paiement
   async verifyPayment(paymentId) {
    try {
      const response = await axios.get(`https://api.moneroo.io/v1/payments/${paymentId}/verify`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      });

      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
        };
      } else {
        return {
          success: false,
          error: response.data,
        };
      }
    } catch (error) {
      console.log(error)
      console.error("❌ Payment verification failed:", error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }
}

export default MoneroPayment;
