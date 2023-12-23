import Image from "next/image";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profileRight">
      <div className="profileRightTop">
        <div className="profileCover">
          <Image
            className="profileCoverImg"
            src="/uploads/cover.jpeg"
            alt="logo"
            width={28}
            height={28}
          />
          <Image
            className="profileUserImg"
            src="/uploads/profile.jpeg"
            alt="logo"
            width={28}
            height={28}
          />
        </div>
        <div className="profileInfo">
          <h4 className="profileInfoName">Mrinal Kar</h4>
          <span className="profileInfoDesc">Capturing all the way...</span>
        </div>
      </div>
      {/* <div className="profileRightBottom">
              <Feed username={params.username} />
              <Rightbar user={user} />
            </div> */}
    </div>
  );
};

export default Profile;
