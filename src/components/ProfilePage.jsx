import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export function ProfilePage({ userId, onStartChat }) {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ display_name: '', bio: '', skills: [], fandoms: [] });
  const [skillInput, setSkillInput] = useState('');
  const [fandomInput, setFandomInput] = useState('');
  const [tab, setTab] = useState('posts'); // posts | followers | following
  const [lists, setLists] = useState({ followers: [], following: [] });

  const isOwn = !userId || String(userId) === String(user?.id);
  const pid = isOwn ? user?.id : userId;

  const load = async () => {
    const data = isOwn ? { ...user } : await api.getUser(userId);
    if (data.followers === undefined) {
      const full = await api.getUser(data.id);
      Object.assign(data, full);
    }
    setProfile(data);
    setForm({ display_name: data.display_name || '', bio: data.bio || '', skills: data.skills || [], fandoms: data.fandoms || [] });
    const [fl, fg] = await Promise.all([api.getFollowers(data.id), api.getFollowing(data.id)]);
    setLists({ followers: fl, following: fg });
  };
  useEffect(() => { if (pid) load(); }, [userId, user?.id]);

  const save = async () => {
    const r = await api.updateUser(user.id, form);
    if (r.id) { updateUser(r); setProfile({ ...profile, ...r }); setEditing(false); }
  };

  const toggleFollow = async () => {
    const r = await api.toggleFollow(pid);
    setProfile(p => ({ ...p, is_following: r.following, followers: String(+p.followers + (r.following ? 1 : -1)) }));
  };

  const startChat = async () => {
    const c = await api.createConversation(pid);
    onStartChat?.(c.id);
  };

  if (!profile) return <div style={s.loading}>Loading...</div>;
  const shown = tab === 'followers' ? lists.followers : tab === 'following' ? lists.following : [];

  return (
    <div style={s.container}>
      <div style={s.header}>
        <img src={profile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`} alt="" style={s.avatar} />
        <div style={{ flex: 1 }}>
          <h1 style={s.name}>{profile.display_name || profile.username}</h1>
          <p style={s.handle}>@{profile.username}</p>
          <div style={s.counts}>
            <span><b style={s.n}>{profile.posts ?? '—'}</b> posts</span>
            <span style={s.click} onClick={() => setTab('followers')}><b style={s.n}>{profile.followers ?? '—'}</b> followers</span>
            <span style={s.click} onClick={() => setTab('following')}><b style={s.n}>{profile.following ?? '—'}</b> following</span>
          </div>
        </div>
      </div>

      <div style={s.row}>
        {isOwn
          ? !editing && <button style={s.ghost} onClick={() => setEditing(true)}>Edit Profile</button>
          : <>
              <button style={s.primary} onClick={toggleFollow}>{profile.is_following ? 'Unfollow' : 'Follow'}</button>
              <button style={s.ghost} onClick={startChat}>Message</button>
            </>}
      </div>

      {editing ? (
        <div style={s.form}>
          <input style={s.input} placeholder="Display Name" value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} />
          <textarea style={s.input} placeholder="Bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input style={{ ...s.input, flex: 1 }} placeholder="Add skill..." value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && skillInput.trim()) { setForm({ ...form, skills: [...form.skills, skillInput.trim()] }); setSkillInput(''); } }} />
          </div>
          <div style={s.tags}>{form.skills.map((x, i) => <span key={i} style={s.tag}>{x}</span>)}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input style={{ ...s.input, flex: 1 }} placeholder="Add fandom..." value={fandomInput} onChange={e => setFandomInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && fandomInput.trim()) { setForm({ ...form, fandoms: [...form.fandoms, fandomInput.trim()] }); setFandomInput(''); } }} />
          </div>
          <div style={s.tags}>{form.fandoms.map((x, i) => <span key={i} style={s.tag}>{x}</span>)}</div>
          <button style={s.primary} onClick={save}>Save</button>
        </div>
      ) : (
        <>
          {profile.bio && <p style={s.bio}>{profile.bio}</p>}
          {profile.skills?.length > 0 && <div style={s.tags}>{profile.skills.map((x, i) => <span key={i} style={s.tag}>{x}</span>)}</div>}
          {profile.fandoms?.length > 0 && <div style={s.tags}>{profile.fandoms.map((x, i) => <span key={i} style={{ ...s.tag, background: 'rgba(113,147,255,0.15)', color: '#7193ff' }}>{x}</span>)}</div>}
        </>
      )}

      {(tab === 'followers' || tab === 'following') && (
        <div style={s.list}>
          <h3 style={s.listTitle}>{tab} ({shown.length}) <span style={s.close} onClick={() => setTab('posts')}>✕</span></h3>
          {shown.map(u => (
            <div key={u.id} style={s.person}>
              <img src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`} alt="" style={s.pavatar} />
              <div><div style={s.pname}>{u.display_name || u.username}</div><div style={s.handle}>@{u.username}</div></div>
            </div>
          ))}
          {shown.length === 0 && <p style={s.handle}>Nobody here yet.</p>}
        </div>
      )}
    </div>
  );
}

const s = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '24px 16px' },
  loading: { textAlign: 'center', color: '#94a3b8', padding: '48px' },
  header: { display: 'flex', gap: '16px', alignItems: 'center' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' },
  name: { color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: 0 },
  handle: { color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0' },
  counts: { display: 'flex', gap: '14px', color: '#94a3b8', fontSize: '0.85rem', marginTop: '8px' },
  n: { color: '#fff' },
  click: { cursor: 'pointer' },
  row: { display: 'flex', gap: '8px', margin: '16px 0' },
  primary: { flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#ff4500', color: '#fff', fontWeight: 700, cursor: 'pointer' },
  ghost: { flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff', fontWeight: 600, cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '12px', borderRadius: '8px', border: 'none', outline: 'none', background: '#1e293b', color: '#fff', fontSize: '0.9rem' },
  bio: { color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' },
  tag: { padding: '4px 12px', borderRadius: '999px', background: 'rgba(255,69,0,0.15)', color: '#ff4500', fontSize: '0.8rem', fontWeight: 600 },
  list: { marginTop: '20px', background: '#1e293b', borderRadius: '12px', padding: '14px' },
  listTitle: { color: '#fff', fontSize: '0.9rem', margin: '0 0 10px', textTransform: 'capitalize' },
  close: { float: 'right', cursor: 'pointer', color: '#94a3b8' },
  person: { display: 'flex', gap: '12px', alignItems: 'center', padding: '8px 0' },
  pavatar: { width: '40px', height: '40px', borderRadius: '50%' },
  pname: { color: '#fff', fontSize: '0.9rem', fontWeight: 600 },
};
