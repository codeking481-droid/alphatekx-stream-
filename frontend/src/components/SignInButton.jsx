export const SignInButton = () => {
  const handleSignIn = async () => {
    try {
      const res = await fetch('/api/auth/url');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {}
    // fallback — direct hit (backend will redirect if configured as redirect)
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
