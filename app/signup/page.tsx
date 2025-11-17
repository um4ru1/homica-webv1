import SignInForm from '../signin/SignInForm'; 
// Kita sementara pakai SignInForm dulu karena fiturnya mirip (Sign In/Sign Up)
// Nanti Anda bisa duplikasi SignInForm jadi SignUpForm untuk membedakan judulnya.

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#020d24]">
      {/* Kita gunakan Form yang sama dulu agar tidak error */}
      <SignInForm />
    </div>
  );
}