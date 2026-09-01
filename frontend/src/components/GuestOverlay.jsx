import { SignInButton } from './SignInButton';

export const GuestOverlay = ({ children, message }) => {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-[#0B0215]/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
        <div className="text-center p-6">
          <p className="text-white text-lg font-semibold">{message || 'Sign in to interact'}</p>
          <div className="mt-4">
            <SignInButton />
          </div>
        </div>
      </div>
    </div>
  );
};
