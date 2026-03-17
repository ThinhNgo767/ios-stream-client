const session = {
  set: (key, value) => {
    // sessionStorage chỉ lưu trữ chuỗi. Chuyển đổi đối tượng/mảng thành JSON.
    // Nếu 'value' đã là chuỗi hoặc kiểu nguyên thủy, nó sẽ lưu trữ nguyên trạng.
    if (typeof value === "object" && value !== null) {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      sessionStorage.setItem(key, value);
    }
  },
  get: (key) => {
    const value = sessionStorage.getItem(key);
    try {
      // Thử phân tích cú pháp dưới dạng JSON. Nếu thất bại, trả về chuỗi gốc.
      return JSON.parse(value);
    } catch (e) {
      return value; // Không phải là chuỗi JSON, trả về nguyên trạng (ví dụ: số, chuỗi đơn giản)
    }
  },
  remove: (key) => {
    sessionStorage.removeItem(key);
  },
  clear: () => {
    sessionStorage.clear();
  },
};

const local = {
  set: (key, value) => {
    // sessionStorage chỉ lưu trữ chuỗi. Chuyển đổi đối tượng/mảng thành JSON.
    // Nếu 'value' đã là chuỗi hoặc kiểu nguyên thủy, nó sẽ lưu trữ nguyên trạng.
    if (typeof value === "object" && value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  },
  get: (key) => {
    const value = localStorage.getItem(key);
    try {
      // Thử phân tích cú pháp dưới dạng JSON. Nếu thất bại, trả về chuỗi gốc.
      return JSON.parse(value);
    } catch (e) {
      return value; // Không phải là chuỗi JSON, trả về nguyên trạng (ví dụ: số, chuỗi đơn giản)
    }
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

export { session, local };
