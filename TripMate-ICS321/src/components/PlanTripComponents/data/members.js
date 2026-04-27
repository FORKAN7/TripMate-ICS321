// We only start with the organizer (the logged-in user)
// Other members are added dynamically by email during the trip

const initialMembers = [
    {
        id: 1,
        name: "You",         // will be replaced with actual user name after login
        email: "you@email.com",
        role: "Organizer"
    }
    // more members get added when organizer types an email and clicks Add
];

export default initialMembers;