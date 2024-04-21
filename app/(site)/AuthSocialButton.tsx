import { IconType } from "react-icons";
interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
}
const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full justify-center rounded-lg bg-neutral-800 px-4 py-2 text-white shadow-sm  ring-inset ring-gray-300 hover:bg-neutral-700 focus:outline-offset-0"
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
