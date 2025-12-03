import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  console.log(user);
  return (
    <div className="flex justify-between">
      <div onClick={() => navigate("/")}>Header Logo</div>
      {user && user !== null ? (
        <div
          onClick={() => {
            signOut();
            navigate("/login");
          }}
        >
          로그아웃
        </div>
      ) : (
        <div className="flex gap-4">
          <div
            onClick={() => {
              navigate("/login");
            }}
          >
            로그인
          </div>
          <div
            onClick={() => {
              navigate("/signup");
            }}
          >
            회원가입
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
