const API_URL = import.meta.env.VITE_API_URL;

// Fungsi untuk mengecek apakah server berjalan
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server health check failed: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Server health check error:", err);
    throw new Error("Server tidak dapat dijangkau. Pastikan server backend berjalan.");
  }
};

export const sendImageToBackend = async (imageBlob) => {
  if (!imageBlob) {
    throw new Error("Tidak ada gambar yang dikirim");
  }

  if (imageBlob.size > 10 * 1024 * 1024) {
    throw new Error("Ukuran file terlalu besar. Maksimal 10MB");
  }

  console.log("Preparing to send image:", {
    size: imageBlob.size,
    type: imageBlob.type
  });

  const formData = new FormData();
  formData.append("image", imageBlob, "image.jpg");

  try {
    // Cek server health (opsional)
    await checkServerHealth();

    console.log("Sending request to server...");
    const response = await fetch(`${API_URL}/api/predict`, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      let errorMessage = "Gagal menerima respons dari server";

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        console.log("Server error response:", errorData);
      } catch (parseError) {
        errorMessage = `Server error (${response.status}): ${response.statusText}`;
        console.log("Failed to parse error response:", parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Prediction result:", result);

    if (!result.className || result.probability === undefined) {
      throw new Error("Response dari server tidak valid");
    }

    return result;
  } catch (err) {
    console.error("Error saat mengirim ke server:", err);

    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error(`Tidak dapat terhubung ke server. Pastikan server backend berjalan di ${API_URL}`);
    }

    throw err;
  }
};
