const USERS_KEY = "tripmate_users";

const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const checkEmailExists = (email) => {
    const users = getUsers();
    return !!users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const registerUser = ({ fullName, email, password, role, joinedAt }) => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: "An account with this email already exists." };
    }
    const newUser = { fullName, email, password, role, joinedAt };
    saveUsers([...users, newUser]);
    return { success: true, user: { name: fullName, email, role, joinedAt } };
};

export const loginUser = ({ email, password }) => {
    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, message: "No account found with this email." };
    if (found.password !== password) return { success: false, message: "Invalid email or password. Please try again." };
    return { success: true, user: { name: found.fullName, email: found.email, role: found.role, joinedAt: found.joinedAt } };
};
