export const SignInButton = () => {
  const handleSignIn = () => {
    window.location.href = '/api/auth/url';
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition shadow-lg hover:shadow-gold/30"
    >
      Sign in with YouTube →
    </button>
  );
};
