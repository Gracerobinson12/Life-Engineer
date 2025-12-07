export default function ProfileUI({ user }) {
  const displayName = user.name || user.email.split("@")[0];

  return (
    <div>
      {/* your UI */}
      <p>{displayName}</p>
      <p>{user.email}</p>
      ...
    </div>
  );
}
