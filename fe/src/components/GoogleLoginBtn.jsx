import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function GoogleLoginBtn() {
  const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiUrl = import.meta.env.VITE_API; // Add API URL

  const onSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name } = decoded;

      // Check if user exists in the database
      const userCheckResponse = await axios.get(`${apiUrl}/users/check`, {
        params: { email },
      });

      if (!userCheckResponse.data.exists) {   
        // Create a new user if not exists
        await axios.post(`${apiUrl}/users/create`, {
          name,
          email,
          password: "12345678", // Placeholder password
        });
      }

      // Log the user in
      const loginResponse = await axios.post(`${apiUrl}/login`, {
        email,
        password: "12345678", // Placeholder password
      });

      localStorage.setItem("token", loginResponse.data.access_token);
      window.location.href = "/";
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const onFailure = (res) => {
    console.log(res);
  };

  return (
    <GoogleOAuthProvider clientId={clientID}>
      <GoogleLogin
        text="Đăng nhập bằng Google"
        onSuccess={onSuccess}
        onError={onFailure}
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginBtn;
