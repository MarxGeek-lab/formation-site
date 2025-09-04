
export const handleAxiosError = (error) => {
  const axiosError = error;

  console.error(axiosError);

  if (axiosError?.response?.status === 401) {
    localStorage.removeItem("accessToken")
    // window.location.href = '/';
  }

  
return axiosError?.response?.status || 500;
}; 