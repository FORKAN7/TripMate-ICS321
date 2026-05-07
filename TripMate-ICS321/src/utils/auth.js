const API = "http://localhost:3001/api";

export const registerUser = async ({ fullName, email, password }) => {
    try {
        const res = await fetch(`${API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, password }),
        });
        const data = await res.json();
        if (!res.ok) return { success: false, message: data.message };
        localStorage.setItem("tripmate_token", data.token);
        return { success: true, user: data.user };
    } catch (error) {
        return { success: false, message: "Server error. Please try again." };
    }
};

export const loginUser = async ({ email, password }) => {
    try {
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) return { success: false, message: data.message };
        localStorage.setItem("tripmate_token", data.token);
        return { success: true, user: data.user };
    } catch (error) {
        return { success: false, message: "Server error. Please try again." };
    }
};

export const checkEmailExists = async (email) => {
    try {
        const res = await fetch(`${API}/auth/check-email?email=${email}`);
        const data = await res.json();
        return data.exists;
    } catch (error) {
        return false;
    }
};

export const getToken = () => localStorage.getItem("tripmate_token");

export const logout = () => localStorage.removeItem("tripmate_token");