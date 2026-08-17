// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";

// export default function Profile(){
//  const {user,setUser}=useAuth(); const [form,setForm]=useState({name:"",bio:""}); const [saved,setSaved]=useState(false);
//  useEffect(()=>{setForm({name:user.name,bio:user.bio||""})},[user]);
//  async function save(e){e.preventDefault(); const r=await api.put("/users/profile",form); setUser(r.data); setSaved(true); setTimeout(()=>setSaved(false),2000);}
//  return <><Navbar/><main className="profile card"><div className="bigavatar">{user.name[0].toUpperCase()}</div><h1>{user.name}</h1><p>{user.email}</p><form onSubmit={save}><label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Bio<textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/></label><button className="primary">Save Profile</button>{saved&&<span className="success"> Profile updated!</span>}</form></main></>;
// }
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    bio: "",
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      bio: user.bio || "",
    });
  }, [user]);

  if (!user) {
    return null;
  }

  const userName = user.name || "User";
  const firstLetter = userName.charAt(0).toUpperCase();

  const username = userName
    .toLowerCase()
    .replace(/\s+/g, "");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) return;

    try {
      setSaving(true);

      const response = await api.put(
        "/users/profile",
        {
          name: form.name.trim(),
          bio: form.bio,
        }
      );

      setUser(response.data);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="profile-page">

        <div className="profile-cover"></div>

        <section className="profile-card">

          <div className="profile-header">

            <div className="profile-avatar">
              {firstLetter}
            </div>

            <button
              className="secondary"
              onClick={() =>
                document
                  .getElementById("profile-form")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Edit Profile
            </button>

          </div>

          <h1 className="profile-name">
            {userName}
          </h1>

          <div className="profile-email">
            @{username} · {user.email}
          </div>

          <p className="profile-bio">
            {user.bio ||
              "Welcome to my ConnectHub profile. I'm building my digital presence and connecting with the community."}
          </p>

          <div className="profile-stats">

            <div className="profile-stat">
              <strong>0</strong>
              <span>Posts</span>
            </div>

            <div className="profile-stat">
              <strong>0</strong>
              <span>Followers</span>
            </div>

            <div className="profile-stat">
              <strong>0</strong>
              <span>Following</span>
            </div>

          </div>

          <form
            id="profile-form"
            className="profile-form"
            onSubmit={handleSubmit}
          >

            <h3
              style={{
                fontFamily: "Space Grotesk",
                marginBottom: "20px",
              }}
            >
              Profile Settings
            </h3>

            <label>
              Display Name

              <input
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                placeholder="Your name"
              />
            </label>

            <label>
              Bio

              <textarea
                value={form.bio}
                maxLength={250}
                onChange={(event) =>
                  setForm({
                    ...form,
                    bio: event.target.value,
                  })
                }
                placeholder="Tell people a little about yourself..."
              />
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >

              <button
                className="primary"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              {saved && (
                <span className="success">
                  ✓ Profile updated
                </span>
              )}

            </div>

          </form>

        </section>

      </main>
    </>
  );
}