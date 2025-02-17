import "../styles/UserGreeting.css"

const UserGreeting = () => {
  return (
    <div className="user-greeting col-md-12">
      <img
        src="https://ui-avatars.com/api/?name=Admin&background=1A4756&color=fff&size=128"
        alt="Perfil Admin"
        className="user-greeting__avatar"
      />
      <h1 className="user-greeting__text">¡Buenos días Admin!</h1>
    </div>
  );
};

export default UserGreeting;